// dbOps.js
// Provides functions for interacting with the MongoDB database using Mongoose.
// Author: Thomas Gascoyne

// !!! CURRENTLY UNUSED !!!
// This file is not used in the current implementation of the project.
// Though it may be used in the future to interact with a MongoDB database, if needed.

const mongoose = require('mongoose');
const { fetchPortfolioData } = require('./gitHubInterface');
const { MONGO_URI } = process.env; // Retrieve the MongoDB URI from the environment variables
const { Schema } = mongoose;

// MongoDB connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define the schema for the 'projects' collection
const projectSchema = new Schema({
  title: String, // Project title
  description: String, // Project description
  technologies: [String], // Array of technologies used
  github: String, // GitHub repository URL
  image: String, // Image URL (used to retrieve the image from GitHub and store in GridFS)
});

const Project = mongoose.model('Project', projectSchema);

const user = 'TGasco'; // GitHub username (move to environment variable later)

// Fetch and store the portfolio data in the MongoDB database
async function updatePortfolio(user) {
    const portfolioData = await fetchPortfolioData(user);
    // Ensure that the portfolioData is not empty
    if (portfolioData.length === 0) {
        console.log('No portfolio data found');
        return;
    }

    // Clear the 'projects' collection before inserting new data
    await Project.deleteMany({}).then(() => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Cleared the projects collection');
    });
    // Insert the portfolio data into the 'projects' collection
    await Project.insertMany(portfolioData).then(() => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Portfolio data inserted successfully');
    });
}