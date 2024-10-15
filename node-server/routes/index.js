// routes/index.js
const express = require('express');
const path = require('path');
const router = express.Router();
const { getFromS3, generatePreSignedUrl } = require('../database/awsInterface'); // Import the getFromS3 function from awsInterface.js
const cache = require('../middleware/scheduler'); // Import the cache object from scheduler.js
// --- API (v1) routes ---
// Example of an API route
router.get('/api/v1/example', (req, res) => {
  res.json({ message: 'This is a sample API route.' });
});

// Retrieve the projects from the cache
router.get('/api/v1/projects', (req, res) => {
  const user = process.env.GITHUB_USER;
  const cacheKey = `projects_${user}`;

  // Check if the data is in the cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log('Retrieving project data from cache...');
    res.json(cachedData);
  } else {
    // Retrieve the data from S3
    const key = `data/projectData.json`;
    getFromS3(process.env.AWS_GITHUB_BUCKET, key)
      .then(data => {
        // Parse the JSON data
        const projectData = JSON.parse(data.Body.toString());
        // Update the cache
        cache.set(cacheKey, projectData, 86400); // Cache for 1 day
        res.json(projectData);
      })
      .catch(error => {
        console.error('Error retrieving project data from S3:', error);
        res.status(500).send('Error retrieving project data from S3');
      });
  }
});

router.get('/api/v1/image/:size/:format/:filename', (req, res) => {
    const { size, format, filename } = req.params;

    // Validate size
    const validSizes = ['small', 'medium', 'large'];
    if (!validSizes.includes(size)) {
        return res.status(400).send('Invalid size parameter');
    }

    // Validate format
    const validFormats = ['jpg', 'webp', 'avif'];
    if (!validFormats.includes(format)) {
        return res.status(400).send('Invalid format parameter');
    }

    // Retrieve the image from S3
    const key = `img/${format}/${size}/${filename}-${size}.${format}`;

    generatePreSignedUrl(process.env.AWS_GITHUB_BUCKET, key).then(url => {
        if (!url) {
            return res.status(404).send('Image not found');
        }
        res.json({ url });
    }).catch(error => {
        console.error('Error generating pre-signed URL:', error);
        res.status(500).send('Error generating pre-signed URL');
    });
});

router.get('/api/v1/image/:filename/metadata', (req, res) => {
    const { filename } = req.params;
    const metadata = {
      formats: ['jpg', 'webp', 'avif'],
        sizes: ['small', 'medium', 'large'],
    };

    // Generate pre-signed URLs for size and format combinations
    const urls = {};
    const urlPromises = [];

    for (const format of metadata.formats) {
        urls[format] = {};
        for (const size of metadata.sizes) {
            const key = `img/${format}/${size}/${filename}-${size}.${format}`;
            const urlPromise = generatePreSignedUrl(process.env.AWS_GITHUB_BUCKET, key).then(url => {
                urls[format][size] = url;
            });
            urlPromises.push(urlPromise);
        }
    }

    Promise.all(urlPromises).then(() => {
        res.json({ metadata, urls });
    }).catch(error => {
        console.error('Error generating pre-signed URLs:', error);
        res.status(500).send('Error generating pre-signed URLs');
    });

});

module.exports = router;

// --- Page routes ---
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Add more routes as needed...

module.exports = router;