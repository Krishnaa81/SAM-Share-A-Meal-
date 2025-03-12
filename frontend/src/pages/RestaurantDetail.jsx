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

// Mock restaurant data
const MOCK_RESTAURANTS = [
  {
    id: 1,
    name: 'Spice Garden',
    image: 'https://source.unsplash.com/random/1200x400/?restaurant,indian',
    cuisine: 'Indian',
    rating: 4.8,
    ratingCount: 256,
    priceLevel: '$$',
    deliveryTime: '20-30 min',
    deliveryFee: 30,
    minOrder: 150,
    featured: true,
    location: 'Jubilee Hills',
    address: '123 Food Street, Jubilee Hills, Hyderabad',
    phone: '+91 9876543210',
    openingHours: '10:00 AM - 10:00 PM',
    description: 'Authentic Indian restaurant offering a wide range of dishes from North and South India. Known for our flavorful curries, tandoori specialties, and freshly baked naan.',
    menu: [
      {
        category: 'Starters',
        items: [
          { id: 101, name: 'Paneer Tikka', description: 'Marinated cottage cheese grilled to perfection', price: 220, image: 'https://source.unsplash.com/random/300x200/?paneer,tikka', vegetarian: true, bestseller: true },
          { id: 102, name: 'Chicken 65', description: 'Spicy deep-fried chicken with South Indian spices', price: 250, image: 'https://source.unsplash.com/random/300x200/?chicken', vegetarian: false },
          { id: 103, name: 'Samosa', description: 'Crispy pastry filled with spiced potatoes and peas', price: 80, image: 'https://source.unsplash.com/random/300x200/?samosa', vegetarian: true },
          { id: 104, name: 'Fish Amritsari', description: 'Crispy fried fish marinated with Punjab spices', price: 320, image: 'https://source.unsplash.com/random/300x200/?fish,fried', vegetarian: false },
        ]
      },
      {
        category: 'Main Course',
        items: [
          { id: 201, name: 'Butter Chicken', description: 'Tender chicken cooked in rich tomato and butter gravy', price: 340, image: 'https://source.unsplash.com/random/300x200/?butter,chicken', vegetarian: false, bestseller: true },
          { id: 202, name: 'Paneer Butter Masala', description: 'Cottage cheese in a creamy tomato sauce', price: 280, image: 'https://source.unsplash.com/random/300x200/?paneer,masala', vegetarian: true },
          { id: 203, name: 'Dal Makhani', description: 'Black lentils cooked with butter and cream', price: 220, image: 'https://source.unsplash.com/random/300x200/?dal', vegetarian: true, bestseller: true },
          { id: 204, name: 'Biryani', description: 'Fragrant rice cooked with spices and vegetables or meat', price: 320, image: 'https://source.unsplash.com/random/300x200/?biryani', vegetarian: false },
        ]
      },
      {
        category: 'Bread & Rice',
        items: [
          { id: 301, name: 'Naan', description: 'Leavened flatbread baked in tandoor', price: 40, image: 'https://source.unsplash.com/random/300x200/?naan', vegetarian: true },
          { id: 302, name: 'Jeera Rice', description: 'Basmati rice tempered with cumin seeds', price: 120, image: 'https://source.unsplash.com/random/300x200/?rice', vegetarian: true },
          { id: 303, name: 'Laccha Paratha', description: 'Multi-layered flatbread', price: 60, image: 'https://source.unsplash.com/random/300x200/?paratha', vegetarian: true },
        ]
      },
      {
        category: 'Desserts',
        items: [
          { id: 401, name: 'Gulab Jamun', description: 'Deep-fried milk solids soaked in sugar syrup', price: 120, image: 'https://source.unsplash.com/random/300x200/?dessert,indian', vegetarian: true, bestseller: true },
          { id: 402, name: 'Rasmalai', description: 'Sweet cottage cheese dumplings in flavored milk', price: 150, image: 'https://source.unsplash.com/random/300x200/?sweet,indian', vegetarian: true },
        ]
      }
    ],
    reviews: [
      { id: 1, user: 'Priya S.', rating: 5, date: '2023-05-15', comment: 'Authentic flavors! The Butter Chicken and Naan were absolutely delicious.', avatar: 'https://source.unsplash.com/random/100x100/?portrait,woman' },
      { id: 2, user: 'Rahul M.', rating: 4, date: '2023-04-22', comment: 'Great food, though delivery took a bit longer than expected.', avatar: 'https://source.unsplash.com/random/100x100/?portrait,man' },
      { id: 3, user: 'Ananya T.', rating: 5, date: '2023-03-10', comment: 'Best Indian food in the city! The Dal Makhani is exceptional.', avatar: 'https://source.unsplash.com/random/100x100/?portrait,girl' },
    ]
  },
  {
    id: 2,
    name: 'Pasta Paradise',
    image: 'https://source.unsplash.com/random/1200x400/?restaurant,italian',
    cuisine: 'Italian',
    rating: 4.5,
    ratingCount: 182,
    priceLevel: '$$$',
    deliveryTime: '25-35 min',
    deliveryFee: 50,
    minOrder: 250,
    featured: false,
    location: 'Banjara Hills',
    address: '456 Cuisine Avenue, Banjara Hills, Hyderabad',
    phone: '+91 9876543211',
    openingHours: '11:00 AM - 11:00 PM',
    description: 'Authentic Italian cuisine featuring handmade pasta, wood-fired pizzas, and classic Italian desserts. All our ingredients are sourced from premium suppliers, including some imported directly from Italy.',
    menu: [
      {
        category: 'Starters',
        items: [
          { id: 101, name: 'Bruschetta', description: 'Grilled bread topped with tomatoes, basil, and olive oil', price: 180, image: 'https://source.unsplash.com/random/300x200/?bruschetta', vegetarian: true, bestseller: true },
          { id: 102, name: 'Calamari Fritti', description: 'Crispy fried calamari served with marinara sauce', price: 350, image: 'https://source.unsplash.com/random/300x200/?calamari', vegetarian: false },
          { id: 103, name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, and basil drizzled with balsamic glaze', price: 220, image: 'https://source.unsplash.com/random/300x200/?caprese', vegetarian: true },
        ]
      },
      {
        category: 'Pasta',
        items: [
          { id: 201, name: 'Spaghetti Carbonara', description: 'Spaghetti with eggs, cheese, pancetta, and black pepper', price: 320, image: 'https://source.unsplash.com/random/300x200/?carbonara', vegetarian: false },
          { id: 202, name: 'Fettuccine Alfredo', description: 'Fettuccine tossed in creamy parmesan sauce', price: 340, image: 'https://source.unsplash.com/random/300x200/?alfredo', vegetarian: true, bestseller: true },
          { id: 203, name: 'Penne Arrabbiata', description: 'Penne pasta in spicy tomato sauce', price: 280, image: 'https://source.unsplash.com/random/300x200/?pasta,tomato', vegetarian: true },
          { id: 204, name: 'Lasagna', description: 'Layered pasta with meat sauce and cheese', price: 380, image: 'https://source.unsplash.com/random/300x200/?lasagna', vegetarian: false, bestseller: true },
        ]
      },
      {
        category: 'Pizza',
        items: [
          { id: 301, name: 'Margherita', description: 'Classic pizza with tomato sauce, mozzarella, and basil', price: 300, image: 'https://source.unsplash.com/random/300x200/?pizza,margherita', vegetarian: true, bestseller: true },
          { id: 302, name: 'Pepperoni', description: 'Pizza topped with pepperoni and cheese', price: 380, image: 'https://source.unsplash.com/random/300x200/?pizza,pepperoni', vegetarian: false },
          { id: 303, name: 'Quattro Formaggi', description: 'Four cheese pizza with mozzarella, gorgonzola, fontina, and parmesan', price: 420, image: 'https://source.unsplash.com/random/300x200/?pizza,cheese', vegetarian: true },
        ]
      },
      {
        category: 'Desserts',
        items: [
          { id: 401, name: 'Tiramisu', description: 'Coffee-flavored Italian dessert with mascarpone cheese', price: 180, image: 'https://source.unsplash.com/random/300x200/?tiramisu', vegetarian: true, bestseller: true },
          { id: 402, name: 'Panna Cotta', description: 'Italian custard dessert with berry compote', price: 160, image: 'https://source.unsplash.com/random/300x200/?panna,cotta', vegetarian: true },
        ]
      }
    ],
    reviews: [
      { id: 1, user: 'Vikram K.', rating: 5, date: '2023-06-10', comment: 'The Fettuccine Alfredo is the best I\'ve had outside of Italy!', avatar: 'https://source.unsplash.com/random/100x100/?portrait,indian,man' },
      { id: 2, user: 'Meera P.', rating: 4, date: '2023-05-05', comment: 'Lovely ambiance and delicious pizza. A bit pricey though.', avatar: 'https://source.unsplash.com/random/100x100/?portrait,indian,woman' },
      { id: 3, user: 'Arjun S.', rating: 5, date: '2023-04-15', comment: 'Amazing food and quick delivery. Will order again!', avatar: 'https://source.unsplash.com/random/100x100/?portrait,boy' },
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
  
  const { addToCart } = useCart();

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
          src={restaurant.image}
          alt={restaurant.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
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
                    {restaurant.rating} ({restaurant.ratingCount} reviews)
                  </Typography>
                </Box>
                <Chip 
                  icon={<AccessTimeIcon fontSize="small" />} 
                  label={restaurant.deliveryTime} 
                  variant="outlined" 
                  size="small"
                />
                <Chip 
                  icon={<AttachMoneyIcon fontSize="small" />} 
                  label={restaurant.priceLevel} 
                  variant="outlined" 
                  size="small"
                />
                {restaurant.featured && (
                  <Chip 
                    label="Featured" 
                    color="secondary" 
                    size="small"
                  />
                )}
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
                                image={item.image}
                                alt={item.name}
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
                          {restaurant.ratingCount} reviews
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
                        Delivery Time: {restaurant.deliveryTime}
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