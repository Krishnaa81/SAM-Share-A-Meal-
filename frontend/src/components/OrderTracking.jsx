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
} from '@mui/icons-material';

const steps = [
  {
    label: 'Order Confirmed',
    icon: <RestaurantMenu />,
    time: '12:30 PM',
  },
  {
    label: 'Preparing',
    icon: <Kitchen />,
    time: '12:35 PM',
  },
  {
    label: 'Out for Delivery',
    icon: <LocalShipping />,
    time: '12:50 PM',
  },
  {
    label: 'Delivered',
    icon: <CheckCircle />,
    time: '1:15 PM',
  },
];

export default function OrderTracking({ order }) {
  // Mock order data
  const orderDetails = {
    id: '#123456',
    status: 'Preparing',
    restaurant: 'Tasty Bites',
    items: [
      { name: 'Butter Chicken', quantity: 1, price: '₹300' },
      { name: 'Naan', quantity: 2, price: '₹60' },
    ],
    total: '₹360',
    deliveryPartner: {
      name: 'John Doe',
      phone: '+91 9876543210',
      rating: 4.8,
      image: 'https://source.unsplash.com/random/100x100/?person',
    },
    estimatedDelivery: '1:15 PM',
    deliveryAddress: '123, Main Street, Bangalore - 560001',
  };

  const getStepStatus = (stepIndex) => {
    const currentStep = steps.findIndex(step => step.label === orderDetails.status);
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'active';
    return 'pending';
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Order Tracking
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Order ID: {orderDetails.id}
      </Typography>

      {/* Order Status Stepper */}
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={steps.findIndex(step => step.label === orderDetails.status)}>
          {steps.map((step, index) => (
            <Step key={step.label} completed={getStepStatus(index) === 'completed'}>
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
                <Typography variant="body2">{step.label}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {step.time}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Grid container spacing={3}>
        {/* Order Details */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Details
              </Typography>
              <List>
                {orderDetails.items.map((item, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemText
                      primary={item.name}
                      secondary={`${item.quantity}x - ${item.price}`}
                    />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1">Total</Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {orderDetails.total}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Delivery Partner Details */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Delivery Partner
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={orderDetails.deliveryPartner.image}
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle1">
                    {orderDetails.deliveryPartner.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rating: {orderDetails.deliveryPartner.rating} ⭐
                  </Typography>
                </Box>
              </Box>
              <List dense>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <Phone />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Contact"
                    secondary={orderDetails.deliveryPartner.phone}
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <AccessTime />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Estimated Delivery"
                    secondary={orderDetails.estimatedDelivery}
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
                    secondary={orderDetails.deliveryAddress}
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