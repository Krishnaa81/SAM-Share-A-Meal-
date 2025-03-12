import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Switch,
  FormControlLabel,
  LinearProgress,
} from '@mui/material';
import {
  Kitchen,
  RestaurantMenu,
  LocalShipping,
  Assessment,
  Add,
  Edit,
  Delete,
  Store,
  Schedule,
  LocationOn,
  MonetizationOn,
  Inventory,
  Group,
  Restaurant,
  Category,
  AttachMoney,
  LocalOffer,
} from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cloud-kitchen-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CloudKitchen() {
  const [tabValue, setTabValue] = useState(0);
  const [openKitchenDialog, setOpenKitchenDialog] = useState(false);
  const [kitchenForm, setKitchenForm] = useState({
    name: '',
    location: '',
    cuisine: '',
    capacity: '',
    operatingHours: '',
    equipmentNeeds: '',
  });
  const [openMenuDialog, setOpenMenuDialog] = useState(false);
  const [menuForm, setMenuForm] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    isVegetarian: false,
    preparationTime: '',
    ingredients: '',
  });

  // Mock data
  const kitchens = [
    {
      id: 1,
      name: 'Spice Hub',
      location: 'East City',
      cuisine: 'Indian',
      status: 'Active',
      utilization: '85%',
      revenue: '₹45,000',
    },
    {
      id: 2,
      name: 'Wok & Roll',
      location: 'West End',
      cuisine: 'Chinese',
      status: 'Active',
      utilization: '75%',
      revenue: '₹38,000',
    },
  ];

  const inventory = [
    {
      id: 1,
      item: 'Rice',
      quantity: '50 kg',
      status: 'Sufficient',
      lastUpdated: '2024-03-15',
    },
    {
      id: 2,
      item: 'Cooking Oil',
      quantity: '20 L',
      status: 'Low',
      lastUpdated: '2024-03-14',
    },
  ];

  const analytics = {
    totalRevenue: '₹83,000',
    ordersProcessed: 450,
    activeKitchens: 2,
    avgUtilization: '80%',
  };

  const staff = [
    {
      id: 1,
      name: 'John Smith',
      role: 'Head Chef',
      shift: 'Morning',
      status: 'On Duty',
    },
    {
      id: 2,
      name: 'Maria Garcia',
      role: 'Sous Chef',
      shift: 'Evening',
      status: 'Off Duty',
    },
  ];

  // Mock menu data
  const menuItems = [
    {
      id: 1,
      name: 'Butter Chicken',
      category: 'Main Course',
      price: '₹350',
      isVegetarian: false,
      preparationTime: '25 mins',
      status: 'Available',
    },
    {
      id: 2,
      name: 'Paneer Tikka',
      category: 'Starters',
      price: '₹250',
      isVegetarian: true,
      preparationTime: '20 mins',
      status: 'Available',
    },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleKitchenSubmit = () => {
    console.log('New kitchen:', kitchenForm);
    setOpenKitchenDialog(false);
    setKitchenForm({
      name: '',
      location: '',
      cuisine: '',
      capacity: '',
      operatingHours: '',
      equipmentNeeds: '',
    });
  };

  const handleMenuSubmit = () => {
    console.log('New menu item:', menuForm);
    setOpenMenuDialog(false);
    setMenuForm({
      name: '',
      category: '',
      price: '',
      description: '',
      isVegetarian: false,
      preparationTime: '',
      ingredients: '',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1">
        Cloud Kitchen Management
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4">
                {analytics.totalRevenue}
              </Typography>
              <LinearProgress variant="determinate" value={75} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Orders Processed
              </Typography>
              <Typography variant="h4">
                {analytics.ordersProcessed}
              </Typography>
              <LinearProgress variant="determinate" value={85} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Kitchens
              </Typography>
              <Typography variant="h4">
                {analytics.activeKitchens}
              </Typography>
              <LinearProgress variant="determinate" value={60} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg. Utilization
              </Typography>
              <Typography variant="h4">
                {analytics.avgUtilization}
              </Typography>
              <LinearProgress variant="determinate" value={80} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<Kitchen />} label="Kitchens" />
          <Tab icon={<RestaurantMenu />} label="Menu" />
          <Tab icon={<Inventory />} label="Inventory" />
          <Tab icon={<Group />} label="Staff" />
          <Tab icon={<Assessment />} label="Analytics" />
        </Tabs>

        {/* Kitchens Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Active Kitchens</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenKitchenDialog(true)}
            >
              Add Kitchen
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Cuisine</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Utilization</TableCell>
                  <TableCell>Revenue</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {kitchens.map((kitchen) => (
                  <TableRow key={kitchen.id}>
                    <TableCell>{kitchen.name}</TableCell>
                    <TableCell>{kitchen.location}</TableCell>
                    <TableCell>{kitchen.cuisine}</TableCell>
                    <TableCell>
                      <Chip
                        label={kitchen.status}
                        color="success"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{kitchen.utilization}</TableCell>
                    <TableCell>{kitchen.revenue}</TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Menu Management Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Menu Items</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenMenuDialog(true)}
            >
              Add Menu Item
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Prep Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menuItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Chip
                        icon={<Category fontSize="small" />}
                        label={item.category}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.isVegetarian ? 'Veg' : 'Non-Veg'}
                        color={item.isVegetarian ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{item.preparationTime}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Inventory Tab */}
        <TabPanel value={tabValue} index={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.item}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        color={item.status === 'Sufficient' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{item.lastUpdated}</TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined">
                        Update Stock
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Staff Tab */}
        <TabPanel value={tabValue} index={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Shift</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.shift}</TableCell>
                    <TableCell>
                      <Chip
                        label={member.status}
                        color={member.status === 'On Duty' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined">
                        Manage Schedule
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Revenue Breakdown
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <MonetizationOn />
                      </ListItemIcon>
                      <ListItemText
                        primary="Daily Average"
                        secondary="₹12,000"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Store />
                      </ListItemIcon>
                      <ListItemText
                        primary="Per Kitchen Average"
                        secondary="₹41,500"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Operational Metrics
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Order Fulfillment Rate"
                        secondary="98%"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Average Preparation Time"
                        secondary="28 minutes"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Customer Satisfaction"
                        secondary="4.5/5"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Add Kitchen Dialog */}
      <Dialog open={openKitchenDialog} onClose={() => setOpenKitchenDialog(false)}>
        <DialogTitle>Add New Kitchen</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Kitchen Name"
                value={kitchenForm.name}
                onChange={(e) => setKitchenForm({ ...kitchenForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={kitchenForm.location}
                onChange={(e) => setKitchenForm({ ...kitchenForm, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Cuisine Type</InputLabel>
                <Select
                  value={kitchenForm.cuisine}
                  onChange={(e) => setKitchenForm({ ...kitchenForm, cuisine: e.target.value })}
                >
                  <MenuItem value="Indian">Indian</MenuItem>
                  <MenuItem value="Chinese">Chinese</MenuItem>
                  <MenuItem value="Italian">Italian</MenuItem>
                  <MenuItem value="Mexican">Mexican</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Capacity (orders/day)"
                type="number"
                value={kitchenForm.capacity}
                onChange={(e) => setKitchenForm({ ...kitchenForm, capacity: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Operating Hours"
                value={kitchenForm.operatingHours}
                onChange={(e) => setKitchenForm({ ...kitchenForm, operatingHours: e.target.value })}
                placeholder="e.g., 9 AM - 10 PM"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Equipment Needs"
                multiline
                rows={3}
                value={kitchenForm.equipmentNeeds}
                onChange={(e) => setKitchenForm({ ...kitchenForm, equipmentNeeds: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenKitchenDialog(false)}>Cancel</Button>
          <Button onClick={handleKitchenSubmit} variant="contained" color="primary">
            Add Kitchen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Menu Item Dialog */}
      <Dialog open={openMenuDialog} onClose={() => setOpenMenuDialog(false)}>
        <DialogTitle>Add Menu Item</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Item Name"
                value={menuForm.name}
                onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={menuForm.category}
                  onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                >
                  <MenuItem value="Starters">Starters</MenuItem>
                  <MenuItem value="Main Course">Main Course</MenuItem>
                  <MenuItem value="Desserts">Desserts</MenuItem>
                  <MenuItem value="Beverages">Beverages</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={menuForm.price}
                onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                InputProps={{
                  startAdornment: <AttachMoney />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preparation Time (mins)"
                type="number"
                value={menuForm.preparationTime}
                onChange={(e) => setMenuForm({ ...menuForm, preparationTime: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={menuForm.description}
                onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ingredients"
                multiline
                rows={2}
                value={menuForm.ingredients}
                onChange={(e) => setMenuForm({ ...menuForm, ingredients: e.target.value })}
                placeholder="Enter ingredients separated by commas"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={menuForm.isVegetarian}
                    onChange={(e) => setMenuForm({ ...menuForm, isVegetarian: e.target.checked })}
                  />
                }
                label="Vegetarian"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMenuDialog(false)}>Cancel</Button>
          <Button onClick={handleMenuSubmit} variant="contained" color="primary">
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 