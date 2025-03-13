import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Divider,
  Chip,
  Rating,
  Tabs,
  Tab,
  List,
  ListItem,
  IconButton,
  Paper,
  Avatar,
  TextField,
  Badge,
  Alert,
  CircularProgress,
  Snackbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  Star as StarIcon,
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Phone as PhoneIcon,
  ArrowBack as ArrowBackIcon,
  AttachMoney as AttachMoneyIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

import { useCart } from '../context/CartContext';
import * as imageUtils from '../utils/imageUtils';

// Mock restaurant data
const MOCK_RESTAURANTS = [
  {
    id: 1,
    name: 'Spice Junction',
    cuisine: 'North Indian',
    address: 'Shop 4, Jubilee Hills, Hyderabad',
    rating: 4.5,
    delivery_time: '30-40 min',
    price_range: '₹₹₹',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&w=1000&q=80',
    menu: [
      {
        category: 'Starters',
        items: [
          { id: 101, name: 'Paneer Tikka', description: 'Marinated cottage cheese grilled to perfection', price: 220, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGFuZWVyJTIwdGlra2F8ZW58MHx8MHx8&w=1000&q=80', vegetarian: true, bestseller: true },
          { id: 102, name: 'Chicken 65', description: 'Spicy deep-fried chicken with South Indian spices', price: 250, image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMGZyaWVkfGVufDB8fDB8fA%3D%3D&w=1000&q=80', vegetarian: false },
          { id: 103, name: 'Samosa', description: 'Crispy pastry filled with spiced potatoes and peas', price: 80, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2Ftb3NhfGVufDB8fDB8fA%3D%3D&w=1000&q=80', vegetarian: true },
          { id: 104, name: 'Fish Amritsari', description: 'Crispy fried fish marinated with Punjab spices', price: 320, image: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZnJpZWQlMjBmaXNofGVufDB8fDB8fA%3D%3D&w=1000&q=80', vegetarian: false },
        ]
      },
      {
        category: 'Main Course',
        items: [
          { id: 201, name: 'Butter Chicken', description: 'Tender chicken pieces in a rich butter and tomato gravy', price: 340, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YnV0dGVyJTIwY2hpY2tlbnxlbnwwfHwwfHw%3D&w=1000&q=80', vegetarian: false, bestseller: true },
          { id: 202, name: 'Paneer Butter Masala', description: 'Cottage cheese in a creamy tomato sauce', price: 280, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGFuZWVyJTIwYnV0dGVyJTIwbWFzYWxhfGVufDB8fDB8fA%3D%3D&w=1000&q=80', vegetarian: true },
          { id: 203, name: 'Dal Makhani', description: 'Black lentils cooked with butter and cream', price: 220, image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZGFsJTIwbWFraGFuaXxlbnwwfHwwfHw%3D&w=1000&q=80', vegetarian: true, bestseller: true },
          { id: 204, name: 'Chicken Biryani', description: 'Fragrant rice cooked with spices and meat', price: 320, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YmlyeWFuaXxlbnwwfHwwfHw%3D&w=1000&q=80', vegetarian: false },
        ]
      },
      {
        category: 'Breads & Rice',
        items: [
          { id: 301, name: 'Naan', description: 'Leavened flatbread baked in tandoor', price: 40, image: '/images/food/naan.jpg', vegetarian: true },
          { id: 302, name: 'Jeera Rice', description: 'Basmati rice tempered with cumin seeds', price: 120, image: '/images/food/jeera-rice.jpg', vegetarian: true },
          { id: 303, name: 'Laccha Paratha', description: 'Multi-layered flatbread', price: 60, image: '/images/food/laccha-paratha.jpg', vegetarian: true },
        ]
      },
      {
        category: 'Desserts',
        items: [
          { id: 401, name: 'Gulab Jamun', description: 'Deep-fried milk solids soaked in sugar syrup', price: 120, image: '/images/food/gulab-jamun.jpg', vegetarian: true, bestseller: true },
          { id: 402, name: 'Rasmalai', description: 'Sweet cottage cheese dumplings in flavored milk', price: 150, image: '/images/food/rasmalai.jpg', vegetarian: true },
        ]
      }
    ],
    reviews: [
      { id: 1, user: 'Priya S.', rating: 5, date: '2023-05-15', comment: 'Amazing food and quick delivery. The Butter Chicken is absolutely delicious.', avatar: 'https://randomuser.me/api/portraits/women/64.jpg' },
      { id: 2, user: 'Rahul M.', rating: 3, date: '2023-05-10', comment: 'Food was good but delivery took longer than expected.', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: 3, user: 'Ananya K.', rating: 4, date: '2023-05-05', comment: 'Great restaurant! The Chicken Biryani is exceptional.', avatar: 'https://randomuser.me/api/portraits/women/45.jpg' },
    ]
  },
  {
    id: 2,
    name: 'Pasta Paradise',
    cuisine: 'Italian',
    address: 'Plot 22, Banjara Hills, Hyderabad',
    rating: 4.2,
    delivery_time: '35-45 min',
    price_range: '₹₹₹',
    image: 'https://images.unsplash.com/photo-1579684947550-22e945225d9a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGl0YWxpYW4lMjByZXN0YXVyYW50fGVufDB8fDB8fA%3D%3D&w=1000&q=80',
    menu: [
      {
        category: 'Starters',
        items: [
          { id: 101, name: 'Bruschetta', description: 'Grilled bread topped with tomatoes, garlic and olive oil', price: 180, image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8YnJ1c2NoZXR0YXxlbnwwfHwwfHw%3D&w=1000&q=80', vegetarian: true, bestseller: true },
          { id: 102, name: 'Fried Calamari', description: 'Crispy calamari rings served with marinara sauce', price: 350, image: 'https://images.unsplash.com/photo-1599487489423-c9185348f0a8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJpZWQlMjBjYWxhbWFyaXxlbnwwfHwwfHw%3D&w=1000&q=80', vegetarian: false },
          { id: 103, name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, and basil with balsamic glaze', price: 220, image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FwcmVzZSUyMHNhbGFkfGVufDB8fDB8fA%3D%3D&w=1000&q=80', vegetarian: true },
        ]
      },
      {
        category: 'Pasta',
        items: [
          { id: 201, name: 'Spaghetti Carbonara', description: 'Classic pasta with eggs, cheese, pancetta and black pepper', price: 320, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FyYm9uYXJhfGVufDB8fDB8fA%3D%3D&w=1000&q=80', vegetarian: false },
          { id: 202, name: 'Fettuccine Alfredo', description: 'Fettuccine tossed in creamy parmesan sauce', price: 340, image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023882c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmV0dHVjY2luZSUyMGFsZnJlZG98ZW58MHx8MHx8&w=1000&q=80', vegetarian: true, bestseller: true },
          { id: 203, name: 'Penne Arrabbiata', description: 'Penne pasta in spicy tomato sauce', price: 280, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGFzdGElMjBhcnJhYmJpYXRhfGVufDB8fDB8fA%3D%3D&w=1000&q=80', vegetarian: true },
          { id: 204, name: 'Lasagna', description: 'Layered pasta with meat sauce and cheese', price: 380, image: 'https://images.unsplash.com/photo-1619895092538-128341789043?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8bGFzYWduYXxlbnwwfHwwfHw%3D&w=1000&q=80', vegetarian: false, bestseller: true },
        ]
      },
      {
        category: 'Pizza',
        items: [
          { id: 301, name: 'Margherita', description: 'Classic pizza with tomato sauce, mozzarella, and basil', price: 300, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8bWFyZ2hlcml0YSUyMHBpenphfGVufDB8fDB8fA%3D%3D&w=1000&q=80', vegetarian: true, bestseller: true },
          { id: 302, name: 'Pepperoni', description: 'Pizza topped with pepperoni and cheese', price: 380, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGVwcGVyb25pJTIwcGl6emF8ZW58MHx8MHx8&w=1000&q=80', vegetarian: false },
          { id: 303, name: 'Quattro Formaggi', description: 'Four cheese pizza with mozzarella, gorgonzola, fontina, and parmesan', price: 420, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hlZXNlJTIwcGl6emF8ZW58MHx8MHx8&w=1000&q=80', vegetarian: true },
        ]
      },
      {
        category: 'Desserts',
        items: [
          { id: 401, name: 'Tiramisu', description: 'Coffee-flavored dessert with layers of ladyfingers and mascarpone cheese', price: 180, image: '/images/food/tiramisu.jpg', vegetarian: true, bestseller: true },
          { id: 402, name: 'Panna Cotta', description: 'Italian custard dessert with berry compote', price: 160, image: '/images/food/panna-cotta.jpg', vegetarian: true },
        ]
      }
    ],
    reviews: [
      { id: 1, user: 'Vikram P.', rating: 5, date: '2023-06-20', comment: 'Authentic Italian flavors. Best pasta I\'ve had outside of Italy!', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
      { id: 2, user: 'Meera J.', rating: 4, date: '2023-06-15', comment: 'Great ambiance and delicious food. A bit pricey though.', avatar: 'https://randomuser.me/api/portraits/women/28.jpg' },
      { id: 3, user: 'Arjun S.', rating: 5, date: '2023-06-10', comment: 'The pizza is divine. Fast delivery too. Will order again!', avatar: 'https://randomuser.me/api/portraits/men/51.jpg' },
    ]
  },
];

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`restaurant-tabpanel-${index}`}
      aria-labelledby={`restaurant-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    // Simulate API call to fetch restaurant details
    setLoading(true);
    
    setTimeout(() => {
      try {
        const restaurantData = MOCK_RESTAURANTS.find(r => r.id === parseInt(id));
        
        if (restaurantData) {
          setRestaurant(restaurantData);
          // Set the first category as selected by default
          if (restaurantData.menu && restaurantData.menu.length > 0) {
            setSelectedCategory(restaurantData.menu[0].category);
          }
        } else {
          setError('Restaurant not found');
        }
      } catch (err) {
        setError('Failed to load restaurant details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 800);
  }, [id]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Toggle favorite status
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    setSnackbarMessage(
      !isFavorite 
        ? `${restaurant.name} added to favorites` 
        : `${restaurant.name} removed from favorites`
    );
    setSnackbarOpen(true);
  };

  // Handle adding item to cart
  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    });
    
    setSnackbarMessage(`${item.name} added to cart`);
    setSnackbarOpen(true);
  };

  // Handle proceeding to checkout
  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  // Close snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Render loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error || !restaurant) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Restaurant not found'}
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/restaurants')}
        >
          Back to Restaurants
        </Button>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          position: 'relative', 
          height: { xs: '200px', md: '300px' },
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          {...imageUtils.createImageProps(
            restaurant.image, 
            restaurant.name, 
            'restaurant',
            {
              sx: {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }
            }
          )}
        />
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.7))',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            p: { xs: 2, md: 4 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.9)', 
                mr: 1,
                '&:hover': { bgcolor: 'rgba(255,255,255,1)' } 
              }}
              onClick={() => navigate('/restaurants')}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h3" component="h1" color="white" fontWeight="bold">
              {restaurant.name}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Restaurant Info */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h5" component="h2" fontWeight="bold">
                    {restaurant.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {restaurant.cuisine} Cuisine
                  </Typography>
                </Box>
                <IconButton 
                  color={isFavorite ? "error" : "default"} 
                  onClick={toggleFavorite}
                  sx={{ 
                    border: '1px solid', 
                    borderColor: isFavorite ? 'error.main' : 'divider' 
                  }}
                >
                  {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={restaurant.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {restaurant.rating} ({restaurant.reviews.length} reviews)
                  </Typography>
                </Box>
                <Chip 
                  icon={<AccessTimeIcon fontSize="small" />} 
                  label={restaurant.delivery_time} 
                  variant="outlined" 
                  size="small"
                />
                <Chip 
                  icon={<AttachMoneyIcon fontSize="small" />} 
                  label={restaurant.price_range} 
                  variant="outlined" 
                  size="small"
                />
              </Box>

              <Typography variant="body1" paragraph>
                {restaurant.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <LocationOnIcon color="action" sx={{ mr: 1, mt: 0.5 }} />
                    <Typography variant="body2">
                      {restaurant.address}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhoneIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {restaurant.phone}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {restaurant.openingHours}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Minimum order: ₹{restaurant.minOrder}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Delivery fee: ₹{restaurant.deliveryFee}
                  </Typography>
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => {
                      // Scroll to menu section
                      document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Order Now
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* Tabs for Menu/Reviews */}
            <Box sx={{ width: '100%', mb: 3 }} id="menu-section">
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange} 
                  aria-label="restaurant tabs"
                  variant="fullWidth"
                >
                  <Tab label="Menu" />
                  <Tab label={`Reviews (${restaurant.reviews.length})`} />
                  <Tab label="Info" />
                </Tabs>
              </Box>
              
              {/* Menu Tab */}
              <TabPanel value={tabValue} index={0}>
                {/* Category navigation for larger screens */}
                {!isMobile && (
                  <Box sx={{ display: 'flex', mb: 3, overflowX: 'auto', pb: 1 }}>
                    {restaurant.menu.map((category, index) => (
                      <Button
                        key={index}
                        variant={selectedCategory === category.category ? "contained" : "outlined"}
                        sx={{ 
                          mr: 1, 
                          whiteSpace: 'nowrap',
                          minWidth: 'auto'
                        }}
                        onClick={() => setSelectedCategory(category.category)}
                      >
                        {category.category}
                      </Button>
                    ))}
                  </Box>
                )}

                {/* Menu sections */}
                {restaurant.menu.map((category, index) => (
                  <Box 
                    key={index} 
                    sx={{ mb: 4 }}
                    id={`category-${category.category.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                      {category.category}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      {category.items.map((item) => (
                        <Grid item xs={12} sm={6} md={6} key={item.id}>
                          <Card sx={{ 
                            display: 'flex', 
                            height: '100%',
                            position: 'relative',
                            overflow: 'visible'
                          }}>
                            {item.bestseller && (
                              <Chip
                                label="Bestseller"
                                color="secondary"
                                size="small"
                                sx={{ 
                                  position: 'absolute', 
                                  top: -10, 
                                  left: 10, 
                                  zIndex: 1 
                                }}
                              />
                            )}
                            <Box sx={{ width: '35%', position: 'relative' }}>
                              <CardMedia
                                component="img"
                                sx={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'cover'
                                }}
                                {...imageUtils.createImageProps(item.image, item.name, 'food')}
                              />
                              {item.vegetarian && (
                                <Box 
                                  sx={{ 
                                    position: 'absolute', 
                                    bottom: 5, 
                                    left: 5, 
                                    width: 20, 
                                    height: 20, 
                                    borderRadius: '50%', 
                                    bgcolor: 'success.main',
                                    border: '2px solid white',
                                  }} 
                                />
                              )}
                            </Box>
                            <Box sx={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              width: '65%',
                              justifyContent: 'space-between'
                            }}>
                              <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle1" component="h4" fontWeight="bold">
                                  {item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  {item.description}
                                </Typography>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  ₹{item.price}
                                </Typography>
                              </CardContent>
                              <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  startIcon={<AddIcon />}
                                  onClick={() => handleAddToCart(item)}
                                >
                                  Add
                                </Button>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>

                    {/* Confirm Order Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleProceedToCheckout}
                        disabled={cartItems.length === 0}
                        startIcon={<ShoppingCartIcon />}
                      >
                        Confirm Order ({cartItems.length > 0 ? cartItems.length : 0})
                      </Button>
                    </Box>
                  </Box>
                ))}
              </TabPanel>
              
              {/* Reviews Tab */}
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                    Customer Reviews
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                      <Typography variant="h3" component="span" fontWeight="bold" color="primary" sx={{ mr: 1 }}>
                        {restaurant.rating}
                      </Typography>
                      <Box>
                        <Rating value={restaurant.rating} precision={0.1} readOnly />
                        <Typography variant="body2" color="text.secondary">
                          {restaurant.reviews.length} reviews
                        </Typography>
                      </Box>
                    </Box>
                    <Button variant="outlined" sx={{ ml: 'auto' }}>
                      Write a Review
                    </Button>
                  </Box>
                  
                  <Divider sx={{ mb: 3 }} />
                  
                  {restaurant.reviews.map((review) => (
                    <Box key={review.id} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', mb: 2 }}>
                        <Avatar src={review.avatar} alt={review.user} sx={{ mr: 2 }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {review.user}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Rating value={review.rating} size="small" readOnly />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              {review.date}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Typography variant="body1" paragraph>
                        {review.comment}
                      </Typography>
                      <Divider />
                    </Box>
                  ))}
                </Box>
              </TabPanel>
              
              {/* Info Tab */}
              <TabPanel value={tabValue} index={2}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                    Restaurant Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Address
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                        <LocationOnIcon color="action" sx={{ mr: 1, mt: 0.5 }} />
                        <Typography variant="body1">
                          {restaurant.address}
                        </Typography>
                      </Box>
                      
                      <Typography variant="h6" gutterBottom>
                        Contact
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PhoneIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="body1">
                          {restaurant.phone}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Opening Hours
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="body1">
                          {restaurant.openingHours}
                        </Typography>
                      </Box>
                      
                      <Typography variant="h6" gutterBottom>
                        Delivery Information
                      </Typography>
                      <Typography variant="body1" paragraph>
                        Delivery Time: {restaurant.delivery_time}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        Delivery Fee: ₹{restaurant.deliveryFee}
                      </Typography>
                      <Typography variant="body1">
                        Minimum Order: ₹{restaurant.minOrder}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>
            </Box>
          </Grid>
          
          {/* Sidebar for cart and info on larger screens */}
          <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Paper 
              elevation={3} 
              sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 100 }}
            >
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Categories
              </Typography>
              <List disablePadding>
                {restaurant.menu.map((category, index) => (
                  <ListItem 
                    key={index} 
                    disablePadding 
                    sx={{ 
                      mb: 1,
                      bgcolor: selectedCategory === category.category ? 'primary.light' : 'transparent',
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: selectedCategory === category.category ? 'primary.light' : 'action.hover',
                      }
                    }}
                  >
                    <Button
                      fullWidth
                      sx={{ 
                        justifyContent: 'flex-start', 
                        color: selectedCategory === category.category ? 'white' : 'text.primary',
                        py: 1
                      }}
                      onClick={() => {
                        setSelectedCategory(category.category);
                        setTabValue(0); // Switch to menu tab
                        
                        // Scroll to category
                        const element = document.getElementById(`category-${category.category.toLowerCase().replace(/\s+/g, '-')}`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                    >
                      {category.category}
                    </Button>
                  </ListItem>
                ))}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <InfoIcon color="action" sx={{ mr: 1, mt: 0.5 }} fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Delivery fee: ₹{restaurant.deliveryFee}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <InfoIcon color="action" sx={{ mr: 1, mt: 0.5 }} fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Minimum order: ₹{restaurant.minOrder}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default RestaurantDetail; 