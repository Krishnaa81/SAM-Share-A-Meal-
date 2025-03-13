import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Chip,
  Box,
  Rating,
} from '@mui/material';
import {
  Restaurant,
  LocalShipping,
  Favorite,
  AccountCircle,
  Receipt,
  LocalOffer,
} from '@mui/icons-material';

// Mock data
const recentOrders = [
  {
    id: 1,
    restaurant: 'Spice Hub',
    items: ['Butter Chicken', 'Naan'],
    total: '₹450',
    status: 'Delivered',
    date: '2024-03-15',
  },
  {
    id: 2,
    restaurant: 'Pizza Palace',
    items: ['Margherita Pizza', 'Coke'],
    total: '₹350',
    status: 'In Progress',
    date: '2024-03-14',
  },
];

const favoriteRestaurants = [
  {
    id: 1,
    name: 'Spice Hub',
    cuisine: 'Indian',
    rating: 4.5,
    image: '/images/dashboard/indian-food.jpg',
  },
  {
    id: 2,
    name: 'Pizza Palace',
    cuisine: 'Italian',
    rating: 4.3,
    image: '/images/dashboard/pizza-delivery.jpg',
  },
];

const rewards = {
  points: 450,
  level: 'Silver',
  nextLevel: 'Gold',
  pointsToNext: 50,
};

export default function CustomerDashboard() {
  return (
    <Grid container spacing={3}>
      {/* Welcome Section */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h4" gutterBottom>
            Welcome back, John!
          </Typography>
          <Typography variant="subtitle1">
            Ready to explore delicious meals?
          </Typography>
        </Paper>
      </Grid>

      {/* Quick Stats */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Receipt sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6">Total Orders</Typography>
            </Box>
            <Typography variant="h3" gutterBottom>
              24
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last order: 2 days ago
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalOffer sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6">Reward Points</Typography>
            </Box>
            <Typography variant="h3" gutterBottom>
              {rewards.points}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {rewards.pointsToNext} points to {rewards.nextLevel}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Favorite sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6">Favorite Places</Typography>
            </Box>
            <Typography variant="h3" gutterBottom>
              {favoriteRestaurants.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Restaurants you love
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Orders */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Recent Orders
          </Typography>
          <List>
            {recentOrders.map((order) => (
              <ListItem
                key={order.id}
                sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <Restaurant />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={order.restaurant}
                  secondary={
                    <>
                      {order.items.join(', ')}
                      <br />
                      {order.date}
                    </>
                  }
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Typography variant="subtitle1" color="primary">
                    {order.total}
                  </Typography>
                  <Chip
                    label={order.status}
                    color={order.status === 'Delivered' ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>
              </ListItem>
            ))}
          </List>
          <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
            View All Orders
          </Button>
        </Paper>
      </Grid>

      {/* Favorite Restaurants */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Favorite Restaurants
          </Typography>
          <List>
            {favoriteRestaurants.map((restaurant) => (
              <ListItem
                key={restaurant.id}
                sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}
              >
                <ListItemAvatar>
                  <Avatar src={restaurant.image} alt={restaurant.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={restaurant.name}
                  secondary={
                    <>
                      {restaurant.cuisine}
                      <Rating value={restaurant.rating} size="small" readOnly sx={{ ml: 1 }} />
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
          <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
            Explore More
          </Button>
        </Paper>
      </Grid>

      {/* Quick Actions */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Button
                variant="outlined"
                startIcon={<Restaurant />}
                fullWidth
                sx={{ height: '100%' }}
              >
                Order Food
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                variant="outlined"
                startIcon={<LocalShipping />}
                fullWidth
                sx={{ height: '100%' }}
              >
                Track Order
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                variant="outlined"
                startIcon={<Favorite />}
                fullWidth
                sx={{ height: '100%' }}
              >
                Favorites
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                variant="outlined"
                startIcon={<AccountCircle />}
                fullWidth
                sx={{ height: '100%' }}
              >
                Profile
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
} 