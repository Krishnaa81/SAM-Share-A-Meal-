import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  Divider,
  Paper,
  Avatar,
  Rating,
  Stack,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { 
  Favorite, 
  Restaurant, 
  VolunteerActivism, 
  ShoppingCart, 
  Business, 
  ArrowForward,
  LocalShipping,
  CardGiftcard,
  People,
  Star
} from '@mui/icons-material';
// Replace the local import with a constant URL
// import HeroImage from '../assets/hero-image.jpg';
const HeroImage = 'https://source.unsplash.com/random/1600x900/?food,sharing';

// Mock data for featured restaurants
const FEATURED_RESTAURANTS = [
  {
    id: 1,
    name: 'Spice Garden',
    image: 'https://source.unsplash.com/random/600x400/?restaurant,indian',
    cuisine: 'Indian',
    rating: 4.8,
    priceLevel: '$$',
    deliveryTime: '20-30 min',
  },
  {
    id: 2,
    name: 'Pasta Paradise',
    image: 'https://source.unsplash.com/random/600x400/?restaurant,italian',
    cuisine: 'Italian',
    rating: 4.5,
    priceLevel: '$$$',
    deliveryTime: '25-35 min',
  },
  {
    id: 3,
    name: 'Sushi Station',
    image: 'https://source.unsplash.com/random/600x400/?restaurant,japanese',
    cuisine: 'Japanese',
    rating: 4.7,
    priceLevel: '$$$',
    deliveryTime: '30-40 min',
  },
  {
    id: 4,
    name: 'Burger Bros',
    image: 'https://source.unsplash.com/random/600x400/?restaurant,burger',
    cuisine: 'American',
    rating: 4.4,
    priceLevel: '$',
    deliveryTime: '15-25 min',
  },
];

// Mock data for featured donation partners
const DONATION_PARTNERS = [
  {
    id: 1,
    name: 'Hope Foundation',
    image: 'https://source.unsplash.com/random/300x200/?charity',
    description: 'Providing meals to homeless communities',
    donationsReceived: 5280,
  },
  {
    id: 2,
    name: 'Kids First',
    image: 'https://source.unsplash.com/random/300x200/?children,charity',
    description: 'Nutritious meals for underprivileged children',
    donationsReceived: 4120,
  },
  {
    id: 3,
    name: 'Elder Care',
    image: 'https://source.unsplash.com/random/300x200/?elderly,charity',
    description: 'Food support for senior citizens',
    donationsReceived: 3750,
  },
];

// Platform stats
const PLATFORM_STATS = [
  { label: 'Restaurants', value: '500+', icon: <Restaurant sx={{ fontSize: 40 }} /> },
  { label: 'Daily Orders', value: '10,000+', icon: <ShoppingCart sx={{ fontSize: 40 }} /> },
  { label: 'Meals Donated', value: '50,000+', icon: <Favorite sx={{ fontSize: 40 }} /> },
  { label: 'Corporate Partners', value: '100+', icon: <Business sx={{ fontSize: 40 }} /> },
];

// How it works steps
const HOW_IT_WORKS_STEPS = [
  {
    title: 'Order Food',
    description: 'Browse restaurants and order delicious meals for delivery',
    icon: <ShoppingCart sx={{ fontSize: 40 }} />,
  },
  {
    title: 'Fast Delivery',
    description: 'Receive your food quickly with our efficient delivery network',
    icon: <LocalShipping sx={{ fontSize: 40 }} />,
  },
  {
    title: 'Donate Excess',
    description: 'Restaurants can donate excess food to charity partners',
    icon: <VolunteerActivism sx={{ fontSize: 40 }} />,
  },
  {
    title: 'Earn CSR Credits',
    description: 'Businesses earn CSR credits for their contributions',
    icon: <CardGiftcard sx={{ fontSize: 40 }} />,
  },
];

const Home = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '60vh', md: '80vh' },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: 'primary.main',
          color: 'white',
        }}
      >
        <Box
          component="img"
          src={HeroImage}
          alt="FoodShare"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.4,
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4.5rem' },
                  mb: 2,
                }}
              >
                Food Delivery, Donation & CSR Credit System
              </Typography>
              <Typography
                variant="h5"
                sx={{ mb: 4, fontWeight: 400, width: { md: '80%' } }}
              >
                A comprehensive platform connecting restaurants, donors, cloud kitchens, and corporations for a sustainable food ecosystem.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  component={RouterLink}
                  to="/restaurants"
                  startIcon={<Restaurant />}
                  sx={{ py: 1.5, px: 3 }}
                >
                  Order Food
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  component={RouterLink}
                  to="/donate-food"
                  startIcon={<VolunteerActivism />}
                  sx={{ py: 1.5, px: 3, borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                >
                  Donate Food
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Platform Stats */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {PLATFORM_STATS.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 4,
                    bgcolor: 'background.default'
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h3" component="div" fontWeight="bold" sx={{ mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h2" align="center" gutterBottom fontWeight="bold">
            How It Works
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
            Our platform connects restaurants, customers, charities, and corporations 
            in a sustainable food ecosystem
          </Typography>
          
          <Grid container spacing={4}>
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper 
                  elevation={2}
                  sx={{ 
                    p: 3, 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    borderRadius: 4,
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Box sx={{ 
                    bgcolor: 'primary.light', 
                    color: 'white', 
                    p: 2, 
                    borderRadius: '50%',
                    display: 'flex',
                    mb: 2
                  }}>
                    {step.icon}
                  </Box>
                  <Typography variant="h5" component="h3" align="center" gutterBottom sx={{ fontWeight: 600 }}>
                    {step.title}
                  </Typography>
                  <Typography align="center" color="text.secondary">
                    {step.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Restaurants */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h3" component="h2" fontWeight="bold">
              Featured Restaurants
            </Typography>
            <Button 
              endIcon={<ArrowForward />} 
              component={RouterLink} 
              to="/restaurants"
              variant="text" 
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              View All
            </Button>
          </Box>

          <Grid container spacing={3}>
            {FEATURED_RESTAURANTS.map((restaurant) => (
              <Grid item key={restaurant.id} xs={12} sm={6} md={3}>
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
                  <CardMedia
                    component="img"
                    height="180"
                    image={restaurant.image}
                    alt={restaurant.name}
                  />
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
                    <Typography variant="body2" color="text.secondary">
                      Delivery: {restaurant.deliveryTime}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      component={RouterLink}
                      to={`/restaurants/${restaurant.id}`}
                    >
                      View Menu
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Donation Partners */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom fontWeight="bold">
            Our Donation Partners
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
            We collaborate with trusted charity partners to distribute donated food to those in need
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {DONATION_PARTNERS.map((partner) => (
              <Grid item key={partner.id} xs={12} sm={6} md={4}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={partner.image}
                    alt={partner.name}
                  />
                  <CardContent>
                    <Typography variant="h5" component="div" gutterBottom fontWeight="bold">
                      {partner.name}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {partner.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <VolunteerActivism color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {partner.donationsReceived.toLocaleString()} meals received
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      color="primary" 
                      component={RouterLink}
                      to="/donate-food"
                    >
                      Donate to this Partner
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box 
        sx={{ 
          py: 8, 
          bgcolor: 'primary.main', 
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
            Join Our Mission
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
            Whether you're hungry, want to donate, or represent a restaurant or corporation, 
            there's a place for you in our ecosystem.
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={RouterLink}
              to="/register"
              sx={{ py: 1.5, px: 3 }}
            >
              Sign Up Now
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              component={RouterLink}
              to="/about"
              sx={{ py: 1.5, px: 3, borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              Learn More
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 