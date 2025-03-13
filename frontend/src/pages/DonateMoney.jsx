import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  FormHelperText,
  InputAdornment,
  Divider,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Alert,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  CreditCard,
  AccountBalance,
  AttachMoney,
  CheckCircle,
  Favorite,
  FavoriteBorder,
  LocalDining,
  People,
  Home
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const DonateMoney = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('oneTime');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [bankName, setBankName] = useState('');
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleAmountChange = (value) => {
    setAmount(value);
    setErrors((prev) => ({ ...prev, amount: '' }));
    if (value === 'custom') {
      setCustomAmount('');
    }
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setCustomAmount(value);
      if (parseFloat(value) > 0) {
        setErrors((prev) => ({ ...prev, amount: '' }));
      }
    }
  };

  const handleDonationTypeChange = (e) => {
    setDonationType(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    // Clear previous payment errors when switching methods
    setErrors((prev) => ({
      ...prev,
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: '',
      accountNumber: '',
      routingNumber: '',
      bankName: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate amount
    const donationAmount = amount === 'custom' ? customAmount : amount;
    if (!donationAmount) {
      newErrors.amount = 'Please select or enter a donation amount';
    } else if (amount === 'custom' && (!customAmount || parseFloat(customAmount) <= 0)) {
      newErrors.amount = 'Please enter a valid donation amount';
    }
    
    // Validate contact information
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    // Validate payment information based on method
    if (paymentMethod === 'card') {
      if (!cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{13,19}$/.test(cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }
      
      if (!expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        newErrors.expiryDate = 'Please use MM/YY format';
      }
      
      if (!cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(cvv)) {
        newErrors.cvv = 'CVV must be 3 or 4 digits';
      }
      
      if (!nameOnCard.trim()) {
        newErrors.nameOnCard = 'Name on card is required';
      }
    } else if (paymentMethod === 'bank') {
      if (!accountNumber.trim()) {
        newErrors.accountNumber = 'Account number is required';
      }
      
      if (!routingNumber.trim()) {
        newErrors.routingNumber = 'Routing number is required';
      } else if (!/^\d{9}$/.test(routingNumber)) {
        newErrors.routingNumber = 'Routing number must be 9 digits';
      }
      
      if (!bankName.trim()) {
        newErrors.bankName = 'Bank name is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      setError('');
      
      // Simulate API call to process donation
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
      }, 1500);
    }
  };

  const predefinedAmounts = [
    { value: '10', label: '₹10' },
    { value: '25', label: '₹25' },
    { value: '50', label: '₹50' },
    { value: '100', label: '₹100' },
    { value: '500', label: '₹500' },
    { value: 'custom', label: 'Custom' }
  ];

  const impactExamples = [
    { amount: '₹10', description: 'Provides a meal for a family of four' },
    { amount: '₹25', description: 'Helps feed 10 children for a day' },
    { amount: '₹50', description: 'Supports a community kitchen for a meal service' },
    { amount: '₹100', description: 'Provides emergency food assistance for a week' },
    { amount: '₹500', description: 'Funds a neighborhood food distribution event' }
  ];

  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" gutterBottom>Thank You for Your Donation!</Typography>
          <Typography variant="body1" paragraph>
            Your donation of {amount === 'custom' ? `₹${customAmount}` : `₹${amount}`} has been processed successfully.
            Your generosity will help provide meals to those in need.
          </Typography>
          <Typography variant="body1" paragraph>
            A confirmation has been sent to your email address.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              setSuccess(false);
              setAmount('');
              setCustomAmount('');
            }}
            sx={{ mt: 2 }}
          >
            Make Another Donation
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Typography variant="h4" gutterBottom>Support Our Mission</Typography>
          <Typography variant="body1" paragraph>
            Your donation helps us provide nutritious meals to individuals and families facing hunger in our community.
            Every contribution makes a difference in reducing food insecurity.
          </Typography>
          
          <Card sx={{ mb: 4 }}>
            <CardMedia
              component="img"
              height="200"
              image="/images/donations/charity-donation.jpg"
              alt="Donation impact"
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>How Your Donation Helps</Typography>
              <List>
                {impactExamples.map((impact, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: '40px' }}>
                      <LocalDining color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`${impact.amount}: ${impact.description}`} 
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>Our Impact</Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Card sx={{ flex: 1, p: 2, textAlign: 'center' }}>
                <People color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h5" fontWeight="bold">10,000+</Typography>
                <Typography variant="body2">People Served</Typography>
              </Card>
              <Card sx={{ flex: 1, p: 2, textAlign: 'center' }}>
                <LocalDining color="secondary" sx={{ fontSize: 40 }} />
                <Typography variant="h5" fontWeight="bold">50,000+</Typography>
                <Typography variant="body2">Meals Distributed</Typography>
              </Card>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Card sx={{ flex: 1, p: 2, textAlign: 'center' }}>
                <Home color="error" sx={{ fontSize: 40 }} />
                <Typography variant="h5" fontWeight="bold">50+</Typography>
                <Typography variant="body2">Communities</Typography>
              </Card>
              <Card sx={{ flex: 1, p: 2, textAlign: 'center' }}>
                <Favorite color="success" sx={{ fontSize: 40 }} />
                <Typography variant="h5" fontWeight="bold">500+</Typography>
                <Typography variant="body2">Regular Donors</Typography>
              </Card>
            </Stack>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            Share-A-Meal is a registered 501(c)(3) nonprofit organization. Your donation is tax-deductible to the extent allowed by law.
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            
            <Typography variant="h5" gutterBottom>Make a Donation</Typography>
            
            <Box sx={{ mb: 4 }}>
              <FormControl component="fieldset" fullWidth error={!!errors.amount}>
                <FormLabel component="legend">Select Donation Amount</FormLabel>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {predefinedAmounts.map((option) => (
                    <Grid item xs={4} key={option.value}>
                      <Button
                        variant={amount === option.value ? "contained" : "outlined"}
                        color="primary"
                        fullWidth
                        onClick={() => handleAmountChange(option.value)}
                        startIcon={option.value !== 'custom' ? <AttachMoney /> : null}
                      >
                        {option.label}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
                
                {amount === 'custom' && (
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Enter amount"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    error={!!errors.amount && amount === 'custom'}
                  />
                )}
                
                {errors.amount && <FormHelperText>{errors.amount}</FormHelperText>}
              </FormControl>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Donation Frequency</FormLabel>
                <RadioGroup
                  row
                  name="donationType"
                  value={donationType}
                  onChange={handleDonationTypeChange}
                >
                  <FormControlLabel value="oneTime" control={<Radio />} label="One-time" />
                  <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
                  <FormControlLabel value="quarterly" control={<Radio />} label="Quarterly" />
                  <FormControlLabel value="annual" control={<Radio />} label="Annual" />
                </RadioGroup>
              </FormControl>
            </Box>
            
            <Divider sx={{ mb: 4 }} />
            
            <Typography variant="h6" gutterBottom>Your Information</Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setErrors({...errors, fullName: ''});
                  }}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({...errors, email: ''});
                  }}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErrors({...errors, phone: ''});
                  }}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  required
                />
              </Grid>
            </Grid>
            
            <Divider sx={{ mb: 4 }} />
            
            <Typography variant="h6" gutterBottom>Payment Method</Typography>
            <Box sx={{ mb: 2 }}>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={handlePaymentMethodChange}
                >
                  <FormControlLabel 
                    value="card" 
                    control={<Radio />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CreditCard sx={{ mr: 1 }} />
                        <span>Credit/Debit Card</span>
                      </Box>
                    } 
                  />
                  <FormControlLabel 
                    value="bank" 
                    control={<Radio />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccountBalance sx={{ mr: 1 }} />
                        <span>Bank Account</span>
                      </Box>
                    } 
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            
            {paymentMethod === 'card' ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    value={cardNumber}
                    onChange={(e) => {
                      setCardNumber(e.target.value);
                      setErrors({...errors, cardNumber: ''});
                    }}
                    error={!!errors.cardNumber}
                    helperText={errors.cardNumber}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date (MM/YY)"
                    value={expiryDate}
                    onChange={(e) => {
                      setExpiryDate(e.target.value);
                      setErrors({...errors, expiryDate: ''});
                    }}
                    error={!!errors.expiryDate}
                    helperText={errors.expiryDate}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CVV"
                    value={cvv}
                    onChange={(e) => {
                      setCvv(e.target.value);
                      setErrors({...errors, cvv: ''});
                    }}
                    error={!!errors.cvv}
                    helperText={errors.cvv}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name on Card"
                    value={nameOnCard}
                    onChange={(e) => {
                      setNameOnCard(e.target.value);
                      setErrors({...errors, nameOnCard: ''});
                    }}
                    error={!!errors.nameOnCard}
                    helperText={errors.nameOnCard}
                    required
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bank Name"
                    value={bankName}
                    onChange={(e) => {
                      setBankName(e.target.value);
                      setErrors({...errors, bankName: ''});
                    }}
                    error={!!errors.bankName}
                    helperText={errors.bankName}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Account Number"
                    value={accountNumber}
                    onChange={(e) => {
                      setAccountNumber(e.target.value);
                      setErrors({...errors, accountNumber: ''});
                    }}
                    error={!!errors.accountNumber}
                    helperText={errors.accountNumber}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Routing Number"
                    value={routingNumber}
                    onChange={(e) => {
                      setRoutingNumber(e.target.value);
                      setErrors({...errors, routingNumber: ''});
                    }}
                    error={!!errors.routingNumber}
                    helperText={errors.routingNumber}
                    required
                  />
                </Grid>
              </Grid>
            )}
            
            <Box sx={{ mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <FavoriteBorder />}
              >
                {loading ? 'Processing...' : `Donate ${amount === 'custom' ? (customAmount ? `₹${customAmount}` : '') : `₹${amount}`}`}
              </Button>
            </Box>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Your payment information is securely processed and encrypted.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DonateMoney; 