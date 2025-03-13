import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import OrderTrackingComponent from '../components/OrderTracking';
import { useAuth } from '../context/AuthContext';

const OrderTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId: paramOrderId } = useParams();
  const { isAuthenticated, user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Get order ID from params or location state
  const orderId = paramOrderId || (location.state && location.state.orderId);
  
  const fetchOrder = async () => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/order-tracking', message: 'Please log in to track your order' } });
      return;
    }
    
    // Redirect if no order ID
    if (!orderId) {
      navigate('/orders');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // First try to fetch from API
      // In a real application, this would be a fetch call to your API
      // For now we'll simulate API failure to show fallback works
      
      // Uncomment this in a real app:
      // const response = await axios.get(`/api/orders/${orderId}/tracking`, {
      //   headers: { Authorization: `Bearer ${user.token}` }
      // });
      // const fetchedOrder = response.data;
      
      // Instead, we'll try to get the order from localStorage first
      const savedOrders = JSON.parse(localStorage.getItem(`user_${user.id}_orders`) || '[]');
      const savedOrder = savedOrders.find(order => order._id === orderId);
      
      if (savedOrder) {
        // Use the saved order but simulate tracking updates
        let updatedOrder = {...savedOrder};
        
        // If no tracking info exists, create it
        if (!updatedOrder.deliveryTracking) {
          const currentStatus = updatedOrder.status || 'Order Confirmed';
          
          // Create tracking array based on status
          const statuses = ['Order Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
          const currentIndex = statuses.findIndex(s => s.toLowerCase() === currentStatus.toLowerCase());
          
          updatedOrder.deliveryTracking = statuses
            .slice(0, Math.max(1, currentIndex + 1))
            .map((status, index) => ({
              status,
              timestamp: new Date(Date.now() - (statuses.length - index) * 15 * 60000).toISOString()
            }));
        }
        
        // Add delivery partner if not exists
        if (!updatedOrder.deliveryPartner) {
          updatedOrder.deliveryPartner = {
            name: 'Rahul Kumar',
            phone: '9876543211',
            rating: 4.8,
            image: '/images/avatars/delivery-partner.jpg'
          };
        }
        
        // Add estimated delivery time if not exists
        if (!updatedOrder.estimatedDelivery) {
          updatedOrder.estimatedDelivery = '30-40 min';
        }
        
        setOrder(updatedOrder);
        setLoading(false);
        return;
      }
      
      // If no saved order, create a mock one
      throw new Error('Order not found in saved orders');
    } catch (err) {
      console.error('Error fetching order:', err);
      
      // Create a mock order as fallback
      const mockOrder = {
        id: orderId,
        status: 'Preparing',
        createdAt: new Date().toISOString(),
        restaurant: {
          id: 1,
          name: 'Spice Junction',
          image: '/images/restaurants/spice-junction.jpg',
          address: 'Shop 4, Jubilee Hills, Hyderabad'
        },
        items: [
          { id: 101, name: 'Paneer Tikka', quantity: 1, price: 220 },
          { id: 301, name: 'Naan', quantity: 2, price: 40 }
        ],
        subtotal: 300,
        deliveryFee: 40,
        tax: 15,
        totalAmount: 355,
        paymentMethod: 'Cash on Delivery',
        deliveryAddress: {
          name: 'John Doe',
          phone: '9876543210',
          line1: '123 Main Street',
          line2: 'Apartment 4B',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500001'
        },
        deliveryPartner: {
          name: 'Rahul Kumar',
          phone: '9876543211',
          rating: 4.8,
          image: '/images/avatars/delivery-partner.jpg'
        },
        estimatedDelivery: '30-40 min',
        deliveryTracking: [
          { status: 'Order Confirmed', timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
          { status: 'Preparing', timestamp: new Date(Date.now() - 5 * 60000).toISOString() }
        ]
      };
      
      setSnackbarMessage('Could not connect to server. Showing sample tracking data.');
      setSnackbarOpen(true);
      setOrder(mockOrder);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrder();
    
    // In a real application, set up real-time updates with WebSocket
    const timer = setInterval(() => {
      setOrder(prevOrder => {
        if (!prevOrder) return null;
        
        // Don't update if already delivered
        if (prevOrder.status === 'Delivered') return prevOrder;
        
        // Simulate progression of order status
        const nextStatusMap = {
          'Order Confirmed': 'Preparing',
          'Preparing': 'Out for Delivery',
          'Out for Delivery': 'Delivered'
        };
        
        // 20% chance of status update on each interval
        if (Math.random() < 0.2) {
          const currentStatus = prevOrder.deliveryTracking[prevOrder.deliveryTracking.length - 1].status;
          const nextStatus = nextStatusMap[currentStatus];
          
          if (nextStatus) {
            return {
              ...prevOrder,
              status: nextStatus,
              deliveryTracking: [
                ...prevOrder.deliveryTracking,
                { status: nextStatus, timestamp: new Date().toISOString() }
              ]
            };
          }
        }
        
        return prevOrder;
      });
    }, 5000); // Check for updates every 5 seconds
    
    return () => clearInterval(timer);
  }, [orderId, isAuthenticated, navigate, user]);
  
  const handleRefresh = () => {
    fetchOrder();
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/orders')} 
            sx={{ mr: 2 }}
          >
            Back to Orders
          </Button>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Track Your Order
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
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : order ? (
        <OrderTrackingComponent order={order} />
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">
            No order found with ID: {orderId}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/orders')}
            sx={{ mt: 2 }}
          >
            View All Orders
          </Button>
        </Paper>
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

export default OrderTracking; 