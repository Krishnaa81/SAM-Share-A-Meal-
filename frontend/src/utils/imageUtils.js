/**
 * Utility functions for handling images
 */

// Base path for images
const BASE_IMAGE_PATH = '/images';

// Fallback images for different categories
const FALLBACK_IMAGES = {
  food: '/images/fallback/food-placeholder.png',
  restaurant: '/images/fallback/restaurant-placeholder.png',
  avatar: '/images/fallback/avatar-placeholder.png',
  kitchen: '/images/fallback/kitchen-placeholder.png',
  donation: '/images/fallback/donation-placeholder.png',
  default: '/images/fallback/default-placeholder.png'
};

/**
 * Get the proper image URL from a path
 * @param {string} path - Image path
 * @param {string} category - Image category for fallback
 * @returns {string} - Complete image URL
 */
export const getImageUrl = (path, category = 'default') => {
  if (!path) {
    return FALLBACK_IMAGES[category] || FALLBACK_IMAGES.default;
  }

  // If path is already an absolute URL, return it
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // If path already starts with /images, use it directly
  if (path.startsWith('/images')) {
    return path;
  }

  // Otherwise, prepend the base path
  return `${BASE_IMAGE_PATH}/${path.startsWith('/') ? path.substring(1) : path}`;
};

/**
 * Handle image loading errors
 * @param {Event} event - Error event
 * @param {string} category - Image category
 * @returns {void}
 */
export const handleImageError = (event, category = 'default') => {
  const img = event.target;
  const fallbackSrc = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.default;
  
  // Prevent infinite error loop if fallback also fails
  if (img.src !== fallbackSrc) {
    console.warn(`Image failed to load: ${img.src}, using fallback for ${category}`);
    img.src = fallbackSrc;
  }
};

/**
 * Preload a list of images
 * @param {string[]} imageSources - Array of image URLs to preload
 * @returns {Promise<void>}
 */
export const preloadImages = (imageSources) => {
  const promises = imageSources.map(src => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Resolve even on error to avoid hanging
      img.src = src;
    });
  });

  return Promise.all(promises);
};

/**
 * Create image props for a component
 * @param {string} src - Image source
 * @param {string} alt - Image alt text
 * @param {string} category - Image category
 * @param {Object} additionalProps - Additional props for the image
 * @returns {Object} - Complete props object for an image
 */
export const createImageProps = (src, alt = '', category = 'default', additionalProps = {}) => {
  return {
    src: getImageUrl(src, category),
    alt,
    onError: (e) => handleImageError(e, category),
    ...additionalProps
  };
};

export default {
  getImageUrl,
  handleImageError,
  preloadImages,
  createImageProps,
  FALLBACK_IMAGES
}; 