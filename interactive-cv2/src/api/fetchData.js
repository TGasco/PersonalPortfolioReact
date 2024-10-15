// fetchData.js
// This file contains functions to fetch image data from the server or local storage.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import cacheManager from './cacheReq';

// ----------------- Functions -----------------

/**
 * Get the local image path for a given image source.
 * @param {string} src - The image source
 * @param {string} format - The image format (jpg, webp, avif)
 * @param {string} size - The image size (small, medium, large)
 * @returns {string} The local image path
 */
const getLocalImagePath = (src, format, size) => {
    const imgRoot = `${process.env.REACT_APP_ASSET_PATH}/${process.env.REACT_APP_IMAGE_PATH}`;
    const path = `../${imgRoot}/${format}/${size}/${src}-${size}.${format}`;

    // Try to retrieve from cache
    const cachedData = cacheManager.get(path);
    if (cachedData) {
        // console.log('Using cached data:', cachedData);
        return cachedData;
    }

    try {
    const image = require(`../${imgRoot}/${format}/${size}/${src}-${size}.${format}`);
    // Cache the image
    cacheManager.set(path, image);
    return image;

    } catch (error) {
    // console.error("Local image not found:", error);
    return null;
    }
};

/**
 * Fetch image metadata from the external server.
 * @param {string} src - The image source
 * @returns {Promise<Object>} A promise that resolves with the image metadata
 */
const fetchImageUri = async (src) => {
  const server = getServerUrl();
  const uri = `${server}/api/v1/image/${src}/metadata`; // API endpoint for image metadata

  // Check if the data is already cached
  const cachedData = cacheManager.get(uri);
  if (cachedData) {
    // console.log('Using cached data:', cachedData);
    return cachedData.urls;
  } else {
    console.log('Fetching image metadata from the server...');
  }

  // If not cached, fetch from the server
  const response = await fetch(uri);
  if (!response.ok) {
    throw new Error(`Failed to fetch image metadata: ${response.statusText}`);
  }

  const metadata = await response.json();

  // Cache the response
  cacheManager.set(uri, metadata);

  return metadata.urls; // Returns pre-signed URLs for different formats and sizes
};

/**
 * Get the S3 URI for a given bucket, region, and key.
 * @param {*} bucket - The S3 bucket name
 * @param {*} region - The S3 region
 * @param {*} key - The S3 object key
 * @returns {string} The S3 URI
 */
const getS3Uri = (bucket, region, key) => {
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

/**
 * Get the image URIs for different formats and sizes.
 * @param {string} filename - The filename of the image
 * @returns {Object} The image URIs for different formats and sizes
 */
const getImageUris = (filename) => {
    const sizes = ['small', 'medium', 'large'];
    const formats = ['jpg', 'webp', 'avif'];
    const urls = {};
    formats.forEach(format => {
        urls[format] = {};
        sizes.forEach(size => {
            urls[format][size] = getImageUri(filename, format, size);
        });
    });
    return urls;
};

/**
 * Get the image URI for a given filename, format, and size.
 * @param {string} filename 
 * @param {string} format 
 * @param {string} size 
 * @returns {string} The image URI
 */
const getImageUri = (filename, format, size) => {
    const bucket = process.env.REACT_APP_AWS_BUCKET;
    const region = process.env.REACT_APP_AWS_REGION;
    return getS3Uri(bucket, region, `img/${format}/${size}/${filename}-${size}.${format}`);
}

/**
 * Fetch data from S3 using the given bucket, region, and key.
 * @param {*} bucket - The S3 bucket name
 * @param {*} region - The S3 region
 * @param {*} key - The S3 object key
 * @returns {Promise<*>} A promise that resolves with the fetched data
 */
const fetchFromS3 = async (bucket, region, key) => {
    const uri = getS3Uri(bucket, region, key);

    // Check if the data is already cached
    const cachedData = cacheManager.get(uri);
    if (cachedData) {
        console.log('Using cached data:', cachedData);
        return cachedData;
    } else {
        console.log('Fetching data from S3...');
    }

    const response = await fetch(uri);
    if (!response.ok) {
        console.error(`Failed to fetch data from S3: ${response.statusText}`);
        // Fallback to local data
        return null;
    }

    const data = await parseResponse(response);

    // Cache the response
    cacheManager.set(uri, data);

    return data;
};

/**
 * Parse the response data based on the content type.
 * @param {*} response - The response object
 * @returns {Promise<*>} The parsed response data
 */
const parseResponse = async (response) => {
    // Handle different types of data
    const contentType = response.headers.get('content-type');
    switch (contentType) {
        case 'application/json':
            return await response.json();
        case 'image/jpeg':
        case 'image/png':
        case 'image/webp':
        case 'image/avif':
            return await response.blob();
        case 'application/pdf':
            return await response.blob();
        default:
            return await response.text();
    }
};

const getServerUrl = () => {
    const protocol = process.env.REACT_APP_SERVER_HTTPS ? 'https' : 'http';
    if (process.env.REACT_APP_PRODUCTION) {
        return `${protocol}://${process.env.REACT_APP_SERVER_PROD_URL}`;
    } else {
        return `${protocol}://${process.env.REACT_APP_SERVER_DEV_URL}:${process.env.REACT_APP_SERVER_DEV_PORT}`;
    }
};

// ----------------- Export -----------------
export { getLocalImagePath, fetchImageUri, getImageUris, getS3Uri, fetchFromS3 };