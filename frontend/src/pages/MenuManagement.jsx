import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Mock data for food items
const initialFoodItems = [
  {
    id: 1,
    name: 'Butter Chicken',
    price: 350,
    description: 'Tender chicken in a rich butter sauce',
    image: '/images/food/butter-chicken.jpg',
    category: 'Main Course',
    isVegetarian: false,
  },
  {
    id: 2,
    name: 'Paneer Tikka',
    price: 250,
    description: 'Marinated cottage cheese cubes grilled to perfection',
    image: '/images/food/paneer-tikka.jpg',
    category: 'Starters',
    isVegetarian: true,
  },
];

// Food categories
const foodCategories = [
  'Appetizer',
  'Main Course',
  'Dessert',
  'Beverage',
  'Side Dish',
  'Breakfast',
];

export default function MenuManagement() {
  const { user } = useAuth();
  const [foodItems, setFoodItems] = useState(initialFoodItems);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    isVegetarian: false,
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenDialog = (item = null) => {
    if (item) {
      setCurrentItem(item);
      setIsEditing(true);
    } else {
      setCurrentItem({
        name: '',
        price: '',
        description: '',
        image: '',
        category: '',
        isVegetarian: false,
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSaveItem = () => {
    if (isEditing) {
      // Update existing item
      setFoodItems(
        foodItems.map((item) =>
          item.id === currentItem.id ? currentItem : item
        )
      );
    } else {
      // Add new item
      const newItem = {
        ...currentItem,
        id: foodItems.length > 0 ? Math.max(...foodItems.map((i) => i.id)) + 1 : 1,
      };
      setFoodItems([...foodItems, newItem]);
    }
    handleCloseDialog();
  };

  const handleDeleteItem = (id) => {
    setFoodItems(foodItems.filter((item) => item.id !== id));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Menu Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your restaurant's menu items
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Item
        </Button>
      </Box>

      {foodItems.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No menu items added yet. Click "Add New Item" to get started.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {foodItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={item.image}
                  alt={item.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="h2">
                      {item.name}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ₹{item.price}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.category} • {item.isVegetarian ? 'Veg' : 'Non-Veg'}
                    </Typography>
                    <Box>
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => handleOpenDialog(item)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Item Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Item Name"
                fullWidth
                value={currentItem.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Price (₹)"
                type="number"
                fullWidth
                value={currentItem.price}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={currentItem.category}
                  label="Category"
                  onChange={handleInputChange}
                >
                  {foodCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                multiline
                rows={2}
                fullWidth
                value={currentItem.description}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="image"
                label="Image URL"
                fullWidth
                value={currentItem.image}
                onChange={handleInputChange}
                helperText="Enter a URL for the food image"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Food Type</InputLabel>
                <Select
                  name="isVegetarian"
                  value={currentItem.isVegetarian}
                  label="Food Type"
                  onChange={handleInputChange}
                >
                  <MenuItem value={true}>Vegetarian</MenuItem>
                  <MenuItem value={false}>Non-Vegetarian</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveItem} 
            variant="contained" 
            color="primary"
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 