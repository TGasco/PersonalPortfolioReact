// routes/index.js
const express = require('express');
const path = require('path');
const router = express.Router();
const cache = require('../middleware/scheduler'); // Import the cache from scheduler.js

// --- API (v1) routes ---
// Example of an API route
router.get('/api/v1/data', (req, res) => {
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
    console.log('Project data not found in cache.');
    res.status(404).json({ error: 'Data not found in cache.' });
  }
});

// --- Page routes ---
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'about.html'));
});

// Add more routes as needed...

module.exports = router;