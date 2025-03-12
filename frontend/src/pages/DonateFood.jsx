import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Divider
} from '@mui/material';
import { 
  LocalShipping, 
  Restaurant, 
  CheckCircle, 
  Favorite
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const DonateFood = () => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    foodType: '',
    foodName: '',
    quantity: '',
    servings: '',
    preparationDate: '',
    expiryDate: '',
    allergens: '',
    description: '',
    pickupLocation: '',
    pickupTime: '',
    donationType: 'individual',
    restaurantName: '',
    contactName: user?.name || '',
    contactPhone: user?.phone || '',
    contactEmail: user?.email || '',
    isPerishable: 'yes',
    storageInstructions: '',
    additionalNotes: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  const steps = ['Food Information', 'Donation Details', 'Contact Information', 'Review & Submit'];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateStep = () => {
    const errors = {};
    
    switch (activeStep) {
      case 0: // Food Information
        if (!formData.foodType) errors.foodType = 'Food type is required';
        if (!formData.foodName) errors.foodName = 'Food name is required';
        if (!formData.quantity) errors.quantity = 'Quantity is required';
        if (!formData.servings) errors.servings = 'Number of servings is required';
        if (!formData.preparationDate) errors.preparationDate = 'Preparation date is required';
        if (!formData.expiryDate) errors.expiryDate = 'Expiry date is required';
        
        // Check if expiry date is after preparation date
        if (formData.preparationDate && formData.expiryDate) {
          const prepDate = new Date(formData.preparationDate);
          const expDate = new Date(formData.expiryDate);
          if (expDate < prepDate) {
            errors.expiryDate = 'Expiry date must be after preparation date';
          }
        }
        break;
      
      case 1: // Donation Details
        if (!formData.pickupLocation) errors.pickupLocation = 'Pickup location is required';
        if (!formData.pickupTime) errors.pickupTime = 'Pickup time is required';
        if (formData.donationType === 'restaurant' && !formData.restaurantName) {
          errors.restaurantName = 'Restaurant name is required';
        }
        break;
      
      case 2: // Contact Information
        if (!formData.contactName) errors.contactName = 'Contact name is required';
        if (!formData.contactPhone) errors.contactPhone = 'Contact phone is required';
        if (!formData.contactEmail) errors.contactEmail = 'Contact email is required';
        if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
          errors.contactEmail = 'Email address is invalid';
        }
        break;
      
      default:
        break;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep()) {
      setActiveStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Reset form for new donation
      setFormData({
        foodType: '',
        foodName: '',
        quantity: '',
        servings: '',
        preparationDate: '',
        expiryDate: '',
        allergens: '',
        description: '',
        pickupLocation: '',
        pickupTime: '',
        donationType: 'individual',
        restaurantName: '',
        contactName: user?.name || '',
        contactPhone: user?.phone || '',
        contactEmail: user?.email || '',
        isPerishable: 'yes',
        storageInstructions: '',
        additionalNotes: ''
      });
    }, 1500);
  };
  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.foodType}>
                <InputLabel>Food Type</InputLabel>
                <Select
                  name="foodType"
                  value={formData.foodType}
                  onChange={handleChange}
                  label="Food Type"
                >
                  <MenuItem value="cooked">Cooked Food</MenuItem>
                  <MenuItem value="raw">Raw Ingredients</MenuItem>
                  <MenuItem value="packaged">Packaged Food</MenuItem>
                  <MenuItem value="baked">Baked Goods</MenuItem>
                  <MenuItem value="fruits">Fruits & Vegetables</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                {formErrors.foodType && <FormHelperText>{formErrors.foodType}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Food Name"
                name="foodName"
                value={formData.foodName}
                onChange={handleChange}
                error={!!formErrors.foodName}
                helperText={formErrors.foodName}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g., 2 kg, 3 boxes"
                error={!!formErrors.quantity}
                helperText={formErrors.quantity}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Number of Servings"
                name="servings"
                type="number"
                value={formData.servings}
                onChange={handleChange}
                error={!!formErrors.servings}
                helperText={formErrors.servings}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preparation Date"
                name="preparationDate"
                type="date"
                value={formData.preparationDate}
                onChange={handleChange}
                error={!!formErrors.preparationDate}
                helperText={formErrors.preparationDate}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleChange}
                error={!!formErrors.expiryDate}
                helperText={formErrors.expiryDate}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Allergens (if any)"
                name="allergens"
                value={formData.allergens}
                onChange={handleChange}
                placeholder="e.g., nuts, dairy, gluten"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Is the food perishable?</InputLabel>
                <Select
                  name="isPerishable"
                  value={formData.isPerishable}
                  onChange={handleChange}
                  label="Is the food perishable?"
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Storage Instructions"
                name="storageInstructions"
                value={formData.storageInstructions}
                onChange={handleChange}
                placeholder="e.g., refrigerate, keep at room temperature"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Brief description of the food, ingredients, etc."
              />
            </Grid>
          </Grid>
        );
      
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Donation Type</InputLabel>
                <Select
                  name="donationType"
                  value={formData.donationType}
                  onChange={handleChange}
                  label="Donation Type"
                >
                  <MenuItem value="individual">Individual</MenuItem>
                  <MenuItem value="restaurant">Restaurant/Business</MenuItem>
                  <MenuItem value="event">Event Surplus</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {formData.donationType === 'restaurant' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Restaurant/Business Name"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  error={!!formErrors.restaurantName}
                  helperText={formErrors.restaurantName}
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Pickup Location"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                error={!!formErrors.pickupLocation}
                helperText={formErrors.pickupLocation}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Pickup Time"
                name="pickupTime"
                type="datetime-local"
                value={formData.pickupTime}
                onChange={handleChange}
                error={!!formErrors.pickupTime}
                helperText={formErrors.pickupTime}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Notes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Any additional information about pickup, etc."
              />
            </Grid>
          </Grid>
        );
      
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Name"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                error={!!formErrors.contactName}
                helperText={formErrors.contactName}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Phone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                error={!!formErrors.contactPhone}
                helperText={formErrors.contactPhone}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Email"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                error={!!formErrors.contactEmail}
                helperText={formErrors.contactEmail}
              />
            </Grid>
          </Grid>
        );
      
      case 3:
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Please review your donation information below before submitting.
            </Alert>
            
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Food Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Food Type:</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {formData.foodType === 'cooked' && 'Cooked Food'}
                    {formData.foodType === 'raw' && 'Raw Ingredients'}
                    {formData.foodType === 'packaged' && 'Packaged Food'}
                    {formData.foodType === 'baked' && 'Baked Goods'}
                    {formData.foodType === 'fruits' && 'Fruits & Vegetables'}
                    {formData.foodType === 'other' && 'Other'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Food Name:</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formData.foodName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Quantity:</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formData.quantity}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Servings:</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formData.servings}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Preparation Date:</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formData.preparationDate}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Expiry Date:</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formData.expiryDate}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Allergens:</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formData.allergens || 'None specified'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Perishable:</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formData.isPerishable === 'yes' ? 'Yes' : 'No'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Storage Instructions:</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formData.storageInstructions || 'None specified'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Description:</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formData.description || 'None provided'}</Typography>
                </Grid>
              </Grid>
            </Paper>
            
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Donation Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Donation Type:</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {formData.donationType === 'individual' && 'Individual'}
                    {formData.donationType === 'restaurant' && 'Restaurant/Business'}
                    {formData.donationType === 'event' && 'Event Surplus'}
                  </Typography>
                </Grid>
                {formData.donationType === 'restaurant' && (
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Restaurant/Business:</Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>{formData.restaurantName}</Typography>
                  </Grid>
                )}
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Pickup Location:</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formData.pickupLocation}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Pickup Time:</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formData.pickupTime}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Additional Notes:</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formData.additionalNotes || 'None provided'}</Typography>
                </Grid>
              </Grid>
            </Paper>
            
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Contact Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Name:</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formData.contactName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Phone:</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formData.contactPhone}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Email:</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{formData.contactEmail}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        );
      
      default:
        return null;
    }
  };
  
  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" gutterBottom>Thank You for Your Donation!</Typography>
          <Typography variant="body1" paragraph>
            Your food donation has been registered successfully. Our team will be in touch shortly to coordinate the pickup.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              setActiveStep(0);
              setSuccess(false);
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
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>Donate Food</Typography>
          <Typography variant="body1" paragraph>
            Share your surplus food with those in need. Every donation helps reduce food waste and fight hunger in our community.
          </Typography>
          
          <Card sx={{ mb: 4 }}>
            <CardMedia
              component="img"
              height="240"
              image="https://source.unsplash.com/random/800x400/?food,sharing"
              alt="Food donation"
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>Why Donate Food?</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Restaurant color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">Reduce food waste and help the environment</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Favorite color="error" sx={{ mr: 1 }} />
                <Typography variant="body2">Help those facing food insecurity</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocalShipping color="secondary" sx={{ mr: 1 }} />
                <Typography variant="body2">We handle pickup and distribution</Typography>
              </Box>
            </CardContent>
          </Card>
          
          <Typography variant="h6" gutterBottom>What Food Can You Donate?</Typography>
          <Typography variant="body2" paragraph>
            • Freshly cooked meals<br />
            • Packaged foods within expiry date<br />
            • Fresh fruits and vegetables<br />
            • Bakery items<br />
            • Non-perishable items<br />
            • Restaurant surplus
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Note: All food donations must meet safety standards. We cannot accept food that has been partially consumed or expired items.
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            
            <Box>
              {renderStepContent(activeStep)}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Box>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Submit Donation'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DonateFood; 