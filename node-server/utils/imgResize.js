const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { format } = require('path');

// Define the target resolutions
const resolutions = {
    small: { width: 320, height: null },  // e.g., mobile size
    medium: { width: 768, height: null }, // e.g., tablet size
    large: { width: null, height: null }, // original size
};

// Define the output formats
const formats = ['jpg', 'png', 'webp', 'avif'];

/* Resize and format an image for each specified resolution and format.
 * @param {sharp.Sharp} image - The sharp image object.
 * @param {Object} resolutions - Object containing resolutions with width and height.
 * @param {string[]} formats - Array of formats to convert the images to.
 * @param {Function} saveCallback - Callback function to handle saving the processed image.
 */
async function processImageWithResolutions(image, resolutions, formats, saveCallback) {
    const metadata = await image.metadata();

    for (const [size, { width, height }] of Object.entries(resolutions)) {
        for (const format of formats) {
            console.log(`Processing image to format: ${format}, size: ${size}`);

            // Resize the image based on the specified width/height while maintaining aspect ratio
            const processedBuffer = await processImage(image, format, { width: (width || metadata.width), height: (height || metadata.height) });

            // Use the callback to handle the processed buffer
            await saveCallback(processedBuffer, format, size);

            console.log(`Processed image to format: ${format}, size: ${size}`);
        }
    }
}

/**
 * Resize and save images in different resolutions and formats, sorted by format and size.
 * @param {string[]} filePaths - Array of image file paths.
 */
async function processImages(filePaths) {
    for (const filePath of filePaths) {
        try {
            const image = sharp(filePath);
            const inputDir = path.dirname(filePath);
            const fileName = path.basename(filePath, path.extname(filePath));

            await processImageWithResolutions(image, resolutions, formats, async (processedBuffer, format, size) => {
                // Define the output directory structure
                const outputDir = path.join(inputDir, format, size);
                const outputFileName = `${fileName}-${size}.${format}`;
                const outputPath = path.join(outputDir, outputFileName);

                // Ensure the output directory exists
                fs.mkdirSync(outputDir, { recursive: true });

                console.log(`Saving: ${outputPath}`);

                // Save the buffer to the output file
                fs.writeFileSync(outputPath, processedBuffer);

                console.log(`Saved: ${outputPath}`);
            });
        } catch (error) {
            console.error(`Error processing ${filePath}:`, error);
        }
    }
}

/**
 * Resize and process images in different resolutions and formats, returning the processed images as buffers.
 * @param {Buffer[]} imageBuffers - Array of image buffers.
 * @param {Object} resolutions - Object containing resolutions with width and height.
 * @param {string[]} formats - Array of formats to convert the images to.
 * @returns {Promise<{ buffer: Buffer, format: string, size: string }[]>} - Array of processed images with format and size.
 */
async function processImageBuffers(imageBuffers, resolutions, formats) {
    const processedImages = [];
    for (const imageBuffer of imageBuffers) {
        try {
            const image = sharp(imageBuffer);

            await processImageWithResolutions(image, resolutions, formats, async (processedBuffer, format, size) => {
                // Add the processed buffer to the array
                processedImages.push({ buffer: processedBuffer, format, size });
            });
        } catch (error) {
            console.error(`Error processing image buffer:`, error);
        }
    }

    return processedImages;
}

/**
 * Resize and process an image to a specific format and size.
 * @param {sharp.Sharp} image - The sharp image object.
 * @param {string} format - The format to convert the image to.
 * @param {Object} size - The size object containing width and height.
 * @param {boolean} [keepAspectRatio=true] - Whether to maintain the aspect ratio.
 * @returns {Promise<Buffer>} - The processed image buffer.
 */
async function processImage(image, format, size, keepAspectRatio = true) {
    const width = size.width;
    const height = size.height;

    return image
        .resize({
            width,
            height,
            fit: keepAspectRatio ? 'inside' : 'cover',
            withoutEnlargement: true
        })
        .toFormat(format)
        .toBuffer();
}

/**
 * Get all image file paths from a directory.
 * @param {string} dir - The directory path.
 * @returns {string[]} - Array of image file paths.
 */
function getImagesFromDirectory(dir) {
    return fs.readdirSync(dir)
        .filter(file => ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase()))
        .map(file => path.join(dir, file));
}

// Main function to handle command-line arguments
async function main() {
    const args = process.argv.slice(2); // Capture command-line arguments (excluding node and script name)

    if (args.length === 0) {
        console.error('Please provide either a directory or a list of image file paths.');
        process.exit(1);
    }

    let filePaths = [];

    if (args.length === 1 && fs.lstatSync(args[0]).isDirectory()) {
        // If a single directory is passed, get all image files from the directory
        filePaths = getImagesFromDirectory(args[0]);
    } else {
        // Otherwise, treat arguments as individual file paths
        filePaths = args;
    }

    if (filePaths.length === 0) {
        console.error('No valid image files found.');
        process.exit(1);
    }

    await processImages(filePaths);
    console.log('Image processing completed.');
}

// Run the script
// main();

module.exports = { processImage, processImageBuffers };