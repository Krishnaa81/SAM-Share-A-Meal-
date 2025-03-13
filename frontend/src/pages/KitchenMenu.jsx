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
  Tab,
  Tabs,
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  FilterList as FilterListIcon,
  CloudUpload as CloudUploadIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Mock data for food items
const initialFoodItems = [
  {
    id: 1,
    name: 'Teriyaki Chicken Bowl',
    description: 'Grilled chicken with teriyaki sauce on a bed of rice with vegetables',
    price: 320,
    image: '/images/food/teriyaki-bowl.jpg',
    category: 'Main Course',
    isVegetarian: false,
    isSpecial: true,
    inStock: true,
  },
  {
    id: 2,
    name: 'Buddha Bowl',
    description: 'Nutritious bowl with quinoa, avocado, sweet potato, chickpeas and tahini dressing',
    price: 280,
    image: '/images/food/buddha-bowl.jpg',
    category: 'Main Course',
    isVegetarian: true,
    isSpecial: false,
    inStock: true,
  },
  {
    id: 3,
    name: 'Poke Bowl',
    description: 'Fresh raw fish, rice, avocado, edamame, cucumber and sriracha mayo',
    price: 350,
    image: '/images/food/poke-bowl.jpg',
    category: 'Main Course',
    isVegetarian: false,
    isSpecial: false,
    inStock: true,
  },
  {
    id: 4,
    name: 'Burrito Bowl',
    description: 'Mexican inspired bowl with rice, beans, corn, avocado, salsa and lime',
    price: 290,
    image: '/images/food/burrito-bowl.jpg',
    category: 'Main Course',
    isVegetarian: true,
    isSpecial: false,
    inStock: true,
  },
  {
    id: 5,
    name: 'Smoothie Bowl',
    description: 'Thick smoothie topped with fresh fruits, granola and chia seeds',
    price: 220,
    image: '/images/food/smoothie-bowl.jpg',
    category: 'Dessert',
    isVegetarian: true,
    isSpecial: true,
    inStock: true,
  },
  {
    id: 6,
    name: 'Protein Box',
    description: 'High protein meal with grilled chicken, boiled eggs, nuts and cheese',
    price: 310,
    image: '/images/food/protein-box.jpg',
    category: 'Main Course',
    isVegetarian: false,
    isSpecial: false,
    inStock: false,
  },
];

// Food categories
const foodCategories = [
  'Main Course',
  'Appetizer',
  'Dessert',
  'Beverage',
  'Side Dish',
  'Breakfast',
];

export default function KitchenMenu() {
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
    isSpecial: false,
    inStock: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [filterVeg, setFilterVeg] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
        isSpecial: false,
        inStock: true,
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

  const handleToggleStock = (id) => {
    setFoodItems(
      foodItems.map((item) =>
        item.id === id ? { ...item, inStock: !item.inStock } : item
      )
    );
  };

  // Filter items based on tab and veg filter
  const getFilteredItems = () => {
    return foodItems.filter((item) => {
      // Filter by tab (0 = All, 1 = Specials, 2 = Available, 3 = Out of Stock)
      const matchesTab =
        (tabValue === 0) ||
        (tabValue === 1 && item.isSpecial) ||
        (tabValue === 2 && item.inStock) ||
        (tabValue === 3 && !item.inStock);
      
      // Filter by vegetarian if filter is on
      const matchesVegFilter = !filterVeg || item.isVegetarian;
      
      return matchesTab && matchesVegFilter;
    });
  };

  const filteredItems = getFilteredItems();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Cloud Kitchen Menu
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your cloud kitchen's menu items
        </Typography>
      </Box>

      {/* Tabs and Filters */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Grid container alignItems="center">
          <Grid item xs={12} md={8}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="All Items" />
              <Tab label="Special Items" />
              <Tab label="Available" />
              <Tab label="Out of Stock" />
            </Tabs>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={filterVeg} 
                  onChange={(e) => setFilterVeg(e.target.checked)} 
                  color="primary"
                />
              }
              label="Vegetarian Only"
            />
          </Grid>
        </Grid>
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

      {filteredItems.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No menu items match your current filters.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  opacity: item.inStock ? 1 : 0.7,
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={item.image}
                    alt={item.name}
                  />
                  {item.isSpecial && (
                    <Chip
                      label="Special"
                      color="secondary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        fontWeight: 'bold',
                      }}
                    />
                  )}
                  {!item.inStock && (
                    <Chip
                      label="Out of Stock"
                      color="error"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        fontWeight: 'bold',
                      }}
                    />
                  )}
                </Box>
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
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        label={item.category} 
                        size="small" 
                        variant="outlined" 
                        color="primary" 
                      />
                      <Chip 
                        label={item.isVegetarian ? 'Veg' : 'Non-Veg'}
                        size="small"
                        variant="outlined"
                        color={item.isVegetarian ? 'success' : 'default'}
                      />
                    </Box>
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
                        color={item.inStock ? 'error' : 'success'}
                        onClick={() => handleToggleStock(item.id)}
                      >
                        {item.inStock ? <CloseIcon /> : <CheckIcon />}
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
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentItem.isVegetarian}
                    onChange={handleInputChange}
                    name="isVegetarian"
                    color="success"
                  />
                }
                label="Vegetarian"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentItem.isSpecial}
                    onChange={handleInputChange}
                    name="isSpecial"
                    color="secondary"
                  />
                }
                label="Special Item"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentItem.inStock}
                    onChange={handleInputChange}
                    name="inStock"
                    color="primary"
                  />
                }
                label="In Stock"
              />
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