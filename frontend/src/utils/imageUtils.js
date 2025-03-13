/**
 * Utility functions for handling images
 */

// Base path for images
const BASE_URL = '';

// Online fallback images (guaranteed to exist)
const FALLBACK_IMAGES = {
  food: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60',
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&w=500&q=60',
  avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=500&q=60',
  kitchen: 'https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGtpdGNoZW58ZW58MHx8MHx8&w=500&q=60',
  donation: 'https://images.unsplash.com/photo-1593113598332-cd59a93c6138?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9uYXRpb258ZW58MHx8MHx8&w=500&q=60',
  default: 'https://images.unsplash.com/photo-1576021182211-9ea8dced3690?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8cGxhY2Vob2xkZXJ8ZW58MHx8MHx8&w=500&q=60'
};

// Local fallback paths - for development
const LOCAL_FALLBACK_IMAGES = {
  food: '/images/fallback/food-placeholder.jpg',
  restaurant: '/images/fallback/restaurant-placeholder.jpg',
  avatar: '/images/fallback/avatar-placeholder.jpg',
  kitchen: '/images/fallback/kitchen-placeholder.jpg',
  donation: '/images/fallback/donation-placeholder.jpg',
  default: '/images/fallback/default-placeholder.jpg'
};

/**
 * Constructs a proper image URL from a given path
 * @param {string} imagePath - The path to the image
 * @param {string} category - The category of the image (food, restaurant, etc.)
 * @returns {string} The complete image URL
 */
export const getImageUrl = (imagePath, category = 'default') => {
  // If the image path is empty or undefined, return the fallback image
  if (!imagePath) {
    return FALLBACK_IMAGES[category] || FALLBACK_IMAGES.default;
  }

  // Check if the image is already an absolute URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Otherwise, construct the URL with the base path
  return `${BASE_URL}${imagePath}`;
};

/**
 * Handler for image loading errors
 * @param {Event} event - The error event
 * @param {string} category - The category of the image (food, restaurant, etc.)
 */
export const handleImageError = (event, category = 'default') => {
  const img = event.target;
  
  // Skip if this is already a fallback image to prevent infinite loops
  if (img.src.includes('unsplash.com')) {
    console.warn(`Image failed to load: ${img.src}, but it's already a fallback image`);
    return;
  }
  
  // Use the guaranteed online fallback
  const fallbackSrc = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.default;
  
  // Log the error
  console.warn(`Image failed to load: ${img.src}, using fallback for ${category}`);
  
  // Set the fallback
  img.src = fallbackSrc;
  
  // Remove the onerror handler to prevent infinite loops
  img.onerror = null;
};

/**
 * Preloads an array of images
 * @param {Array<string>} images - Array of image URLs to preload
 */
export const preloadImages = (images) => {
  if (!images || !Array.isArray(images) || images.length === 0) return;
  
  images.forEach(src => {
    if (!src) return;
    const img = new Image();
    img.src = src;
  });
};

/**
 * Creates props for an image component, including error handling
 * @param {string} src - The source URL of the image
 * @param {string} alt - The alt text for the image
 * @param {string} category - The category of the image
 * @param {Object} additionalProps - Additional props to add to the image
 * @returns {Object} Props object for the image
 */
export const createImageProps = (src, alt, category = 'default', additionalProps = {}) => {
  return {
    src: getImageUrl(src, category),
    alt: alt || 'Image',
    onError: (e) => handleImageError(e, category),
    loading: "lazy",
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