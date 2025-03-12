import { useState, useEffect } from 'react';
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
  IconButton,
  Divider,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openClearCartDialog, setOpenClearCartDialog] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(40);
  
  // Group items by restaurant
  const restaurantGroups = cartItems.reduce((groups, item) => {
    if (!groups[item.restaurantId]) {
      groups[item.restaurantId] = {
        name: item.restaurantName,
        items: []
      };
    }
    groups[item.restaurantId].items.push(item);
    return groups;
  }, {});

  // Handle quantity adjustments
  const handleDecreaseQuantity = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      updateQuantity(itemId, item.quantity - 1);
    }
  };

  const handleIncreaseQuantity = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      updateQuantity(itemId, item.quantity + 1);
    }
  };

  // Handle removing items
  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
    setSnackbarMessage('Item removed from cart');
    setSnackbarOpen(true);
  };

  // Handle applying coupon
  const handleApplyCoupon = () => {
    setLoading(true);
    
    // Mock API call for coupon validation
    setTimeout(() => {
      if (couponCode.toUpperCase() === 'FOODSHARE20') {
        setDiscount(getCartTotal() * 0.2);
        setCouponError('');
        setSnackbarMessage('Coupon applied successfully!');
        setSnackbarOpen(true);
      } else {
        setCouponError('Invalid coupon code');
        setDiscount(0);
      }
      setLoading(false);
    }, 1000);
  };

  // Handle clearing cart
  const handleClearCart = () => {
    clearCart();
    setOpenClearCartDialog(false);
    setSnackbarMessage('Cart cleared');
    setSnackbarOpen(true);
  };

  // Handle proceeding to checkout
  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart', message: 'Please log in to proceed with checkout' } });
      return;
    }
    
    navigate('/checkout');
  };

  // Close snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Calculate totals
  const subtotal = getCartTotal();
  const total = subtotal + deliveryFee - discount;

  // Handle empty cart
  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <ShoppingCartIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2, opacity: 0.7 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/restaurants')}
            sx={{ mt: 2 }}
          >
            Browse Restaurants
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)} 
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Your Cart
        </Typography>
        <Button 
          variant="outlined" 
          color="error" 
          size="small" 
          startIcon={<DeleteIcon />} 
          sx={{ ml: 'auto' }}
          onClick={() => setOpenClearCartDialog(true)}
        >
          Clear Cart
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          {Object.keys(restaurantGroups).map((restaurantId) => (
            <Paper 
              elevation={2} 
              key={restaurantId} 
              sx={{ mb: 3, p: 3, borderRadius: 2 }}
            >
              <Typography variant="h6" gutterBottom>
                {restaurantGroups[restaurantId].name}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List disablePadding>
                {restaurantGroups[restaurantId].items.map((item) => (
                  <ListItem 
                    key={item.id} 
                    alignItems="flex-start" 
                    disablePadding 
                    sx={{ mb: 2, pb: 2, borderBottom: 1, borderColor: 'divider' }}
                  >
                    <ListItemAvatar sx={{ mr: 2 }}>
                      <Avatar 
                        variant="rounded" 
                        src={item.image} 
                        alt={item.name}
                        sx={{ width: 80, height: 80 }}
                      />
                    </ListItemAvatar>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {item.name}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="bold">
                          ₹{item.price * item.quantity}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        ₹{item.price} each
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDecreaseQuantity(item.id)}
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="body1" sx={{ mx: 1, minWidth: '30px', textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => handleIncreaseQuantity(item.id)}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          size="small" 
                          sx={{ ml: 'auto' }} 
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Paper>
          ))}
        </Grid>
        
        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 100 }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Order Summary
            </Typography>
            <List disablePadding>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Subtotal" />
                <Typography variant="body1">₹{subtotal.toFixed(2)}</Typography>
              </ListItem>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Delivery Fee" />
                <Typography variant="body1">₹{deliveryFee.toFixed(2)}</Typography>
              </ListItem>
              {discount > 0 && (
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemText primary="Discount" />
                  <Typography variant="body1" color="success.main">
                    -₹{discount.toFixed(2)}
                  </Typography>
                </ListItem>
              )}
              <Divider sx={{ my: 1 }} />
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary={<Typography variant="subtitle1" fontWeight="bold">Total</Typography>} />
                <Typography variant="subtitle1" fontWeight="bold">
                  ₹{total.toFixed(2)}
                </Typography>
              </ListItem>
            </List>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Apply Coupon Code
              </Typography>
              <Box sx={{ display: 'flex' }}>
                <TextField
                  size="small"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code"
                  error={!!couponError}
                  helperText={couponError}
                  fullWidth
                  sx={{ mr: 1 }}
                />
                <Button 
                  variant="outlined" 
                  onClick={handleApplyCoupon}
                  disabled={!couponCode || loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Apply'}
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.75rem' }}>
                Try code: FOODSHARE20 for 20% off
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleCheckout}
              sx={{ mt: 3 }}
            >
              Proceed to Checkout
            </Button>
            
            {!isAuthenticated && (
              <Alert severity="info" sx={{ mt: 2 }}>
                You'll need to log in before completing your order.
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Clear Cart Confirmation Dialog */}
      <Dialog
        open={openClearCartDialog}
        onClose={() => setOpenClearCartDialog(false)}
      >
        <DialogTitle>Clear your cart?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove all items from your cart? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenClearCartDialog(false)}>Cancel</Button>
          <Button onClick={handleClearCart} color="error" variant="contained">
            Clear Cart
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default Cart; 