/**
 * server.js
 * This file is the entry point for the application (node server)
 * 
 */

// Importing the required modules
const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

// Setting up the static files
app.use(express.static(path.join(__dirname, 'build')));

// Serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

// Starting the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  console.log(`http://localhost:${port}`);
  console.log(__dirname);
});