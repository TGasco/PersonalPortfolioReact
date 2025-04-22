// fetchData.ts
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
 * @returns {string | null} The local image path
 */
const getLocalImagePath = (src: string, format: string, size: string): string | null => {
    const imgRoot = `${process.env.REACT_APP_ASSET_PATH}/${process.env.REACT_APP_IMAGE_PATH}`;
    const path = `../${imgRoot}/${format}/${size}/${src}-${size}.${format}`;

    // Try to retrieve from cache
    const cachedData = cacheManager.get(path);
    if (cachedData) {
        return cachedData;
    }

    try {
        const image = require(`../${imgRoot}/${format}/${size}/${src}-${size}.${format}`);
        // Cache the image
        cacheManager.set(path, image);
        return image;
    } catch (error) {
        return null;
    }
};

/**
 * Fetch image metadata from the external server.
 * @param {string} src - The image source
 * @returns {Promise<string[]>} A promise that resolves with the image metadata URLs
 */
const fetchImageUri = async (src: string): Promise<string[]> => {
    const server = getServerUrl();
    const uri = `${server}/api/v1/image/${src}/metadata`; // API endpoint for image metadata

    // Check if the data is already cached
    const cachedData = cacheManager.get(uri);
    if (cachedData) {
        return cachedData.urls;
    }

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
 * @param {string} bucket - The S3 bucket name
 * @param {string} region - The S3 region
 * @param {string} key - The S3 object key
 * @returns {string} The S3 URI
 */
const getS3Uri = (bucket: string, region: string, key: string): string => {
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
};

/**
 * Get the image URIs for different formats and sizes.
 * @param {string} filename - The filename of the image
 * @returns {Record<string, Record<string, string>>} The image URIs for different formats and sizes
 */
const getImageUris = (filename: string): Record<string, Record<string, string>> => {
    const sizes = ['small', 'medium', 'large'];
    const formats = ['jpg', 'webp', 'avif'];
    const urls: Record<string, Record<string, string>> = {};

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
const getImageUri = (filename: string, format: string, size: string): string => {
    const bucket = process.env.REACT_APP_AWS_BUCKET!;
    const region = process.env.REACT_APP_AWS_REGION!;
    return getS3Uri(bucket, region, `img/${format}/${size}/${filename}-${size}.${format}`);
};

/**
 * Fetch data from S3 using the given bucket, region, and key.
 * @param {string} bucket - The S3 bucket name
 * @param {string} region - The S3 region
 * @param {string} key - The S3 object key
 * @returns {Promise<any>} A promise that resolves with the fetched data
 */
const fetchFromS3 = async (bucket: string, region: string, key: string): Promise<any> => {
    const uri = getS3Uri(bucket, region, key);

    // Check if the data is already cached
    const cachedData = cacheManager.get(uri);
    if (cachedData) {
        return cachedData;
    }

    const response = await fetch(uri);
    if (!response.ok) {
        return null;
    }

    const data = await parseResponse(response);

    // Cache the response
    cacheManager.set(uri, data);

    return data;
};

/**
 * Parse the response data based on the content type.
 * @param {Response} response - The response object
 * @returns {Promise<any>} The parsed response data
 */
const parseResponse = async (response: Response): Promise<any> => {
    const contentType = response.headers.get('content-type');
    switch (contentType) {
        case 'application/json':
            return await response.json();
        case 'image/jpeg':
        case 'image/png':
        case 'image/webp':
        case 'image/avif':
        case 'application/pdf':
            return await response.blob();
        default:
            return await response.text();
    }
};

/**
 * Get the server URL based on environment variables.
 * @returns {string} The server URL
 */
const getServerUrl = (): string => {
    const protocol = process.env.REACT_APP_SERVER_HTTPS ? 'https' : 'http';
    if (process.env.REACT_APP_PRODUCTION) {
        return `${protocol}://${process.env.REACT_APP_SERVER_PROD_URL}`;
    } else {
        return `${protocol}://${process.env.REACT_APP_SERVER_DEV_URL}:${process.env.REACT_APP_SERVER_DEV_PORT}`;
    }
};

// ----------------- Export -----------------
export { getLocalImagePath, fetchImageUri, getImageUris, getS3Uri, fetchFromS3 };
