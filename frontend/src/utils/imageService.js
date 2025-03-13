import { useState, useEffect } from 'react';

/**
 * Utility service for handling image loading and caching
 */

// Cache of loaded images
const imageCache = new Map();

/**
 * Preloads an image and stores it in cache
 * @param {string} src - Image source URL
 * @returns {Promise} - Promise that resolves when image is loaded
 */
export const preloadImage = (src) => {
  if (!src) return Promise.resolve(null);
  
  // Return cached image if available
  if (imageCache.has(src)) {
    return Promise.resolve(imageCache.get(src));
  }
  
  // Load and cache the image
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    
    img.onerror = (err) => {
      console.error(`Failed to load image: ${src}`, err);
      reject(err);
    };
    
    img.src = src;
  });
};

/**
 * Preloads multiple images at once
 * @param {Array<string>} sources - Array of image URLs
 * @returns {Promise} - Promise that resolves when all images are loaded
 */
export const preloadImages = (sources = []) => {
  if (!sources.length) return Promise.resolve([]);
  
  const promises = sources.map(src => preloadImage(src));
  return Promise.all(promises);
};

/**
 * Gets an image URL that ensures proper loading
 * @param {string} src - Original image source
 * @returns {string} - Processed image URL
 */
export const getImageUrl = (src) => {
  if (!src) return '';
  
  // If it's an absolute URL or data URL, return as is
  if (src.startsWith('http') || src.startsWith('data:')) {
    return src;
  }
  
  // For relative URLs, ensure they're correctly resolved
  try {
    // For Vite, use the import.meta.url approach
    const baseUrl = import.meta.env.BASE_URL || '/';
    
    // Remove leading slash if baseUrl already has one
    const normalizedSrc = src.startsWith('/') ? src.slice(1) : src;
    
    // Join baseUrl and src, avoiding double slashes
    return `${baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`}${normalizedSrc}`;
  } catch (e) {
    console.error('Error processing image URL:', e);
    return src;
  }
};

/**
 * Image component with built-in loading, error handling and placeholder support
 * @param {Object} props - Component props
 * @returns {Object} - Image with enhanced features
 */
export const ImageWithFallback = ({ src, alt, fallback, ...props }) => {
  const [imgSrc, setImgSrc] = useState(getImageUrl(src));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    setError(false);
    setImgSrc(getImageUrl(src));
    
    preloadImage(getImageUrl(src))
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
        if (fallback) {
          setImgSrc(getImageUrl(fallback));
        }
      });
  }, [src, fallback]);
  
  if (loading) {
    return <div className="image-placeholder" {...props} />;
  }
  
  return <img src={imgSrc} alt={alt || ''} {...props} />;
}; 