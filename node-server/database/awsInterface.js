const { Upload } = require('@aws-sdk/lib-storage');
const { S3 } = require('@aws-sdk/client-s3');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const fs = require('fs');
const path = require('path');
const { computeHash } = require('../utils/hashing'); // Import the computeHash function for hashing

// Import environment variables from .env file
require('dotenv').config();
// Set up S3 instance
const s3 = new S3({
  credentials: {
    // From your AWS account
    accessKeyId: process.env.AWS_ACCESS,

    // From your AWS account
    secretAccessKey: process.env.AWS_SECRET,
  },

  // Change this to your bucket's region
  region: process.env.AWS_REGION,
});

/**
 * Upload a file to an S3 bucket
 * @param {string} bucketName - The name of the bucket
 * @param {string} key - The name you want to give the file in the bucket
 * @param {Buffer} data - The actual data
 * @param {string} contentType - Optional: the content type (MIME type)
 * @returns {Promise<string>} - The URL of the uploaded file
 */
async function uploadToS3(bucketName, key, data, contentType) {
    // Generate MD5 hash of the data
    const hash = computeHash(data);

    // Compare the file in S3 with the local file (if it exists)
    const fileExists = await checkFileInS3(bucketName, key, hash);
    if (fileExists) {
        console.log('File in S3 is up to date, aborting upload');
        // Return the URL of the file in S3
      return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }
    const params = {
      Bucket: bucketName, // Name of the bucket
      Key: key, // The name you want to give the file in the bucket
      Body: data,    // The actual data
      ContentType: contentType, // Optional: the content type (MIME type)
      Metadata: {
        md5: hash  // Optional: the MD5 hash of the data
      }
    };

    try {
      const result = await new Upload({
        client: s3,
        params,
      }).done();
      console.log(`File uploaded successfully to S3: ${result.Location}`);
      return result.Location;
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw error;
    }
}

/**
 * Check if a file exists in an S3 bucket and if it is up to date.
 * @param {string} bucketName - The name of the bucket
 * @param {string} key - The name of the file in the bucket
 * @param {string} hash - The MD5 hash of the file
 * @returns {Promise<boolean>} - Whether the file exists and is up to date
 */
async function checkFileInS3(bucketName, key, hash) {
    const params = {
      Bucket: bucketName, // Name of the bucket
      Key: key // The name of the file in the bucket
    };
    try {
        const headObject = await s3.headObject(params);
        const s3MD5Hash = headObject.Metadata.md5;
        if (s3MD5Hash === hash) {
          console.log('File in S3 is up to date');
          return true;
        } else {
          console.log('File in S3 is outdated');
          return false;
        }
    } catch (error) {
        if (error.$metadata.httpStatusCode === 404) {
            console.log('File not found in S3');
            return false;
        } else {
            console.error('Error checking file in S3:', error);
            throw error;
        }
    }
}

/**
 * Get a file from an S3 bucket.
 * @param {string} bucketName - The name of the bucket
 * @param {string} key - The name of the file in the bucket
 * @returns {Promise<Buffer>} - The data of the file
 */
async function getFromS3(bucketName, key) {
    const params = {
      Bucket: bucketName, // Name of the bucket
      Key: key // The name of the file in the bucket
    };
  
    try {
      const result = await s3.getObject(params);
      console.log(`File ${key} retrieved successfully from S3`);
      const buffer = await streamToBuffer(result.Body);
      return {Body: buffer, ContentType: result.ContentType};
    } catch (error) {
      console.error('Error getting from S3:', error);
      throw error;
    }
}

/**
 * Convert a stream to a buffer.
 * @param {Stream} stream - The stream to convert
 * @returns {Promise<Buffer>} - The buffer
 */
async function streamToBuffer(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
}

/**
 * Delete a file from an S3 bucket.
 * @param {string} bucketName - The name of the bucket
 * @param {string} key - The name of the file in the bucket
 * @returns {Promise<DeleteObjectCommandOutput>} The result of the deletion
 */
async function deleteFromS3(bucketName, key) {
    const params = {
      Bucket: bucketName, // Name of the bucket
      Key: key // The name of the file in the bucket
    };
  
    try {
      const result = await s3.deleteObject(params);
      console.log(`File deleted successfully from S3`);
      return result;
    } catch (error) {
      console.error('Error deleting from S3:', error);
      throw error;
    }
}

async function generatePreSignedUrl(bucketName, key, expiresIn = 900) {
    try {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key
        });
        // Check if the file exists
        if (!(await s3.headObject({ Bucket: bucketName, Key: key }))) {
            // If the file does not exist, return null
            console.log(`File not found in S3: ${key}`);
            return null;
        }
        const url = await getSignedUrl(s3, command, { expiresIn: expiresIn });
        // console.log(`Pre-signed URL generated successfully: ${url}`);
        return url;
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        // throw error;
        return null;
    }
}


/**
 * Get the MIME type of a file based on its extension.
 * @param {string} filePath - The path to the file
 * @returns {string} - The MIME type
 */
function getMimeType(filePath) {
    const extname = path.extname(filePath).toLowerCase();
    switch (extname) {
        case '.html':
        return 'text/html';
        case '.css':
        return 'text/css';
        case '.json':
        return 'application/json';
        case '.png':
        return 'image/png';
        case '.jpg':
        case '.jpeg':
        return 'image/jpeg';
        case '.webp':
            return 'image/webp';
        case '.avif':
            return 'image/avif';
        case '.svg':
        return 'image/svg+xml';
        default:
        return 'application/octet-stream';
    }
}


// Test the functions
async function main() {
    const bucketName = process.env.AWS_GITHUB_BUCKET; // Name of the bucket
    const testKey = 'img/jpg/small/chess-in-c-small.jpg'; // The name of the file in the bucket
    const preSignedUrl = await generatePreSignedUrl(bucketName, testKey);
    console.log('Pre-signed URL:', preSignedUrl);
    // const key = 'test/test.json'; // The name you want to give the file in the bucket
    // const data = fs.readFileSync(path.join(__dirname, 'test.json')); // The actual data
    // const contentType = getMimeType(key); // Optional: the content type (MIME type)
    // // Print the data
    // console.log(data.toString());
    // // Upload the data to S3
    // const uploadRes = await uploadToS3(bucketName, key, data, contentType);
    // console.log('Upload result:', uploadRes);
    // // Check if the file exists in S3
    // // Compute the hash of the (unchanged) data
    // const hash = computeHash(data);
    // const checkRes = await checkFileInS3(bucketName, key, hash); // Should return true (as file is unchanged)
    // // Change the data and compute the new hash
    // console.log('Check result:', checkRes);
    // const newData = data.toString().replace('Portfolio Page', 'Updated Portfolio Page');
    // // Print the new data
    // console.log(newData);
    // const newHash = computeHash(newData);
    // const checkRes2 = await checkFileInS3(bucketName, key, newHash); // Should return false (as file has changed)
    // // Get the file from S3
    // const getRes = await getFromS3(bucketName, key);
    // const fileContent = getRes.toString();
    // const parsedData = JSON.parse(fileContent);
    // console.log('Parsed data:', parsedData);
    // // Log the retrieved data to check its format
    // // Delete the file from S3
    // const delRes = await deleteFromS3(bucketName, key);
    // console.log('Delete result:', delRes);
}

main(); // Run the test

// Export the functions
module.exports = { uploadToS3, checkFileInS3, getFromS3, deleteFromS3, generatePreSignedUrl, getMimeType };