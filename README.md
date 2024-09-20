~# Personal Portfolio Website

This is a personal portfolio website that I have created to showcase my projects and skills as a Software Engineer. The website is built using ReactJS and styled with CSS.

The website is a single-page application (SPWA) with a responsive design optimized for screens of all sizes. 

The site is divided into several sections, including:  about me, experience, projects, and contact, which are navigable using the navigation bar at the top of the page.

The live website is hosted on AWS and can be accessed [here](https://thomasgascoyne.com/home). Check it out!

Personally Identifiable Information (PII) has been removed and replaced by sample data.

## Key Technologies Used
- ReactJS (Frontend)
- Node.js (Backend - mainly for API calls - it may also be used to serve the React App) [Optional]
- AWS (Hosting [Optional])

## Prerequisites

Before you begin, make sure you have the following software installed on your machine:

- Node.js 14.x or newer
- npm (usually comes with Node.js)

## Installation

1. Clone the repository

```
git clone https://github.com/TGasco/PersonalPortfolio.git
```

2. Navigate to the project directory

```
cd interactive-cv2
```

3. Install the dependencies

```
npm install
```

4. Start the development server

```
npm run start
```

The website should now be running on [http://localhost:3000](http://localhost:3000).

## API (Node.js) [Optional]

The React App may be used as a standalone SPWA, but it also has the capability to make API calls to a Node.js backend, namely to retrieve the data for the projects section.

The server creates a cron job that fetches data from the GitHub API every 24 hours and caches the data in memory. This data is then served to the React App when requested.

API endpoints arew defined in the `node-server/routes/index.js` file.

# Node Configuration [Optional]

1. Navigate to the `node-server` directory

```
cd node-server
```

2. Install the dependencies

```
npm install
```

3. Configure the Environment Variables [See Configuration]

4. Start the Node.js server

```
npm run start
```

The Node.js server should now be running on [http://localhost:8080](http://localhost:8080).

## Configuration

Page content is easily customizable by editing the `src/data/textData.js` file. This file contains all the data that is displayed on the website, including the sections and their content. Sample data has been provided to help you get started.

Environment variables are used to configure the Node.js backend. These variables are to be stored in a `.env` file in the `node-server` directory. Please refer to the `.mockEnv` file for the required variables.
Remember to replace the mock values with your own values, then rename the file to `.env`.

## Deployment

# Standalone Deployment
To deploy the website, you can use the following command:

```
npm run build`
```

This will create a production build of the website in the `build` directory. You can then deploy this directory to your hosting provider of choice (e.g. AWS, Netlify, Vercel, etc.). AWS has been chosen for the live deployment of this website.


# Integrated Deployment (Website + Node.js Backend)
To create an integrated build of the website and the Node.js backend, you can use the following command:

```
npm run integrate
```

This will create a production build of the website and copy it to the `node-server` directory. You can then deploy the `node-server` directory to your hosting provider of choice.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.