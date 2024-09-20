require ('dotenv').config(); // Load environment variables from a .env file
const path = require('path'); // Node.js path module
const { Buffer } = require('buffer'); // Node.js Buffer module

async function fetchFromGitHub(user, repo, path) {
  // If repo is not provided, return all repositories for the user
  let uri = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
  if (!repo) {
    console.log('No repo provided');
    uri = `https://api.github.com/users/${user}/repos`;
  } else
  // If the path is not provided, default to the root directory
  if (!path) {
    console.log('No path provided');
    uri = `https://api.github.com/repos/${user}/${repo}/contents`;
  }

  const headers = {
    'Authorization': `token ${process.env.GITHUB_TOKEN}`
  };

  try {
    const responseStart = new Date();
    const response = await fetch(uri, { headers });
    
    if (!response.ok) {
      throw new Error(`GitHub API request failed with status ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    const responseEnd = new Date();
    console.log(`Fetching ${uri} took ${responseEnd - responseStart} ms`);
    return data;
  } catch (error) {
    console.error('Error fetching from GitHub:', error);
    throw error; // Re-throw the error after logging it
  }
}

async function fetchPortfolioData(user) {
  try {
    const repos = await fetchFromGitHub(user);

    const portfolioData = await Promise.all(repos.map(async (repo) => {
      const basePath = process.env.BASE_PATH || 'misc';
      const dataPath = process.env.DATA_PATH || 'data';
      const imgPath = process.env.IMG_PATH || 'img';

      const dataUri = path.join(basePath, dataPath);

      try {
        const dataResponse = await fetchFromGitHub(user, repo.name, dataUri);
        const data = JSON.parse(atob(dataResponse.content));

        const imageUri = path.join(basePath, imgPath, data.image);
        try {
          const imageResponse = await fetchFromGitHub(user, repo.name, imageUri);
          const imgData = Buffer.from(imageResponse.content, 'base64'); // Decode base64 image content

          // Convert the decoded image content to a Data URL
          const imgDataUrl = `data:image/png;base64,${imgData.toString('base64')}`;
          data.image = imgDataUrl; // Replace the image URL with the Data URL
          data.source = `https://github.com/${user}/${repo.name}`; // Add the source URL

          return data;
        } catch (err) {
          console.error('Error fetching image data:', err);
          return null;
        }
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        return null;
      }
    }));

    return portfolioData.filter(data => data !== null);
  } catch (err) {
    console.error('Error fetching repositories:', err);
    return [];
  }
}

// Use Environment Variables to retrieve the GitHub username
// fetchPortfolioData(process.env.GITHUB_USER).then(portfolioData => {
// // Update your portfolio with the fetched data
//   console.log("Portfolio Data:");
//   console.log(portfolioData);
// });

// Export the fetchPortfolioData function
module.exports = { fetchPortfolioData };