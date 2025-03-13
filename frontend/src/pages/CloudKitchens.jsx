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

  // Handle kitchen click to navigate to detail page
  const handleKitchenClick = (kitchenId) => {
    navigate(`/cloud-kitchens/${kitchenId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom component="h1">
        Cloud Kitchens
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Explore our network of cloud kitchens offering a variety of cuisines
      </Typography>

      {/* Search bar */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search kitchens by name, cuisine, or location..."
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

      {/* Kitchen listing */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : cloudKitchens.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" paragraph>
            No kitchens found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search or filters
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
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  }
                }}
                onClick={() => handleKitchenClick(kitchen.id)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={kitchen.image}
                  alt={kitchen.name}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGtpdGNoZW58ZW58MHx8MHx8&w=1000&q=80';
                  }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h2">
                      {kitchen.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={kitchen.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {kitchen.rating}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {kitchen.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      {kitchen.location}
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleKitchenClick(kitchen.id);
                    }}
                  >
                    View Kitchen
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
} 