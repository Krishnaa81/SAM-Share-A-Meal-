import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { ImageWithFallback, getImageUrl } from '../utils/imageService';

/**
 * A wrapper component for images that handles loading states, errors, and proper sizing
 * 
 * @param {Object} props - Component properties
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for accessibility
 * @param {string} props.fallbackSrc - Fallback image to use if main image fails to load
 * @param {Object} props.sx - Custom styling for the container
 * @param {Object} props.imgSx - Custom styling for the image
 * @param {boolean} props.fullWidth - Whether the image should take full width
 * @param {string} props.aspectRatio - Aspect ratio of the image (e.g., '16/9', '4/3', '1/1')
 * @param {Object} props.rest - Additional props to pass to the container
 */
const ImageWrapper = ({ 
  src, 
  alt = '', 
  fallbackSrc = '/assets/placeholder.jpg',
  sx = {}, 
  imgSx = {},
  fullWidth = false,
  aspectRatio = 'auto',
  ...rest
}) => {
  // Generate a proper URL for the image
  const imageUrl = getImageUrl(src);
  const fallbackUrl = getImageUrl(fallbackSrc);
  
  return (
    <Box
      sx={{
        position: 'relative',
        width: fullWidth ? '100%' : 'auto',
        aspectRatio,
        overflow: 'hidden',
        ...sx
      }}
      {...rest}
    >
      {/* Show ImageWithFallback component to handle loading and errors */}
      <ImageWithFallback
        src={imageUrl}
        alt={alt}
        fallback={fallbackUrl}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          ...imgSx
        }}
      />
    </Box>
  );
};

export default ImageWrapper; 