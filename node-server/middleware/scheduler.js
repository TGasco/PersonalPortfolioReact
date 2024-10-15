const cron = require('node-cron');
const { fetchPortfolioData } = require('../database/gitHubInterface');
const { uploadToS3, checkFileInS3, getMimeType, getFromS3 } = require('../database/awsInterface');
const { processImageBuffers } = require('../utils/imgResize');
const { computeHash } = require('../utils/hashing');
const NodeCache = require('node-cache');
const fs = require('fs');
const { extname } = require('path');
require('dotenv').config();

const cache = new NodeCache({ stdTTL: 86460 }); // Cache for 1 day and 1 minute (to account for potentially slow responses)

const user = process.env.GITHUB_USER;
const cacheKey = `projects_${user}`;

// Function to fetch data from GitHub and update the cache
async function updateCache(attempts = 0, maxAttempts = 3) {
  if (attempts >= maxAttempts) {
    console.error(`Failed to update cache after ${maxAttempts} attempts. There may be an issue with the data source.`);
    return;
  }
  try {
    // Fetch project data from S3
    const key = `data/projectData.json`;
    const data = await getFromS3(process.env.AWS_GITHUB_BUCKET, key);
    const projectData = JSON.parse(data.Body.toString());
    // Update the cache
    cache.set(cacheKey, projectData, 86460); // Cache for 1 day and 1 minute (to account for potentially slow responses)
    console.log('Cache updated successfully.');
  } catch (error) {
    console.error('Error updating cache:', error);
    // Extend the cache TTL if an error occurs
    // reset the TTL to 1 day and 1 minute
    cache.ttl(cacheKey, 86460);
    console.log("Retrying cache update in 5 minutes...");
    setTimeout(updateCache, 300000, attempts + 1, maxAttempts);
  }
}

async function syncWithS3() {
  // Define the target resolutions
  const resolutions = {
    small: { width: 320, height: null },  // e.g., mobile size
    medium: { width: 768, height: null }, // e.g., tablet size
    large: { width: null, height: null }, // original size
  };

  // Define the output formats
  const formats = ['jpg', 'webp', 'avif'];

  try {
    // Fetch data from GitHub
    const data = await fetchPortfolioData(user);
    // Process image buffers for each project
    for (const project of data) {
      // Hotfix: Remove fileExt from image property (if it exists)
      const fileExt = extname(project.image);
      if (fileExt) {``
        project.image = project.image.split('.')[0];
      }
      // Initialize the URI info for the project
      const uriInfo = {
        small: { jpg: '', webp: '', avif: '' },
        medium: { jpg: '', webp: '', avif: '' },
        large: { jpg: '', webp: '', avif: '' },
      }

      // Copy the image buffer to a new property for processing, then remove the original buffer
      const imageBuffer = project.imageBuffer;
      delete project.imageBuffer;

      // First we should check if the image already exists in S3 before doing any processing
      const md5Hash = computeHash(imageBuffer);
      const checkKey = `img/original/${project.image}-original.${fileExt || 'jpg'}`;
      if (await checkFileInS3(process.env.AWS_GITHUB_BUCKET, checkKey, md5Hash)) {
        console.log(`Image already exists unchanged in S3. Skipping processing.`);
        // Update the project data with the S3 URIs
        const bucketUri = `https://${process.env.AWS_GITHUB_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`;
        continue;
      } else {
        // Upload the original image to S3
        const originalBucketUri = await uploadToS3(process.env.AWS_GITHUB_BUCKET, checkKey, imageBuffer, getMimeType(checkKey));
      }

      const processedData = await processImageBuffers([imageBuffer], resolutions, formats);
      // Upload the processed images to S3
      for (const image of processedData) {
        const key = `img/${image.format}/${image.size}/${project.image}-${image.size}.${image.format}`;
        const contentType = `image/${image.format}`;
        const bucketUri = await uploadToS3(process.env.AWS_GITHUB_BUCKET, key, image.buffer, contentType);
        // const bucketUri = key; // For testing (comment out for production)
        uriInfo[image.size][image.format] = bucketUri;
      }
    }
    // Upload the project data to S3
    const dataKey = `data/projectData.json`;
    const dataContent = JSON.stringify(data);
    const dataContentType = 'application/json';
    await uploadToS3(process.env.AWS_GITHUB_BUCKET, dataKey, dataContent, dataContentType);
    
    console.log('Data synced with S3 successfully.');
    // Save the updated data to file (for testing)

  } catch (error) {
    console.error('Error syncing data with S3:', error);
  }
}

// Schedule the task to run once per day at 04:00 (GMT)
cron.schedule('0 4 * * *', () => {
  syncWithS3().then(() => {
    updateCache();
  });
});


// Initial S3 sync and cache update on server start
syncWithS3().then(() => {
  updateCache();
});

module.exports = cache;