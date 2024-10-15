const crypto = require('crypto');

// Compute MD5 hash for data
function computeHash(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

exports.computeHash = computeHash;