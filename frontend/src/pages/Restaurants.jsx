import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Rating,
  Chip,
  Divider,
  FormControl,
  Select,
  MenuItem,
  Badge,
  IconButton,
  Paper,
  FormControlLabel,
  Checkbox,
  Slider,
  Stack,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search,
  FilterList,
  LocationOn,
  Star,
  StarBorder,
  Timer,
  LocalOffer,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import ImageWithFallback from '../components/ImageWithFallback';

// Mock restaurant data
const MOCK_RESTAURANTS = [
  {
    id: 1,
    name: 'Spice Garden',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&w=1000&q=80',
    cuisine: 'Indian',
    rating: 4.8,
    priceLevel: '₹₹',
    deliveryTime: '20-30 min',
    featured: true,
    location: 'Jubilee Hills',
    deliveryFee: 30,
    minOrder: 150,
  },
  {
    id: 2,
    name: 'Pasta Paradise',
    image: 'https://images.unsplash.com/photo-1579684947550-22e945225d9a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGl0YWxpYW4lMjByZXN0YXVyYW50fGVufDB8fDB8fA%3D%3D&w=1000&q=80',
    cuisine: 'Italian',
    rating: 4.5,
    priceLevel: '₹₹₹',
    deliveryTime: '25-35 min',
    featured: false,
    location: 'Banjara Hills',
    deliveryFee: 50,
    minOrder: 250,
  },
  {
    id: 3,
    name: 'Sushi Sake',
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8c3VzaGklMjByZXN0YXVyYW50fGVufDB8fDB8fA%3D%3D&w=1000&q=80',
    cuisine: 'Japanese',
    rating: 4.7,
    priceLevel: '₹₹₹',
    deliveryTime: '30-40 min',
    featured: false,
    location: 'Madhapur',
    deliveryFee: 60,
    minOrder: 300,
  },
  {
    id: 4,
    name: 'Burger Barn',
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YnVyZ2VyJTIwcmVzdGF1cmFudHxlbnwwfHwwfHw%3D&w=1000&q=80',
    cuisine: 'American',
    rating: 4.4,
    priceLevel: '₹',
    deliveryTime: '15-25 min',
    featured: true,
    location: 'Gachibowli',
    deliveryFee: 20,
    minOrder: 100,
  },
  {
    id: 5,
    name: 'Thai Delight',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dGhhaSUyMGZvb2R8ZW58MHx8MHx8&w=1000&q=80',
    cuisine: 'Thai',
    rating: 4.6,
    priceLevel: '₹₹',
    deliveryTime: '25-35 min',
    featured: false,
    location: 'Hitech City',
    deliveryFee: 40,
    minOrder: 200,
  },
  {
    id: 6,
    name: 'Mexico Lindo',
    image: 'https://images.unsplash.com/photo-1593058629791-a9acea84f0ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8bWV4aWNhbiUyMHJlc3RhdXJhbnR8ZW58MHx8MHx8&w=1000&q=80',
    cuisine: 'Mexican',
    rating: 4.3,
    priceLevel: '₹₹',
    deliveryTime: '30-45 min',
    featured: false,
    location: 'Kukatpally',
    deliveryFee: 30,
    minOrder: 150,
  },
  {
    id: 7,
    name: 'Pizza Place',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8MHx8&w=1000&q=80',
    cuisine: 'Italian',
    rating: 4.1,
    priceLevel: '₹',
    deliveryTime: '20-30 min',
    featured: true,
    location: 'Ameerpet',
    deliveryFee: 25,
    minOrder: 120,
  },
  {
    id: 8,
    name: 'Golden Dragon',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y2hpbmVzZSUyMHJlc3RhdXJhbnR8ZW58MHx8MHx8&w=1000&q=80',
    cuisine: 'Chinese',
    rating: 4.4,
    priceLevel: '₹₹',
    deliveryTime: '25-40 min',
    featured: false,
    location: 'Secunderabad',
    deliveryFee: 35,
    minOrder: 180,
  },
];

// Available cuisines from the data
const CUISINES = [...new Set(MOCK_RESTAURANTS.map(r => r.cuisine))];

// Available locations from the data
const LOCATIONS = [...new Set(MOCK_RESTAURANTS.map(r => r.location))];

const RestaurantCard = ({ restaurant, favorite = false, onToggleFavorite }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <ImageWithFallback
          src={restaurant.image}
          alt={restaurant.name}
          category="restaurant"
          style={{ height: '180px', width: '100%', objectFit: 'cover' }}
          className="restaurant-image"
        />
        <IconButton 
          sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8, 
            bgcolor: 'rgba(255,255,255,0.8)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' }
          }}
          onClick={() => onToggleFavorite(restaurant.id)}
        >
          {favorite ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
        {restaurant.featured && (
          <Chip
            label="Featured"
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              bgcolor: 'secondary.main',
              color: 'white',
              fontWeight: 'bold',
            }}
            size="small"
          />
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="div" fontWeight="bold">
            {restaurant.name}
          </Typography>
          <Chip 
            label={restaurant.priceLevel} 
            size="small" 
            sx={{ 
              bgcolor: 'background.default', 
              fontWeight: 'bold' 
            }} 
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {restaurant.cuisine} Cuisine
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating 
            value={restaurant.rating} 
            precision={0.5} 
            readOnly 
            size="small"
          />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {restaurant.rating}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOn fontSize="small" color="action" sx={{ mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {restaurant.location}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Timer fontSize="small" color="action" sx={{ mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {restaurant.deliveryTime}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button 
          size="small" 
          component={RouterLink}
          to={`/restaurants/${restaurant.id}`}
          sx={{ flexGrow: 1 }}
        >
          View Menu
        </Button>
      </CardActions>
    </Card>
  );
};

const Restaurants = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    cuisine: '',
    location: '',
    priceRange: [0, 3], // ₹ to ₹₹₹
    rating: 0,
    showFeaturedOnly: false,
    maxDeliveryTime: 60,
  });
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState(MOCK_RESTAURANTS);

  // Toggle favorite status of a restaurant
  const toggleFavorite = (id) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(fid => fid !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle filter changes
  const handleFilterChange = (event) => {
    const { name, value, checked } = event.target;
    
    setFilters(prev => ({
      ...prev,
      [name]: name === 'showFeaturedOnly' ? checked : value
    }));
  };

  // Apply filters to restaurants
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      const filteredRestaurants = MOCK_RESTAURANTS.filter(restaurant => {
        // Search term filter
        if (searchTerm && !restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
            !restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        
        // Cuisine filter
        if (filters.cuisine && restaurant.cuisine !== filters.cuisine) {
          return false;
        }
        
        // Location filter
        if (filters.location && restaurant.location !== filters.location) {
          return false;
        }
        
        // Price range filter (₹ to ₹₹₹)
        const priceLevel = restaurant.priceLevel.length;
        if (priceLevel < filters.priceRange[0] + 1 || priceLevel > filters.priceRange[1] + 1) {
          return false;
        }
        
        // Rating filter
        if (filters.rating > 0 && restaurant.rating < filters.rating) {
          return false;
        }
        
        // Featured filter
        if (filters.showFeaturedOnly && !restaurant.featured) {
          return false;
        }
        
        // Delivery time filter
        const maxTime = parseInt(restaurant.deliveryTime.split('-')[1]);
        if (maxTime > filters.maxDeliveryTime) {
          return false;
        }
        
        return true;
      });
      
      setRestaurants(filteredRestaurants);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, filters]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      cuisine: '',
      location: '',
      priceRange: [0, 3],
      rating: 0,
      showFeaturedOnly: false,
      maxDeliveryTime: 60,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Restaurants
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Discover restaurants offering delicious food near you
        </Typography>
      </Box>

      {/* Search and Filters Row */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search restaurants or cuisines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', gap: 2 }}>
          <Button 
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
            variant={showFilters ? "contained" : "outlined"}
            color="primary"
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <FormControl fullWidth sx={{ display: { xs: 'none', md: 'block' } }}>
            <Select
              displayEmpty
              value={filters.cuisine}
              name="cuisine"
              onChange={handleFilterChange}
            >
              <MenuItem value="">All Cuisines</MenuItem>
              {CUISINES.map((cuisine) => (
                <MenuItem key={cuisine} value={cuisine}>{cuisine}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ display: { xs: 'none', md: 'block' } }}>
            <Select
              displayEmpty
              value={filters.location}
              name="location"
              onChange={handleFilterChange}
            >
              <MenuItem value="">All Locations</MenuItem>
              {LOCATIONS.map((location) => (
                <MenuItem key={location} value={location}>{location}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Filter Panel */}
        {showFilters && (
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Filters
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <Typography gutterBottom>Cuisine</Typography>
                    <Select
                      displayEmpty
                      value={filters.cuisine}
                      name="cuisine"
                      onChange={handleFilterChange}
                      size="small"
                    >
                      <MenuItem value="">All Cuisines</MenuItem>
                      {CUISINES.map((cuisine) => (
                        <MenuItem key={cuisine} value={cuisine}>{cuisine}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <Typography gutterBottom>Location</Typography>
                    <Select
                      displayEmpty
                      value={filters.location}
                      name="location"
                      onChange={handleFilterChange}
                      size="small"
                    >
                      <MenuItem value="">All Locations</MenuItem>
                      {LOCATIONS.map((location) => (
                        <MenuItem key={location} value={location}>{location}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ width: '100%', pl: 2, pr: 2 }}>
                    <Typography gutterBottom>Price Range</Typography>
                    <Slider
                      value={filters.priceRange}
                      onChange={(event, newValue) => {
                        setFilters({...filters, priceRange: newValue});
                      }}
                      valueLabelFormat={(value) => {
                        const labels = [
                          { value: 0, label: '₹' },
                          { value: 1, label: '₹₹' },
                          { value: 2, label: '₹₹₹' },
                          { value: 3, label: '₹₹₹₹' },
                        ];
                        return labels.find((label) => label.value === value)?.label;
                      }}
                      step={1}
                      min={0}
                      max={3}
                      marks
                      valueLabelDisplay="auto"
                    />
                  </Box>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography gutterBottom>Minimum Rating</Typography>
                    <Rating
                      name="rating"
                      value={filters.rating}
                      onChange={(event, newValue) => {
                        setFilters({...filters, rating: newValue});
                      }}
                      precision={0.5}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography gutterBottom>Maximum Delivery Time (min)</Typography>
                  <Slider
                    value={filters.maxDeliveryTime}
                    onChange={(event, newValue) => {
                      setFilters({...filters, maxDeliveryTime: newValue});
                    }}
                    valueLabelDisplay="auto"
                    step={5}
                    marks={[
                      { value: 15, label: '15' },
                      { value: 30, label: '30' },
                      { value: 45, label: '45' },
                      { value: 60, label: '60' },
                    ]}
                    min={15}
                    max={60}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filters.showFeaturedOnly}
                        onChange={handleFilterChange}
                        name="showFeaturedOnly"
                      />
                    }
                    label="Featured Restaurants Only"
                  />
                  
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={resetFilters}
                      fullWidth
                    >
                      Reset Filters
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Restaurant List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
          <CircularProgress />
        </Box>
      ) : restaurants.length > 0 ? (
        <Grid container spacing={3}>
          {restaurants.map((restaurant) => (
            <Grid item key={restaurant.id} xs={12} sm={6} md={4} lg={3}>
              <RestaurantCard 
                restaurant={restaurant} 
                favorite={favorites.includes(restaurant.id)} 
                onToggleFavorite={toggleFavorite} 
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ my: 6 }}>
          <Alert severity="info">
            No restaurants match your search criteria. Try adjusting your filters.
          </Alert>
        </Box>
      )}
    </Container>
  );
};

export default Restaurants; 