import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Skeleton,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Favorite as FavoriteIcon,
  Business as BusinessIcon,
  LocalShipping as DeliveryIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Use a more reliable static image URL instead of a random one
const heroImageUrl = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80';
// Fallback image in case the first one fails
const fallbackImageUrl = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImage, setCurrentImage] = useState(heroImageUrl);

  // Handle image loading error
  useEffect(() => {
    if (imageError && currentImage !== fallbackImageUrl) {
      setCurrentImage(fallbackImageUrl);
      setImageError(false);
    }
  }, [imageError, currentImage]);

  const features = [
    {
      icon: <RestaurantIcon sx={{ fontSize: 40 }} />,
      title: "Quality Restaurants",
      description: "Partner with top-rated restaurants offering delicious meals"
    },
    {
      icon: <DeliveryIcon sx={{ fontSize: 40 }} />,
      title: "Fast Delivery",
      description: "Quick and reliable delivery to your doorstep"
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 40 }} />,
      title: "Food Donation",
      description: "Make a difference by donating food to those in need"
    },
    {
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      title: "CSR Integration",
      description: "Corporate social responsibility made easy"
    }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  mb: 2,
                }}
              >
                Food Delivery, Donation & CSR Credit System
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                A comprehensive platform connecting restaurants, donors, cloud kitchens,
                and corporations for a sustainable food ecosystem.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                {!isAuthenticated ? (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      color="secondary"
                      onClick={() => navigate('/register')}
                      sx={{ px: 4, py: 1.5 }}
                    >
                      Get Started
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      color="inherit"
                      onClick={() => navigate('/login')}
                      sx={{ px: 4, py: 1.5 }}
                    >
                      Login
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      color="secondary"
                      onClick={() => navigate('/restaurants')}
                      startIcon={<RestaurantIcon />}
                      sx={{ px: 4, py: 1.5 }}
                    >
                      Order Food
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      color="inherit"
                      onClick={() => navigate('/donate-food')}
                      startIcon={<FavoriteIcon />}
                      sx={{ px: 4, py: 1.5 }}
                    >
                      Donate Food
                    </Button>
                  </>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              {!imageLoaded && (
                <Skeleton 
                  variant="rounded" 
                  width="100%" 
                  height={300} 
                  animation="wave"
                  sx={{ 
                    maxWidth: 500, 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 4,
                  }} 
                />
              )}
              <Box
                component="img"
                src={currentImage}
                alt="Food Delivery"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                sx={{
                  width: '100%',
                  maxWidth: 500,
                  height: 'auto',
                  display: imageLoaded ? 'block' : 'none',
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.03)',
                  },
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h2">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action Section */}
      {isAuthenticated && (
        <Box sx={{ bgcolor: 'secondary.light', py: 8 }}>
          <Container maxWidth="xl">
            <Grid container spacing={4} alignItems="center" justifyContent="center">
              <Grid item xs={12} md={6} textAlign="center">
                <Typography variant="h4" gutterBottom>
                  Ready to make a difference?
                </Typography>
                <Typography variant="subtitle1" paragraph>
                  Start ordering or donating food today.
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate('/restaurants')}
                  >
                    Browse Restaurants
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={() => navigate('/donate-food')}
                  >
                    Donate Now
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}
    </Box>
  );
} 