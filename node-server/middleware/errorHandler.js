const path = require('path');

// Middleware for handling 404 errors (Not Found)
const handle404Error = (req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, '../public', '404.html'));
};

// Middleware for handling 401 errors (Unauthorized)
const handle401Error = (err, req, res, next) => {
  if (err.status === 401) {
    res.status(401).sendFile(path.join(__dirname, '../public', '401.html'));
  } else {
    next(err);
  }
};

// Middleware for handling generic errors (500 - Internal Server Error)
const handleGenericError = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(__dirname, '../public', '500.html'));
};

module.exports = {
  handle404Error,
  handle401Error,
  handleGenericError,
};