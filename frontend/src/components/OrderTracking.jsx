import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  RestaurantMenu,
  Kitchen,
  LocalShipping,
  CheckCircle,
  AccessTime,
  LocationOn,
  Person,
  Phone,
  Receipt,
} from '@mui/icons-material';

// Define the possible steps and their properties
const STEPS = [
  {
    status: 'Order Confirmed',
    icon: <RestaurantMenu />,
    description: 'Your order has been received by the restaurant',
  },
  {
    status: 'Preparing',
    icon: <Kitchen />,
    description: 'The restaurant is preparing your food',
  },
  {
    status: 'Out for Delivery',
    icon: <LocalShipping />,
    description: 'Your order is on the way',
  },
  {
    status: 'Delivered',
    icon: <CheckCircle />,
    description: 'Your order has been delivered',
  },
];

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Handle image errors
const handleImageError = (e) => {
  e.target.onerror = null;
  
  // Set appropriate fallback based on context
  if (e.target.classList.contains('restaurant-image')) {
    e.target.src = '/images/restaurants/fallback-restaurant.jpg';
  } else if (e.target.classList.contains('delivery-image')) {
    e.target.src = '/images/avatars/fallback-avatar.jpg';
  } else {
    e.target.src = '/images/fallback-image.jpg';
  }
};

export default function OrderTracking({ order }) {
  // If no order provided, use empty defaults
  if (!order) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">No order information available</Typography>
      </Paper>
    );
  }

  // Get the current status from the delivery tracking
  const currentStatusObj = order.deliveryTracking && order.deliveryTracking.length > 0 
    ? order.deliveryTracking[order.deliveryTracking.length - 1] 
    : { status: 'Order Confirmed' };
  
  const currentStatus = currentStatusObj.status;

  // Find the current step index
  const currentStepIndex = STEPS.findIndex(step => step.status === currentStatus);

  // Prepare the steps with timestamps from the tracking data
  const stepsWithTimestamps = STEPS.map(step => {
    const matchingTrack = order.deliveryTracking?.find(track => track.status === step.status);
    return {
      ...step,
      time: matchingTrack ? formatDate(matchingTrack.timestamp) : '',
      completed: !!matchingTrack,
    };
  });

  // Get the status for a step (completed, active, or pending)
  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStepIndex || stepsWithTimestamps[stepIndex].completed) return 'completed';
    if (stepIndex === currentStepIndex) return 'active';
    return 'pending';
  };

  // Format the delivery address
  const formattedAddress = order.deliveryAddress ? 
    `${order.deliveryAddress.line1}, ${order.deliveryAddress.line2 ? order.deliveryAddress.line2 + ', ' : ''}${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.pincode}` :
    'No address provided';

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Order Tracking
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Order ID: {order.id}
          </Typography>
        </Box>
        <Chip 
          label={currentStatus} 
          color={currentStatus === 'Delivered' ? 'success' : 'primary'} 
          variant="outlined"
        />
      </Box>

      {/* Order Status Stepper */}
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={currentStepIndex} alternativeLabel>
          {stepsWithTimestamps.map((step, index) => (
            <Step key={step.status} completed={getStepStatus(index) === 'completed'}>
              <StepLabel StepIconComponent={() => (
                <Avatar
                  sx={{
                    bgcolor: getStepStatus(index) === 'completed' ? 'success.main' :
                           getStepStatus(index) === 'active' ? 'primary.main' : 'grey.400',
                    width: 24,
                    height: 24,
                  }}
                >
                  {step.icon}
                </Avatar>
              )}>
                <Typography variant="body2">{step.status}</Typography>
                {step.time && (
                  <Typography variant="caption" color="text.secondary">
                    {step.time}
                  </Typography>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Grid container spacing={3}>
        {/* Restaurant Details */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Restaurant Details
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={order.restaurant?.image}
                  alt={order.restaurant?.name}
                  sx={{ width: 56, height: 56, mr: 2 }}
                  className="restaurant-image"
                  onError={handleImageError}
                />
                <Box>
                  <Typography variant="subtitle1">
                    {order.restaurant?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.restaurant?.address}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Order Items
              </Typography>
              <List dense>
                {order.items?.map((item, index) => (
                  <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={`${item.name} × ${item.quantity}`}
                      secondary={`₹${item.price.toFixed(2)}`}
                    />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="body2">₹{order.subtotal.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Delivery Fee</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="body2">₹{order.deliveryFee.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Tax</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="body2">₹{order.tax.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Total</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="subtitle2">₹{order.totalAmount.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Chip 
                    icon={<Receipt />}
                    label={`Payment: ${order.paymentMethod}`} 
                    size="small" 
                    variant="outlined" 
                    sx={{ mt: 1 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Delivery Details */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Delivery Details
              </Typography>
              {order.deliveryPartner && (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    Delivery Partner
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={order.deliveryPartner.image}
                      sx={{ width: 56, height: 56, mr: 2 }}
                      className="delivery-image"
                      onError={handleImageError}
                    />
                    <Box>
                      <Typography variant="subtitle1">
                        {order.deliveryPartner.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rating: {order.deliveryPartner.rating} ⭐
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Phone: {order.deliveryPartner.phone}
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
              <Divider sx={{ my: 2 }} />
              <List dense>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <AccessTime />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Estimated Delivery Time"
                    secondary={order.estimatedDelivery}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Recipient"
                    secondary={`${order.deliveryAddress?.name || 'N/A'} (${order.deliveryAddress?.phone || 'N/A'})`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <LocationOn />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Delivery Address"
                    secondary={formattedAddress}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
} 