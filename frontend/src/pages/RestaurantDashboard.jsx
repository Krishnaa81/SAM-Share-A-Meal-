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
  IconButton,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material';
import {
  Restaurant,
  FastFood,
  LocalShipping,
  Assessment,
  Edit,
  Delete,
  Add,
  Notifications,
  MonetizationOn,
  Star,
} from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`restaurant-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function RestaurantDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [openMenuDialog, setOpenMenuDialog] = useState(false);
  const [menuItem, setMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isVegetarian: false,
  });

  // Mock data
  const orders = [
    { id: 1, customer: 'John Doe', items: ['Butter Chicken', 'Naan'], total: '₹450', status: 'Preparing' },
    { id: 2, customer: 'Jane Smith', items: ['Paneer Tikka', 'Roti'], total: '₹350', status: 'Ready' },
  ];

  const menuItems = [
    { id: 1, name: 'Butter Chicken', price: '₹300', category: 'Main Course', isVegetarian: false },
    { id: 2, name: 'Paneer Tikka', price: '₹250', category: 'Starters', isVegetarian: true },
  ];

  const analytics = {
    totalOrders: 150,
    revenue: '₹45,000',
    rating: 4.5,
    popularItems: ['Butter Chicken', 'Paneer Tikka'],
  };

  const subscriptionDetails = {
    plan: 'Premium',
    commission: '10%',
    features: ['Priority Listing', 'Analytics Dashboard', '24/7 Support'],
    validUntil: '2024-12-31',
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuItemSubmit = () => {
    console.log('New menu item:', menuItem);
    setOpenMenuDialog(false);
    setMenuItem({
      name: '',
      description: '',
      price: '',
      category: '',
      isVegetarian: false,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
        <Grid item xs>
          <Typography variant="h4" component="h1" gutterBottom>
            Restaurant Dashboard
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Notifications />}
          >
            New Orders (2)
          </Button>
        </Grid>
      </Grid>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Today's Orders
              </Typography>
              <Typography variant="h4">
                {analytics.totalOrders}
              </Typography>
              <LinearProgress variant="determinate" value={75} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Revenue
              </Typography>
              <Typography variant="h4">
                {analytics.revenue}
              </Typography>
              <LinearProgress variant="determinate" value={65} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Rating
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ mr: 1 }}>
                  {analytics.rating}
                </Typography>
                <Star color="warning" />
              </Box>
              <LinearProgress variant="determinate" value={90} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Commission Rate
              </Typography>
              <Typography variant="h4">
                {subscriptionDetails.commission}
              </Typography>
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                Premium Plan Active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<FastFood />} label="Menu Management" />
          <Tab icon={<LocalShipping />} label="Orders" />
          <Tab icon={<Assessment />} label="Analytics" />
          <Tab icon={<MonetizationOn />} label="Subscription" />
        </Tabs>

        {/* Menu Management Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Menu Items</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenMenuDialog(true)}
            >
              Add Item
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
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menuItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.isVegetarian ? 'Veg' : 'Non-Veg'}
                        color={item.isVegetarian ? 'success' : 'error'}
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

        {/* Orders Tab */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.items.join(', ')}</TableCell>
                    <TableCell>{order.total}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={order.status === 'Ready' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined">
                        Update Status
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Popular Items
                  </Typography>
                  <List>
                    {analytics.popularItems.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={item}
                          secondary={`${Math.floor(Math.random() * 50 + 50)} orders this week`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance Metrics
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Average Order Value"
                        secondary="₹350"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Order Completion Rate"
                        secondary="95%"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Average Preparation Time"
                        secondary="25 minutes"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Subscription Tab */}
        <TabPanel value={tabValue} index={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Plan: {subscriptionDetails.plan}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Valid until: {subscriptionDetails.validUntil}
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Features Included:
                </Typography>
                <List>
                  {subscriptionDetails.features.map((feature, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Button variant="contained" color="primary">
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>
        </TabPanel>
      </Paper>

      {/* Add Menu Item Dialog */}
      <Dialog open={openMenuDialog} onClose={() => setOpenMenuDialog(false)}>
        <DialogTitle>Add Menu Item</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Item Name"
                value={menuItem.name}
                onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={menuItem.description}
                onChange={(e) => setMenuItem({ ...menuItem, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={menuItem.price}
                onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                value={menuItem.category}
                onChange={(e) => setMenuItem({ ...menuItem, category: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={menuItem.isVegetarian}
                    onChange={(e) => setMenuItem({ ...menuItem, isVegetarian: e.target.checked })}
                  />
                }
                label="Vegetarian"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMenuDialog(false)}>Cancel</Button>
          <Button onClick={handleMenuItemSubmit} variant="contained" color="primary">
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 