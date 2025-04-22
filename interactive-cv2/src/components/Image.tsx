// Image.tsx
// This file contains the Image component.
// Author: Thomas Gascoyne

// ----------------- Imports -----------------
import React, { useState, useEffect } from "react";
import { getLocalImagePath } from "../api/fetchData";

// Define the props interface for the Image component
interface ImageProps {
    src: {
        avif?: { small: string; medium: string; large: string };
        webp?: { small: string; medium: string; large: string };
        jpg?: { small: string; medium: string; large: string };
    } | string;
    alt: string;
    link: string;
    className?: string;
    localSrc?: boolean;
}

/**
 * The Image component.
 * @param {ImageProps} props - The props for the Image component
 * @returns {JSX.Element} The Image component.
 */
const Image: React.FC<ImageProps> = ({ src, alt, link, className = "", localSrc = false }) => {
    // ----------------- State and Ref Hooks -----------------
    const [imageSrcSet, setImageSrcSet] = useState<{
        avif: { small: string | null; medium: string | null; large: string | null };
        webp: { small: string | null; medium: string | null; large: string | null };
        jpg: { small: string | null; medium: string | null; large: string | null };
    }>({
        avif: { small: "", medium: "", large: "" },
        webp: { small: "", medium: "", large: "" },
        jpg: { small: "", medium: "", large: "" },
    });

    const [fallbackSrc, setFallbackSrc] = useState<string | null>(null); // For fallback img
    const [isLoading, setIsLoading] = useState<boolean>(true); // Track loading state

    // ----------------- useEffects -----------------
    useEffect(() => {
        if (localSrc) {
            // Handle loading images from local filesystem
            setImageSrcSet({
                avif: {
                    small: getLocalImagePath(src as string, "avif", "small"),
                    medium: getLocalImagePath(src as string, "avif", "medium"),
                    large: getLocalImagePath(src as string, "avif", "large"),
                },
                webp: {
                    small: getLocalImagePath(src as string, "webp", "small"),
                    medium: getLocalImagePath(src as string, "webp", "medium"),
                    large: getLocalImagePath(src as string, "webp", "large"),
                },
                jpg: {
                    small: getLocalImagePath(src as string, "jpg", "small"),
                    medium: getLocalImagePath(src as string, "jpg", "medium"),
                    large: getLocalImagePath(src as string, "jpg", "large"),
                },
            });
            // Set fallback to small jpg image
            setFallbackSrc(getLocalImagePath(src as string, "jpg", "small"));
            setIsLoading(false); // Set loading to false after setting image sources
        } else {
            // Fetch pre-signed URLs from the server for external images
            if (typeof src !== "string" && src?.jpg) {
                setImageSrcSet({
                    avif: src.avif || { small: "", medium: "", large: "" },
                    webp: src.webp || { small: "", medium: "", large: "" },
                    jpg: src.jpg || { small: "", medium: "", large: "" },
                });
                setFallbackSrc(src.jpg.small); // Use small jpg as fallback
                setIsLoading(false); // Set loading to false if image is already loaded
            } else {
                console.warn("No image data found for:", src);
            }
        }
    }, [src, localSrc]);

    const fetchImage = (format: "avif" | "webp" | "jpg", size: "small" | "medium" | "large"): string | null => {
        return imageSrcSet[format][size];
    };

    // ----------------- Render -----------------
    return (
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={`img-container`}
            >
                {isLoading ? (
                    <div className="image-placeholder" style={{ width: "100%", paddingTop: "56.25%" }}></div> // Placeholder with aspect ratio
                ) : (
                    <picture>
                        {/* avif source */}
                        <source
                            type="image/avif"
                            srcSet={`${fetchImage("avif", "small")} 300w, ${fetchImage("avif", "medium")} 768w, ${fetchImage("avif", "large")} 1280w`}
                            sizes="(max-width: 735px) 100vw, 736px"
                        />

                        {/* webp source */}
                        <source
                            type="image/webp"
                            srcSet={`${fetchImage("webp", "small")} 300w, ${fetchImage("webp", "medium")} 768w, ${fetchImage("webp", "large")} 1280w`}
                            sizes="(max-width: 735px) 100vw, 736px"
                        />

                        {/* jpg source */}
                        <source
                            type="image/jpeg"
                            srcSet={`${fetchImage("jpg", "small")} 300w, ${fetchImage("jpg", "medium")} 768w, ${fetchImage("jpg", "large")} 1280w`}
                            sizes="(max-width: 735px) 100vw, 736px"
                        />

                        {/* Fallback img */}
                        <img
                            src={fallbackSrc || ""}
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