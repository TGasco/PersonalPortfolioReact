// Image.js
// This file contains the Image component.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React, { useState, useEffect } from "react";
import { getLocalImagePath } from "../api/fetchData";

const Image = ({ src, alt, link, className = "", localSrc = false }) => {
    // ----------------- State and Ref Hooks -----------------
    const [imageSrcSet, setImageSrcSet] = useState({
        avif: { small: '', medium: '', large: '' },
        webp: { small: '', medium: '', large: '' },
        jpg: { small: '', medium: '', large: '' },
    });
    const [fallbackSrc, setFallbackSrc] = useState(null); // For fallback img
    const [isLoading, setIsLoading] = useState(true); // Track loading state

    // ----------------- useEffects -----------------
    useEffect(() => {
        if (localSrc) {
            // Handle loading images from local filesystem
            setImageSrcSet({
                avif: {
                    small: getLocalImagePath(src, 'avif', 'small'),
                    medium: getLocalImagePath(src, 'avif', 'medium'),
                    large: getLocalImagePath(src, 'avif', 'large'),
                },
                webp: {
                    small: getLocalImagePath(src, 'webp', 'small'),
                    medium: getLocalImagePath(src, 'webp', 'medium'),
                    large: getLocalImagePath(src, 'webp', 'large'),
                },
                jpg: {
                    small: getLocalImagePath(src, 'jpg', 'small'),
                    medium: getLocalImagePath(src, 'jpg', 'medium'),
                    large: getLocalImagePath(src, 'jpg', 'large'),
                },
            });
            // Set fallback to small jpg image
            setFallbackSrc(getLocalImagePath(src, 'jpg', 'small'));
            setIsLoading(false); // Set loading to false after setting image sources
        } else {
            // Fetch pre-signed URLs from the server for external images
            if (src?.jpg) {
                setImageSrcSet({
                    avif: src.avif,
                    webp: src.webp,
                    jpg: src.jpg,
                });
                setFallbackSrc(src.jpg.small); // Use small jpg as fallback
                setIsLoading(false); // Set loading to false if image is already loaded
                return;
            } else {
                console.warn('No image data found for:', src);
                return;
                // localSrc = true; // Fallback to local image
            }
        }
    }, [src, localSrc]);

    const fetchImage = (format, size) => {
        return imageSrcSet[format][size];
    };

    // ----------------- Render -----------------
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`img-container ${className}`}
        >
            {isLoading ? (
                <div className="image-placeholder" style={{ width: '100%', paddingTop: '56.25%' }}></div> // Placeholder with aspect ratio
            ) : (
                <picture>
                    {/* avif source */}
                    <source
                        type="image/avif"
                        srcSet={`${fetchImage('avif', 'small')} 300w, ${fetchImage('avif', 'medium')} 768w, ${fetchImage('avif', 'large')} 1280w`}
                        sizes="(max-width: 735px) 100vw, 736px"
                    />
                    
                    {/* webp source */}
                    <source
                        type="image/webp"
                        srcSet={`${fetchImage('webp', 'small')} 300w, ${fetchImage('webp', 'medium')} 768w, ${fetchImage('webp', 'large')} 1280w`}
                        sizes="(max-width: 735px) 100vw, 736px"
                    />
                    
                    {/* jpg source */}
                    <source
                        type="image/jpeg"
                        srcSet={`${fetchImage('jpg', 'small')} 300w, ${fetchImage('jpg', 'medium')} 768w, ${fetchImage('jpg', 'large')} 1280w`}
                        sizes="(max-width: 735px) 100vw, 736px"
                    />

                    {/* Fallback img */}
                    <img
                        src={fallbackSrc}  // Fallback small jpg
                        alt={alt}
                        className="image"
                        loading="lazy"
                    />
                </picture>
            )}
        </a>
    );
};

// ----------------- Export -----------------
export default React.memo(Image);