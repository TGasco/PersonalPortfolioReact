const cron = require('node-cron');
const { fetchPortfolioData } = require('../database/gitHubInterface');
const NodeCache = require('node-cache');
require('dotenv').config();

const cache = new NodeCache({ stdTTL: 86460 }); // Cache for 1 day and 1 minute (to account for potentially slow responses)

const user = process.env.GITHUB_USER;
const cacheKey = `projects_${user}`;

// Function to fetch data from GitHub and update the cache
async function updateCache() {
  try {
    console.log('Fetching data from GitHub...');
    const data = await fetchPortfolioData(user);
    cache.set(cacheKey, data);
    console.log('Cache updated successfully.');
  } catch (error) {
    console.error('Error updating cache:', error);
    // Extend the cache TTL if an error occurs
    // reset the TTL to 1 day and 1 minute
    cache.ttl(cacheKey, 86460);
    console.log("Retrying cache update in 5 minutes...");
    setTimeout(updateCache, 300000); // 5 minutes in milliseconds
  }
}

// Schedule the task to run once per day at 04:00 (GMT)
cron.schedule('0 4 * * *', () => {
  updateCache();
});

// Initial cache update on server start
updateCache();

module.exports = cache;