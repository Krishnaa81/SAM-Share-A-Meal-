# Components

This directory contains reusable components used throughout the application.

## ImageWithFallback

The `ImageWithFallback` component provides a simple way to display images with automatic fallback handling when images fail to load.

### Usage

```jsx
import ImageWithFallback from '../components/ImageWithFallback';

// Basic usage
<ImageWithFallback 
  src="/images/food/pasta.jpg" 
  alt="Pasta dish" 
  category="food" 
/>

// With custom styling
<ImageWithFallback 
  src="/images/restaurants/italian-bistro.jpg" 
  alt="Italian Bistro" 
  category="restaurant" 
  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
  className="restaurant-image rounded"
/>

// With additional image props
<ImageWithFallback 
  src="/images/avatars/user1.jpg" 
  alt="User Avatar" 
  category="avatar" 
  imgProps={{ 
    loading: "lazy",
    onClick: () => console.log('Image clicked')
  }}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| src | string | - | The source URL of the image |
| alt | string | '' | Alternative text for the image |
| category | string | 'default' | Category of the image (food, restaurant, avatar, kitchen, donation, default) |
| style | object | {} | Custom styles for the image |
| className | string | '' | CSS class names |
| imgProps | object | {} | Additional props to pass to the img element |

### Fallback Behavior

If an image fails to load, the component will automatically display a fallback image based on the specified category:

- `food`: Shows a food placeholder image
- `restaurant`: Shows a restaurant placeholder image
- `avatar`: Shows an avatar placeholder image
- `kitchen`: Shows a kitchen placeholder image
- `donation`: Shows a donation placeholder image
- `default`: Shows a generic placeholder image

The fallback images are located in `/images/fallback/` directory. 