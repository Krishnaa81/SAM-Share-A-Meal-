import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  LocalAtm as CashIcon,
  Check as CheckIcon,
  LocationOn as LocationIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// Step components
const AddressForm = ({ formData, setFormData, savedAddresses, setActiveAddress }) => {
  const [useNewAddress, setUseNewAddress] = useState(!savedAddresses.length);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Box>
      {savedAddresses.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Saved Addresses
          </Typography>
          <Grid container spacing={2}>
            {savedAddresses.map((address, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    p: 1, 
                    cursor: 'pointer',
                    border: formData.addressId === address.id ? 2 : 1,
                    borderColor: formData.addressId === address.id ? 'primary.main' : 'divider'
                  }}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, addressId: address.id }));
                    setUseNewAddress(false);
                    setActiveAddress(address);
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {address.name}
                      </Typography>
                      {address.default && (
                        <Chip 
                          label="Default" 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {address.line1}, {address.line2}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {address.city}, {address.state} {address.pincode}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Phone: {address.phone}
                    </Typography>
                    <Button 
                      size="small" 
                      startIcon={<EditIcon />} 
                      sx={{ mt: 1, px: 0 }}
                    >
                      Edit
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            <Grid item xs={12} sm={6}>
              <Card 
                variant="outlined" 
                sx={{ 
                  p: 1, 
                  cursor: 'pointer',
                  border: useNewAddress ? 2 : 1,
                  borderColor: useNewAddress ? 'primary.main' : 'divider',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={() => {
                  setUseNewAddress(true);
                  setFormData(prev => ({ ...prev, addressId: null }));
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <AddIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="subtitle2">
                    Add New Address
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {(useNewAddress || !savedAddresses.length) && (
        <Box component="form" sx={{ mt: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Enter Delivery Address
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Address Line 1"
                name="line1"
                value={formData.line1}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 2 (Optional)"
                name="line2"
                value={formData.line2}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="PIN Code"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Delivery Instructions (Optional)"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Radio
                    checked={formData.saveAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, saveAddress: e.target.checked }))}
                    name="saveAddress"
                  />
                }
                label="Save this address for future orders"
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

const PaymentMethod = ({ formData, setFormData }) => {
  // Handle payment method change
  const handlePaymentChange = (e) => {
    setFormData(prev => ({ ...prev, paymentMethod: e.target.value }));
  };

  return (
    <Box>
      <FormControl component="fieldset" sx={{ width: '100%' }}>
        <FormLabel component="legend">Select Payment Method</FormLabel>
        <RadioGroup
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handlePaymentChange}
        >
          <Paper variant="outlined" sx={{ mb: 2, mt: 2, borderRadius: 1 }}>
            <FormControlLabel
              value="card"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                  <CreditCardIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2">Credit/Debit Card</Typography>
                    <Typography variant="body2" color="text.secondary">Pay securely with your card</Typography>
                  </Box>
                </Box>
              }
              sx={{ width: '100%', m: 0, px: 2 }}
            />
          </Paper>
          
          <Paper variant="outlined" sx={{ mb: 2, borderRadius: 1 }}>
            <FormControlLabel
              value="netbanking"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                  <BankIcon sx={{ mr: 1, color: 'info.main' }} />
                  <Box>
                    <Typography variant="subtitle2">Net Banking</Typography>
                    <Typography variant="body2" color="text.secondary">Pay using your bank account</Typography>
                  </Box>
                </Box>
              }
              sx={{ width: '100%', m: 0, px: 2 }}
            />
          </Paper>
          
          <Paper variant="outlined" sx={{ mb: 2, borderRadius: 1 }}>
            <FormControlLabel
              value="cod"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                  <CashIcon sx={{ mr: 1, color: 'success.main' }} />
                  <Box>
                    <Typography variant="subtitle2">Cash on Delivery</Typography>
                    <Typography variant="body2" color="text.secondary">Pay when you receive your order</Typography>
                  </Box>
                </Box>
              }
              sx={{ width: '100%', m: 0, px: 2 }}
            />
          </Paper>
        </RadioGroup>
      </FormControl>
      
      {formData.paymentMethod === 'card' && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Card Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Card Number"
                placeholder="XXXX XXXX XXXX XXXX"
                disabled
                helperText="Demo mode: Card payment simulation"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                placeholder="MM/YY"
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CVV"
                placeholder="XXX"
                disabled
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

const OrderReview = ({ activeAddress, cartItems, subtotal, deliveryFee, discount, donationAmount, total }) => {
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Delivery Address
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex' }}>
          <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Box>
            <Typography variant="subtitle2">{activeAddress.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {activeAddress.line1}, {activeAddress.line2 && `${activeAddress.line2}, `}
              {activeAddress.city}, {activeAddress.state} {activeAddress.pincode}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: {activeAddress.phone}
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Order Summary
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <List disablePadding>
          {cartItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ py: 1 }}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">
                      {item.quantity} x {item.name}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                }
                sx={{ m: 0 }}
              />
            </ListItem>
          ))}
          <Divider sx={{ my: 1.5 }} />
          <ListItem disablePadding sx={{ py: 1 }}>
            <ListItemText 
              primary="Subtotal" 
              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
              sx={{ m: 0 }}
            />
            <Typography variant="body2">
              ₹{subtotal.toFixed(2)}
            </Typography>
          </ListItem>
          <ListItem disablePadding sx={{ py: 1 }}>
            <ListItemText 
              primary="Delivery Fee" 
              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
              sx={{ m: 0 }}
            />
            <Typography variant="body2">
              ₹{deliveryFee.toFixed(2)}
            </Typography>
          </ListItem>
          {discount > 0 && (
            <ListItem disablePadding sx={{ py: 1 }}>
              <ListItemText 
                primary="Discount" 
                primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                sx={{ m: 0 }}
              />
              <Typography variant="body2" color="success.main">
                -₹{discount.toFixed(2)}
              </Typography>
            </ListItem>
          )}
          {donationAmount > 0 && (
            <ListItem disablePadding sx={{ py: 1 }}>
              <ListItemText 
                primary="Donation" 
                primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                sx={{ m: 0 }}
              />
              <Typography variant="body2" color="primary.main">
                ₹{donationAmount.toFixed(2)}
              </Typography>
            </ListItem>
          )}
          <Divider sx={{ my: 1.5 }} />
          <ListItem disablePadding sx={{ py: 1 }}>
            <ListItemText 
              primary="Total" 
              primaryTypographyProps={{ variant: 'subtitle2', fontWeight: 'bold' }}
              sx={{ m: 0 }}
            />
            <Typography variant="subtitle2" fontWeight="bold">
              ₹{total.toFixed(2)}
            </Typography>
          </ListItem>
        </List>
      </Paper>

      <Alert severity="info" sx={{ mb: 2 }}>
        This is a demo application. No real payment will be processed.
      </Alert>
    </Box>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { cartItems, clearCart, getCartTotal } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    instructions: '',
    saveAddress: true,
    addressId: null,
    paymentMethod: 'cod'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [donationAmount, setDonationAmount] = useState(0);
  const [activeAddress, setActiveAddress] = useState(null);
  
  const steps = ['Delivery Address', 'Payment Method', 'Review Order'];
  
  // Mock saved addresses
  const savedAddresses = [
    {
      id: 1,
      name: 'John Doe',
      phone: '9876543210',
      line1: '123 Main Street',
      line2: 'Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      default: true
    },
    {
      id: 2,
      name: 'John Doe',
      phone: '9876543210',
      line1: '456 Park Avenue',
      line2: 'Floor 2',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      default: false
    }
  ];

  // Initialize active address
  useEffect(() => {
    if (savedAddresses.length > 0) {
      const defaultAddress = savedAddresses.find(addr => addr.default) || savedAddresses[0];
      setActiveAddress(defaultAddress);
      setFormData(prev => ({ ...prev, addressId: defaultAddress.id }));
    }
  }, []);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [cartItems, navigate, orderSuccess]);
  
  // Handle next button
  const handleNext = () => {
    if (activeStep === 0) {
      // Validate address form
      if (!formData.addressId && (!formData.name || !formData.phone || !formData.line1 || !formData.city || !formData.state || !formData.pincode)) {
        setSnackbarMessage('Please fill all required fields');
        setSnackbarOpen(true);
        return;
      }
      
      // If using new address, set it as active
      if (!formData.addressId) {
        setActiveAddress({
          name: formData.name,
          phone: formData.phone,
          line1: formData.line1,
          line2: formData.line2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        });
      }
    }
    
    if (activeStep === steps.length - 1) {
      handlePlaceOrder();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  
  // Handle back button
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // Handle donation changes
  const handleDonationChange = (amount) => {
    setDonationAmount(amount);
    setSnackbarMessage(`Added ₹${amount} donation to your order`);
    setSnackbarOpen(true);
  };
  
  // Handle placing order
  const handlePlaceOrder = () => {
    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setOrderSuccess(true);
      setOrderId(`ORD${Math.floor(100000 + Math.random() * 900000)}`);
      clearCart();
    }, 2000);
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Calculate totals
  const subtotal = getCartTotal();
  const deliveryFee = 40;
  const discount = 0; // Get from context if implemented
  const total = subtotal + deliveryFee - discount + donationAmount;
  
  // Handle success
  if (orderSuccess) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%',
            backgroundColor: 'success.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}>
            <CheckIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          
          <Typography variant="h4" gutterBottom>
            Order Placed Successfully!
          </Typography>
          
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            Your order ID is <Box component="span" fontWeight="bold">{orderId}</Box>
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            Thank you for your order. We've received your order and will begin processing it soon.
            You will receive an email confirmation shortly.
          </Typography>
          
          {donationAmount > 0 && (
            <Alert severity="success" sx={{ my: 3, maxWidth: 500, mx: 'auto', textAlign: 'left' }}>
              Thank you for your donation of ₹{donationAmount.toFixed(2)}! Your contribution will help reduce food waste and support those in need.
            </Alert>
          )}
          
          <Box sx={{ mt: 4 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/order-tracking', { state: { orderId } })}
              sx={{ mr: 2 }}
            >
              Track Order
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/cart')} 
          sx={{ mr: 2 }}
        >
          Back to Cart
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Checkout
        </Typography>
      </Box>
      
      <Box sx={{ width: '100%', mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: { xs: 3, md: 0 } }}>
            {activeStep === 0 && (
              <AddressForm 
                formData={formData} 
                setFormData={setFormData} 
                savedAddresses={savedAddresses}
                setActiveAddress={setActiveAddress}
              />
            )}
            
            {activeStep === 1 && (
              <PaymentMethod formData={formData} setFormData={setFormData} />
            )}
            
            {activeStep === 2 && (
              <OrderReview 
                activeAddress={activeAddress}
                cartItems={cartItems}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                discount={discount}
                donationAmount={donationAmount}
                total={total}
              />
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Order Summary
            </Typography>
            <List disablePadding>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary={`Items (${cartItems.length})`} />
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
              {activeStep === 2 && (
                <Box sx={{ py: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Make a Donation
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    Help us reduce food waste by donating to our food banks
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label="₹10" 
                      onClick={() => handleDonationChange(10)} 
                      color={donationAmount === 10 ? "primary" : "default"}
                      clickable
                    />
                    <Chip 
                      label="₹20" 
                      onClick={() => handleDonationChange(20)} 
                      color={donationAmount === 20 ? "primary" : "default"}
                      clickable
                    />
                    <Chip 
                      label="₹50" 
                      onClick={() => handleDonationChange(50)} 
                      color={donationAmount === 50 ? "primary" : "default"}
                      clickable
                    />
                    <Chip 
                      label="₹100" 
                      onClick={() => handleDonationChange(100)} 
                      color={donationAmount === 100 ? "primary" : "default"}
                      clickable
                    />
                    {donationAmount > 0 && (
                      <Chip 
                        label="Remove" 
                        onClick={() => handleDonationChange(0)} 
                        variant="outlined" 
                        color="error"
                        size="small"
                      />
                    )}
                  </Box>
                </Box>
              )}
              {donationAmount > 0 && (
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemText primary="Donation" />
                  <Typography variant="body1" color="primary.main">
                    ₹{donationAmount.toFixed(2)}
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
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              {activeStep > 0 && (
                <Button onClick={handleBack}>
                  Back
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                sx={{ ml: 'auto' }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : activeStep === steps.length - 1 ? (
                  'Place Order'
                ) : (
                  'Continue'
                )}
              </Button>
            </Box>
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
      
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

export default Checkout; 