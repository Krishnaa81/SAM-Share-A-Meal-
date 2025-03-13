import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid, 
  Chip, 
  CircularProgress, 
  Alert, 
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Pagination,
  Snackbar
} from '@mui/material';
import { 
  ArrowForward, 
  AccessTime, 
  CheckCircle, 
  LocalShipping, 
  ErrorOutline,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

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

// Mock orders data for testing and fallback
const MOCK_ORDERS = [
  {
    _id: 'ord123456789',
    orderNumber: 'ORD-12345',
    createdAt: new Date().toISOString(),
    status: 'delivering',
    totalAmount: 550,
    items: [
      { name: 'Butter Chicken', quantity: 1, price: 340 },
      { name: 'Naan', quantity: 2, price: 40 },
      { name: 'Jeera Rice', quantity: 1, price: 120 }
    ],
    restaurant: {
      name: 'Spice Junction',
      image: '/images/restaurants/spice-junction.jpg'
    },
    deliveryAddress: {
      street: '123 Main Street',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500001'
    }
  },
  {
    _id: 'ord987654321',
    orderNumber: 'ORD-54321',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: 'completed',
    totalAmount: 420,
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 300 },
      { name: 'Coke', quantity: 2, price: 60 }
    ],
    restaurant: {
      name: 'Pizza Paradise',
      image: '/images/restaurants/pasta-paradise.jpg'
    },
    deliveryAddress: {
      street: '456 Park Avenue',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500001'
    }
  }
];

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');

      // Get the localStorage key - use user ID if available, otherwise use 'guest'
      const storageKey = `user_${user?.id || 'guest'}_orders`;
      
      try {
        // First check if we have saved orders in localStorage for immediate display
        const savedOrdersJSON = localStorage.getItem(storageKey);
        let localOrders = [];
        
        if (savedOrdersJSON) {
          try {
            localOrders = JSON.parse(savedOrdersJSON);
            // Ensure it's an array
            if (!Array.isArray(localOrders)) {
              localOrders = [];
            }
            // Show local orders immediately
            setOrders(localOrders);
            setTotalPages(Math.ceil(localOrders.length / ordersPerPage));
          } catch (e) {
            console.error('Error parsing saved orders:', e);
          }
        }

        // If user is logged in, attempt to fetch from API as well
        if (user && user.token) {
          try {
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`
              }
            };
  
            const response = await axios.get('/api/orders', config);
            const fetchedOrders = response.data;
            
            // Merge with local orders to ensure we don't lose offline orders
            // This is a simple approach - a more robust solution would need deduplication
            const allOrders = [...fetchedOrders, ...localOrders.filter(lo => 
              !fetchedOrders.some(fo => fo._id === lo._id)
            )];
            
            // Save all orders to localStorage
            localStorage.setItem(storageKey, JSON.stringify(allOrders));
            
            setOrders(allOrders);
            setTotalPages(Math.ceil(allOrders.length / ordersPerPage));
          } catch (error) {
            console.error('API fetch error:', error);
            // Already showing localStorage orders, so just show a notification
            if (localOrders.length > 0) {
              setSnackbarMessage('Using locally saved orders. Server connection failed.');
              setSnackbarOpen(true);
            } else {
              // If no local orders and API fails, use mock data
              setOrders(MOCK_ORDERS);
              setTotalPages(Math.ceil(MOCK_ORDERS.length / ordersPerPage));
              setSnackbarMessage('Showing sample orders. Connection to server failed.');
              setSnackbarOpen(true);
            }
          }
        } else {
          // If no user token and no local orders, use mock data
          if (localOrders.length === 0) {
            setOrders(MOCK_ORDERS);
            setTotalPages(Math.ceil(MOCK_ORDERS.length / ordersPerPage));
          }
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        setError('Failed to load orders. Please try again.');
        
        // Use mock data as final fallback
        setOrders(MOCK_ORDERS);
        setTotalPages(Math.ceil(MOCK_ORDERS.length / ordersPerPage));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, ordersPerPage]);

  const handleRefresh = async () => {
    setLoading(true);
    
    // Get the localStorage key - use user ID if available, otherwise use 'guest'
    const storageKey = `user_${user?.id || 'guest'}_orders`;
    
    try {
      // First check localStorage
      const savedOrdersJSON = localStorage.getItem(storageKey);
      let localOrders = [];
      
      if (savedOrdersJSON) {
        try {
          localOrders = JSON.parse(savedOrdersJSON);
          if (!Array.isArray(localOrders)) {
            localOrders = [];
          }
          // Show local orders immediately
          setOrders(localOrders);
          setTotalPages(Math.ceil(localOrders.length / ordersPerPage));
        } catch (e) {
          console.error('Error parsing saved orders:', e);
        }
      }
      
      // Try to fetch from API if user is logged in
      if (user && user.token) {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          };

          const response = await axios.get('/api/orders', config);
          const fetchedOrders = response.data;
          
          // Merge with local orders
          const allOrders = [...fetchedOrders, ...localOrders.filter(lo => 
            !fetchedOrders.some(fo => fo._id === lo._id)
          )];
          
          // Update localStorage and state
          localStorage.setItem(storageKey, JSON.stringify(allOrders));
          setOrders(allOrders);
          setTotalPages(Math.ceil(allOrders.length / ordersPerPage));
          setSnackbarMessage('Orders refreshed successfully');
          setSnackbarOpen(true);
        } catch (error) {
          console.error('Error fetching from API:', error);
          if (localOrders.length > 0) {
            setSnackbarMessage('Using locally saved orders. Server connection failed.');
          } else {
            setSnackbarMessage('Failed to refresh orders. No saved orders found.');
          }
          setSnackbarOpen(true);
        }
      }
    } catch (error) {
      console.error('Error refreshing orders:', error);
      setSnackbarMessage('Failed to refresh orders.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Get current page orders
  const indexOfLastOrder = page * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = Array.isArray(orders) ? orders.slice(indexOfFirstOrder, indexOfLastOrder) : [];

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5">You must be logged in to view your orders</Typography>
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>My Orders</Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage all your orders
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      ) : orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>No Orders Found</Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You haven't placed any orders yet.
          </Typography>
          <Button 
            component={Link} 
            to="/restaurants" 
            variant="contained" 
            color="primary"
          >
            Browse Restaurants
          </Button>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Order ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(currentOrders) && currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <TableRow key={order._id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          #{order.orderNumber || order._id.substring(order._id.length - 8)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{formatDate(order.createdAt)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">₹{order.totalAmount.toFixed(2)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(order.status)}
                          label={order.status}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          component={Link} 
                          to={`/orders/${order._id}`} 
                          color="primary"
                          size="small"
                          title="View details"
                        >
                          <ArrowForward />
                        </IconButton>
                        <IconButton 
                          component={Link} 
                          to={`/order-tracking/${order._id}`} 
                          color="secondary"
                          size="small"
                          title="Track order"
                        >
                          <LocalShipping />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No orders found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
          )}
        </>
      )}
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default Orders; 