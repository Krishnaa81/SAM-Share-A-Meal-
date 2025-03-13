import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Rating,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn,
  DeliveryDining,
  RestaurantMenu,
  Star,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Mock data for cloud kitchens
const cloudKitchensData = [
  {
    id: 1,
    name: 'Home Kitchen',
    description: 'Homemade meals prepared with love',
    location: 'Hyderabad',
    rating: 4.7,
    image: '/images/kitchens/home-kitchen.jpg',
  },
  {
    id: 2,
    name: 'Curry House',
    description: 'Authentic Indian curries',
    location: 'Mumbai',
    rating: 4.5,
    image: '/images/kitchens/curry-house.jpg',
  },
  {
    id: 3,
    name: 'Green Bowl',
    description: 'Healthy salads and bowls',
    location: 'Bangalore',
    rating: 4.2,
    image: '/images/kitchens/green-bowl.jpg',
  },
  {
    id: 4,
    name: 'Pizza Express',
    description: 'Freshly baked pizzas',
    location: 'Delhi',
    rating: 4.6,
    image: '/images/kitchens/pizza-express.jpg',
  },
  {
    id: 5,
    name: 'Burger Joint',
    description: 'Gourmet burgers and fries',
    location: 'Chennai',
    rating: 4.4,
    image: '/images/kitchens/burger-joint.jpg',
  },
  {
    id: 6,
    name: 'Sushi Corner',
    description: 'Fresh Japanese cuisine',
    location: 'Pune',
    rating: 4.8,
    image: '/images/kitchens/sushi-corner.jpg',
  },
];

export default function CloudKitchens() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cloudKitchens, setCloudKitchens] = useState(cloudKitchensData);
  
  // Filter cloud kitchens based on search term
  useEffect(() => {
    if (searchTerm) {
      const filteredKitchens = cloudKitchensData.filter(
        kitchen => kitchen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  kitchen.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  kitchen.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCloudKitchens(filteredKitchens);
    } else {
      setCloudKitchens(cloudKitchensData);
    }
  }, [searchTerm]);

  const handleKitchenClick = (kitchenId) => {
    // For now, show an alert instead of navigating to a non-existent route
    alert(`Kitchen detail page for ${kitchenId} is coming soon!`);
    // Uncomment when detail page is implemented:
    // navigate(`/cloud-kitchens/${kitchenId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Cloud Kitchens
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover specialized cloud kitchens delivering delicious meals
        </Typography>
      </Box>

      {/* Search Bar */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 2, 
          mb: 3, 
          display: 'flex', 
          alignItems: 'center',
          borderRadius: 2,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search by kitchen name, cuisine, or location"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Cloud Kitchens Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : cloudKitchens.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No cloud kitchens found matching your search.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {cloudKitchens.map((kitchen) => (
            <Grid item xs={12} sm={6} md={4} key={kitchen.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                  },
                }}
                onClick={() => handleKitchenClick(kitchen.id)}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={kitchen.image}
                  alt={kitchen.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="h2">
                      {kitchen.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star sx={{ color: 'gold', mr: 0.5 }} fontSize="small" />
                      <Typography variant="body2" fontWeight="bold">
                        {kitchen.rating}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                    <LocationOn fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {kitchen.location}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {kitchen.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
} 