import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Divider,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import {
  AccessTime,
  CheckCircle,
  LocalShipping,
  ErrorOutline,
  ArrowBack,
  LocationOn,
  Person,
  Phone,
  Email
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import * as imageUtils from '../utils/imageUtils';

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'warning';
    case 'processing':
      return 'info';
    case 'delivering':
      return 'secondary';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

// Helper function to get status icon
const getStatusIcon = (status) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return <AccessTime />;
    case 'processing':
      return <AccessTime />;
    case 'delivering':
      return <LocalShipping />;
    case 'completed':
      return <CheckCircle />;
    case 'cancelled':
      return <ErrorOutline />;
    default:
      return null;
  }
};

const OrderDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        // Try to fetch from API first
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };

        const response = await axios.get(`/api/orders/${id}`, config);
        const orderData = response.data;
        
        // Save to localStorage for offline access
        const savedOrders = JSON.parse(localStorage.getItem(`user_${user.id}_orders`) || '[]');
        const orderIndex = savedOrders.findIndex(order => order._id === id);
        
        if (orderIndex !== -1) {
          savedOrders[orderIndex] = orderData;
        } else {
          savedOrders.push(orderData);
        }
        
        localStorage.setItem(`user_${user.id}_orders`, JSON.stringify(savedOrders));
        
        setOrder(orderData);
        setLoading(false);
      } catch (error) {
        console.error('API fetch error:', error);
        
        // Try to get from localStorage as fallback
        try {
          const savedOrders = JSON.parse(localStorage.getItem(`user_${user.id}_orders`) || '[]');
          const savedOrder = savedOrders.find(order => order._id === id);
          
          if (savedOrder) {
            setOrder(savedOrder);
            setLoading(false);
            return;
          }
        } catch (localStorageError) {
          console.error('LocalStorage error:', localStorageError);
        }
        
        // If no saved order, use mock data
        setError('Could not connect to server. Showing sample order data.');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, user]);

  // Replace the handleImageError function with our utility version
  const handleImageError = (e) => {
    imageUtils.handleImageError(e, 'restaurant');
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5">You must be logged in to view order details</Typography>
          <Button 
            component={Link} 
            to="/login" 
            variant="contained" 
            sx={{ mt: 2 }}
          >
            Log In
          </Button>
        </Paper>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        <Button 
          component={Link} 
          to="/orders" 
          startIcon={<ArrowBack />}
          sx={{ mt: 2 }}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5">Order not found</Typography>
          <Button 
            component={Link} 
            to="/orders" 
            variant="contained" 
            startIcon={<ArrowBack />}
            sx={{ mt: 2 }}
          >
            Back to Orders
          </Button>
        </Paper>
      </Container>
    );
  }

  // For demo purposes, we'll create a mock order if the API hasn't been implemented
  const mockOrder = {
    _id: id,
    orderNumber: `ORD-${Math.floor(Math.random() * 10000)}`,
    createdAt: new Date().toISOString(),
    status: ['pending', 'processing', 'delivering', 'completed'][Math.floor(Math.random() * 4)],
    restaurant: {
      name: 'Sample Restaurant',
      image: '/images/restaurants/spice-junction.jpg',
      address: '123 Main St, New York, NY'
    },
    items: [
      { name: 'Veggie Burger', quantity: 2, price: 9.99 },
      { name: 'French Fries', quantity: 1, price: 3.99 },
      { name: 'Coke', quantity: 2, price: 1.99 }
    ],
    subtotal: 27.95,
    deliveryFee: 2.99,
    tax: 2.50,
    totalAmount: 33.44,
    paymentMethod: 'Credit Card',
    deliveryAddress: {
      street: '456 Elm Street',
      city: 'Brooklyn',
      state: 'NY',
      zipCode: '11201'
    },
    contactInfo: {
      name: user.name,
      email: user.email,
      phone: user.phone || '555-123-4567'
    }
  };

  // Use actual order data if available, otherwise use mock data
  const displayOrder = order.items ? order : mockOrder;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        component={Link} 
        to="/orders" 
        startIcon={<ArrowBack />}
        sx={{ mb: 3 }}
      >
        Back to Orders
      </Button>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4">
                Order #{displayOrder.orderNumber || displayOrder._id.substring(displayOrder._id.length - 8)}
              </Typography>
              <Box>
                <Chip
                  icon={getStatusIcon(displayOrder.status)}
                  label={displayOrder.status}
                  color={getStatusColor(displayOrder.status)}
                  sx={{ mr: 1 }}
                />
                <Button
                  component={Link}
                  to={`/order-tracking/${displayOrder._id}`}
                  variant="contained"
                  color="secondary"
                  startIcon={<LocalShipping />}
                  size="small"
                >
                  Track Order
                </Button>
              </Box>
            </Box>
            
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Placed on {formatDate(displayOrder.createdAt)}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={3}>
              {displayOrder.restaurant && (
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Restaurant</Typography>
                  <Card sx={{ display: 'flex', mb: 2 }}>
                    <Box sx={{ width: 100, height: 100 }}>
                      <img 
                        {...imageUtils.createImageProps(
                          displayOrder.restaurant.image,
                          displayOrder.restaurant.name,
                          'restaurant',
                          { style: { width: '100%', height: '100%', objectFit: 'cover' } }
                        )}
                      />
                    </Box>
                    <CardContent>
                      <Typography variant="h6">{displayOrder.restaurant.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        <LocationOn fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                        {displayOrder.restaurant.address}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Delivery Address</Typography>
                <Typography variant="body1">
                  <LocationOn fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  {`${displayOrder.deliveryAddress?.street || ''}, 
                  ${displayOrder.deliveryAddress?.city || ''}, 
                  ${displayOrder.deliveryAddress?.state || ''} 
                  ${displayOrder.deliveryAddress?.zipCode || ''}`}
                </Typography>
                
                <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>Contact Information</Typography>
                <Stack spacing={1}>
                  <Typography variant="body1">
                    <Person fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    {displayOrder.contactInfo?.name || user.name}
                  </Typography>
                  <Typography variant="body1">
                    <Email fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    {displayOrder.contactInfo?.email || user.email}
                  </Typography>
                  <Typography variant="body1">
                    <Phone fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    {displayOrder.contactInfo?.phone || user.phone || 'Not provided'}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Order Items</Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayOrder.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                      <TableCell align="right">₹{(item.quantity * item.price).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={12} container justifyContent="space-between">
                  <Typography variant="body1">Subtotal</Typography>
                  <Typography variant="body1">₹{displayOrder.subtotal.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={12} container justifyContent="space-between">
                  <Typography variant="body1">Delivery Fee</Typography>
                  <Typography variant="body1">₹{displayOrder.deliveryFee.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={12} container justifyContent="space-between">
                  <Typography variant="body1">Tax</Typography>
                  <Typography variant="body1">₹{displayOrder.tax.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={12} container justifyContent="space-between">
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">₹{displayOrder.totalAmount.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={12} container justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                  <Typography variant="body2" color="text.secondary">{displayOrder.paymentMethod}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetail; 