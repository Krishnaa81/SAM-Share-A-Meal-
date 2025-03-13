import React from 'react';
import PropTypes from 'prop-types';
import * as imageUtils from '../utils/imageUtils';

/**
 * A reusable image component with built-in error handling and fallback images
 * 
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alternative text for the image
 * @param {string} props.category - Image category (food, restaurant, avatar, etc.)
 * @param {Object} props.style - Custom styles for the image
 * @param {string} props.className - CSS class names
 * @param {Object} props.imgProps - Additional props to pass to the img element
 * @returns {JSX.Element} - Image component with fallback handling
 */
const ImageWithFallback = ({ 
  src, 
  alt = '', 
  category = 'default', 
  style = {}, 
  className = '',
  imgProps = {}
}) => {
  return (
    <img
      {...imageUtils.createImageProps(
        src,
        alt,
        category,
        {
          style,
          className,
          ...imgProps
        }
      )}
    />
  );
};

ImageWithFallback.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  category: PropTypes.oneOf(['food', 'restaurant', 'avatar', 'kitchen', 'donation', 'default']),
  style: PropTypes.object,
  className: PropTypes.string,
  imgProps: PropTypes.object
};

export default ImageWithFallback; 