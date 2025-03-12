import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Search,
  Visibility,
  Edit,
  Delete,
  Restaurant,
  ShoppingCart,
  People,
  AttachMoney,
  LocalDining,
  AddCircleOutline,
  FilterList,
  Refresh
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Mock data for testing
const mockOrders = [
  { _id: '1', orderNumber: 'ORD-1001', customer: 'John Doe', items: 3, totalAmount: 42.50, status: 'pending', createdAt: '2025-03-12T10:30:00Z' },
  { _id: '2', orderNumber: 'ORD-1002', customer: 'Jane Smith', items: 2, totalAmount: 27.80, status: 'completed', createdAt: '2025-03-11T14:20:00Z' },
  { _id: '3', orderNumber: 'ORD-1003', customer: 'Bob Johnson', items: 4, totalAmount: 65.20, status: 'processing', createdAt: '2025-03-10T09:15:00Z' },
  { _id: '4', orderNumber: 'ORD-1004', customer: 'Alice Brown', items: 1, totalAmount: 18.99, status: 'delivering', createdAt: '2025-03-10T16:45:00Z' },
  { _id: '5', orderNumber: 'ORD-1005', customer: 'Michael Wilson', items: 5, totalAmount: 78.30, status: 'cancelled', createdAt: '2025-03-09T11:10:00Z' }
];

const mockRestaurants = [
  { _id: '1', name: 'Pizza Palace', cuisine: 'Italian', address: '123 Main St', status: 'active', ordersCompleted: 145, rating: 4.8 },
  { _id: '2', name: 'Taco Town', cuisine: 'Mexican', address: '456 Elm St', status: 'active', ordersCompleted: 89, rating: 4.3 },
  { _id: '3', name: 'Sushi Supreme', cuisine: 'Japanese', address: '789 Oak St', status: 'inactive', ordersCompleted: 67, rating: 4.6 },
  { _id: '4', name: 'Burger Barn', cuisine: 'American', address: '101 Pine St', status: 'active', ordersCompleted: 210, rating: 4.2 },
  { _id: '5', name: 'Curry Corner', cuisine: 'Indian', address: '202 Maple St', status: 'active', ordersCompleted: 78, rating: 4.7 }
];

const mockUsers = [
  { _id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'user', orderCount: 12, createdAt: '2025-02-15T08:30:00Z' },
  { _id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'user', orderCount: 8, createdAt: '2025-02-20T14:45:00Z' },
  { _id: '3', name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'user', orderCount: 5, createdAt: '2025-03-01T10:15:00Z' },
  { _id: '4', name: 'Alice Brown', email: 'alice.brown@example.com', role: 'admin', orderCount: 0, createdAt: '2025-01-10T09:00:00Z' },
  { _id: '5', name: 'Michael Wilson', email: 'michael.wilson@example.com', role: 'restaurant', orderCount: 0, createdAt: '2025-02-01T16:20:00Z' }
];

const mockDonations = [
  { _id: '1', type: 'food', donor: 'Restaurant A', description: 'Surplus pasta meals', status: 'pending', createdAt: '2025-03-12T11:30:00Z' },
  { _id: '2', type: 'money', donor: 'John Smith', amount: 100, status: 'processed', createdAt: '2025-03-11T14:20:00Z' },
  { _id: '3', type: 'food', donor: 'Bakery B', description: 'Fresh bread and pastries', status: 'collected', createdAt: '2025-03-10T09:45:00Z' },
  { _id: '4', type: 'money', donor: 'Sarah Jones', amount: 50, status: 'processed', createdAt: '2025-03-09T16:15:00Z' },
  { _id: '5', type: 'food', donor: 'Grocery Store C', description: 'Fruits and vegetables', status: 'distributed', createdAt: '2025-03-08T13:10:00Z' }
];

// Dashboard Analytics Data
const mockAnalytics = {
  totalOrders: 538,
  totalRevenue: 12786.50,
  totalUsers: 324,
  totalRestaurants: 24,
  totalDonations: {
    food: 85,
    money: 142
  },
  ordersPerDay: [23, 18, 25, 27, 30, 28, 22],
  revenuePerDay: [546.20, 432.80, 589.40, 678.30, 720.50, 652.40, 510.90]
};

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
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
    case 'active':
      return 'success';
    case 'inactive':
      return 'error';
    case 'collected':
      return 'info';
    case 'distributed':
      return 'success';
    case 'processed':
      return 'success';
    default:
      return 'default';
  }
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState(mockOrders);
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [users, setUsers] = useState(mockUsers);
  const [donations, setDonations] = useState(mockDonations);
  const [analytics, setAnalytics] = useState(mockAnalytics);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== 'admin') {
      navigate('/');
    }

    // Fetch dashboard data
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');

      try {
        // In a real app, you would fetch data from your API
        // For now, using mock data with a timeout to simulate loading
        setTimeout(() => {
          setOrders(mockOrders);
          setRestaurants(mockRestaurants);
          setUsers(mockUsers);
          setDonations(mockDonations);
          setAnalytics(mockAnalytics);
          setLoading(false);
        }, 1000);
      } catch (error) {
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSearchTerm('');
    setFilterStatus('all');
  };

  // Search handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter handler
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  // Dialog handlers
  const handleOpenDialog = (action, item) => {
    setDialogAction(action);
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleConfirmDialog = () => {
    // Handle the action based on dialogAction and selectedItem
    if (dialogAction === 'delete') {
      // Delete logic would go here
      console.log(`Deleted item: ${selectedItem._id}`);
    }
    handleCloseDialog();
  };

  // Filter data based on search term and status
  const filterData = (data, type) => {
    let filteredData = [...data];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (type === 'orders') {
        filteredData = filteredData.filter(item => 
          item.orderNumber.toLowerCase().includes(term) || 
          item.customer.toLowerCase().includes(term)
        );
      } else if (type === 'restaurants') {
        filteredData = filteredData.filter(item => 
          item.name.toLowerCase().includes(term) || 
          item.cuisine.toLowerCase().includes(term) ||
          item.address.toLowerCase().includes(term)
        );
      } else if (type === 'users') {
        filteredData = filteredData.filter(item => 
          item.name.toLowerCase().includes(term) || 
          item.email.toLowerCase().includes(term) ||
          item.role.toLowerCase().includes(term)
        );
      } else if (type === 'donations') {
        filteredData = filteredData.filter(item => 
          item.donor.toLowerCase().includes(term) || 
          (item.description && item.description.toLowerCase().includes(term))
        );
      }
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filteredData = filteredData.filter(item => item.status.toLowerCase() === filterStatus.toLowerCase());
    }
    
    return filteredData;
  };

  // If not logged in or not admin
  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5">You must be logged in to access this page</Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/login')}
            sx={{ mt: 2 }}
          >
            Log In
          </Button>
        </Paper>
      </Container>
    );
  }

  if (user.role !== 'admin') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5">You don't have permission to access the admin dashboard</Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Back to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading dashboard data...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        <Button 
          variant="contained" 
          startIcon={<Refresh />}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      
      {/* Analytics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Orders</Typography>
                  <Typography variant="h4">{analytics.totalOrders}</Typography>
                </Box>
                <ShoppingCart color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                  <Typography variant="h4">${analytics.totalRevenue.toLocaleString()}</Typography>
                </Box>
                <AttachMoney color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Registered Users</Typography>
                  <Typography variant="h4">{analytics.totalUsers}</Typography>
                </Box>
                <People color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Restaurants</Typography>
                  <Typography variant="h4">{analytics.totalRestaurants}</Typography>
                </Box>
                <Restaurant color="secondary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Tabs for different sections */}
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" />
          <Tab label="Orders" />
          <Tab label="Restaurants" />
          <Tab label="Users" />
          <Tab label="Donations" />
        </Tabs>
        
        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>Recent Activity</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Recent Orders</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Order #</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.slice(0, 5).map((order) => (
                        <TableRow key={order._id} hover>
                          <TableCell>{order.orderNumber}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Chip
                              label={order.status}
                              color={getStatusColor(order.status)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                  <Button size="small" onClick={() => setTabValue(1)}>View All Orders</Button>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Recent Donations</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Donor</TableCell>
                        <TableCell>Details</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {donations.slice(0, 5).map((donation) => (
                        <TableRow key={donation._id} hover>
                          <TableCell>
                            {donation.type === 'food' ? 'Food' : 'Money'}
                          </TableCell>
                          <TableCell>{donation.donor}</TableCell>
                          <TableCell>
                            {donation.type === 'food' 
                              ? donation.description 
                              : `$${donation.amount}`
                            }
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={donation.status}
                              color={getStatusColor(donation.status)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                  <Button size="small" onClick={() => setTabValue(4)}>View All Donations</Button>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Donation Statistics</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary">Food Donations</Typography>
                            <Typography variant="h4">{analytics.totalDonations.food}</Typography>
                          </Box>
                          <LocalDining color="warning" sx={{ fontSize: 40 }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary">Money Donations</Typography>
                            <Typography variant="h4">{analytics.totalDonations.money}</Typography>
                          </Box>
                          <AttachMoney color="success" sx={{ fontSize: 40 }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Orders Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Manage Orders</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                placeholder="Search orders..."
                size="small"
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="delivering">Delivering</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Order #</TableCell>
                  <TableCell sx={{ color: 'white' }}>Customer</TableCell>
                  <TableCell sx={{ color: 'white' }}>Items</TableCell>
                  <TableCell sx={{ color: 'white' }}>Total</TableCell>
                  <TableCell sx={{ color: 'white' }}>Date</TableCell>
                  <TableCell sx={{ color: 'white' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterData(orders, 'orders').map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="info">
                        <Visibility />
                      </IconButton>
                      <IconButton size="small" color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleOpenDialog('delete', order)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        {/* Restaurants Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Manage Restaurants</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                placeholder="Search restaurants..."
                size="small"
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              <Button 
                variant="contained" 
                startIcon={<AddCircleOutline />}
              >
                Add Restaurant
              </Button>
            </Box>
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white' }}>Cuisine</TableCell>
                  <TableCell sx={{ color: 'white' }}>Address</TableCell>
                  <TableCell sx={{ color: 'white' }}>Orders</TableCell>
                  <TableCell sx={{ color: 'white' }}>Rating</TableCell>
                  <TableCell sx={{ color: 'white' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterData(restaurants, 'restaurants').map((restaurant) => (
                  <TableRow key={restaurant._id} hover>
                    <TableCell>{restaurant.name}</TableCell>
                    <TableCell>{restaurant.cuisine}</TableCell>
                    <TableCell>{restaurant.address}</TableCell>
                    <TableCell>{restaurant.ordersCompleted}</TableCell>
                    <TableCell>{restaurant.rating}</TableCell>
                    <TableCell>
                      <Chip
                        label={restaurant.status}
                        color={getStatusColor(restaurant.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="info">
                        <Visibility />
                      </IconButton>
                      <IconButton size="small" color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleOpenDialog('delete', restaurant)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        {/* Users Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Manage Users</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                placeholder="Search users..."
                size="small"
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={filterStatus}
                  label="Role"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="user">Users</MenuItem>
                  <MenuItem value="admin">Admins</MenuItem>
                  <MenuItem value="restaurant">Restaurants</MenuItem>
                </Select>
              </FormControl>
              <Button 
                variant="contained" 
                startIcon={<AddCircleOutline />}
              >
                Add User
              </Button>
            </Box>
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white' }}>Email</TableCell>
                  <TableCell sx={{ color: 'white' }}>Role</TableCell>
                  <TableCell sx={{ color: 'white' }}>Orders</TableCell>
                  <TableCell sx={{ color: 'white' }}>Joined</TableCell>
                  <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterData(users, 'users').map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        color={user.role === 'admin' ? 'secondary' : (user.role === 'restaurant' ? 'info' : 'default')}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{user.orderCount}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <IconButton size="small" color="info">
                        <Visibility />
                      </IconButton>
                      <IconButton size="small" color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleOpenDialog('delete', user)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        {/* Donations Tab */}
        <TabPanel value={tabValue} index={4}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Manage Donations</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                placeholder="Search donations..."
                size="small"
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filterStatus}
                  label="Type"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="processed">Processed</MenuItem>
                  <MenuItem value="collected">Collected</MenuItem>
                  <MenuItem value="distributed">Distributed</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Type</TableCell>
                  <TableCell sx={{ color: 'white' }}>Donor</TableCell>
                  <TableCell sx={{ color: 'white' }}>Description</TableCell>
                  <TableCell sx={{ color: 'white' }}>Date</TableCell>
                  <TableCell sx={{ color: 'white' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterData(donations, 'donations').map((donation) => (
                  <TableRow key={donation._id} hover>
                    <TableCell>
                      <Chip 
                        label={donation.type === 'food' ? 'Food' : 'Money'} 
                        color={donation.type === 'food' ? 'warning' : 'success'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{donation.donor}</TableCell>
                    <TableCell>
                      {donation.type === 'food' 
                        ? donation.description 
                        : donation.amount ? `$${donation.amount}` : ''
                      }
                    </TableCell>
                    <TableCell>{formatDate(donation.createdAt)}</TableCell>
                    <TableCell>
                      <Chip
                        label={donation.status}
                        color={getStatusColor(donation.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="info">
                        <Visibility />
                      </IconButton>
                      <IconButton size="small" color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleOpenDialog('delete', donation)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogAction === 'delete' && 
              `Are you sure you want to delete this item? This action cannot be undone.`
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDialog} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 