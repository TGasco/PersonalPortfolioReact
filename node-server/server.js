const https = require('https');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const routes = require('./routes/index');
const { handle404Error, handle401Error, handleGenericError } = require('./middleware/errorHandler');
const scheduler = require('./middleware/scheduler'); // Import the scheduler
// Load environment variables from a .env file
require('dotenv').config();

// Constants for Environment Variables
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost'; // Change to PROD_HOST for production build
const SSL_KEY = process.env.SSL_KEY || 'ssl/server.key';
const SSL_CERT = process.env.SSL_CERT || 'ssl/server.crt';

// Consatruct client domain from environment variables
const clientDomain = 'https://' + (process.env.PROD === 'true' ? process.env.PROD_ORIGIN : process.env.DEV_ORIGIN) + ':' + process.env.CLIENT_PORT;
console.log('Client domain:', clientDomain);
// Read SSL certificate files
const options = {
  key: fs.readFileSync(SSL_KEY),
  cert: fs.readFileSync(SSL_CERT)
};

app.use(cors({
  origin: clientDomain, // Allow the client domain (and subdomains)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true, // Whether to allow cookies or other credentials
  allowedHeaders: ['Content-Type', 'Authorization'], // Customize allowed headers
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Use the defined routes
app.use(routes);

// Use the 404 error-handling middleware
app.use(handle404Error);

// Use the 401 error-handling middleware
app.use(handle401Error);

// Use the generic error-handling middleware
app.use(handleGenericError);

// Handle all other routes with React (for SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Create an HTTPS server
https.createServer(options, app).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit https://${HOST}:${PORT} to view the app`);
});