# Image Utilities

This directory contains utility functions to help with common tasks in the application.

## imageUtils.js

The `imageUtils.js` file provides functions for handling images throughout the application, including:

### getImageUrl(path, category)

Constructs a proper image URL from a given path, handling both relative and absolute URLs.

```javascript
import * as imageUtils from './utils/imageUtils';

// Get a proper URL for a food image
const foodImageUrl = imageUtils.getImageUrl('pasta.jpg', 'food');

// If the image path is empty or undefined, it will return a fallback image
const fallbackUrl = imageUtils.getImageUrl(undefined, 'food'); // Returns food fallback image
```

### handleImageError(event, category)

An event handler for image loading errors that sets a fallback image based on the category.

```javascript
<img 
  src="path/to/image.jpg" 
  onError={(e) => imageUtils.handleImageError(e, 'food')} 
  alt="Food item"
/>
```

### preloadImages(imageSources)

Preloads an array of images to improve loading performance.

```javascript
// Preload a list of images
const imagesToPreload = ['/images/food/pasta.jpg', '/images/food/pizza.jpg'];
imageUtils.preloadImages(imagesToPreload);
```

### createImageProps(src, alt, category, additionalProps)

Creates props for an image component with error handling.

```javascript
<img 
  {...imageUtils.createImageProps('pasta.jpg', 'Pasta dish', 'food', { className: 'food-image' })}
/>
```

## How to Use in Components

To use these utilities in your components:

1. Import the utilities:
```javascript
import * as imageUtils from '../utils/imageUtils';
```

2. Use them in your component:
```javascript
function FoodItem({ food }) {
  return (
    <div className="food-item">
      <img 
        {...imageUtils.createImageProps(food.image, food.name, 'food', { className: 'food-image' })}
      />
      <h3>{food.name}</h3>
    </div>
  );
}
```

## Fallback Images

The system uses fallback images when the original image fails to load. These are stored in:
- `/images/fallback/food-placeholder.png`
- `/images/fallback/restaurant-placeholder.png`
- `/images/fallback/avatar-placeholder.png`
- `/images/fallback/kitchen-placeholder.png`
- `/images/fallback/donation-placeholder.png`
- `/images/fallback/default-placeholder.png`

You can customize these fallback images by replacing the files in the fallback directory. 