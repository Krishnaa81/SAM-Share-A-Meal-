import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Badge,
  Divider,
  Avatar,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  LocalShipping as LocalShippingIcon,
  Today as TodayIcon,
  Event as EventIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  MoreVert as MoreVertIcon,
  Print as PrintIcon,
  Receipt as ReceiptIcon,
  Fastfood as FastfoodIcon,
  ThumbUp as ThumbUpIcon,
  DeliveryDining as DeliveryDiningIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Mock data for cloud kitchen orders
const ordersData = [
  {
    id: 'ORD-2001',
    customer: 'Alex Johnson',
    items: ['Teriyaki Bowl', 'Green Tea'],
    total: '₹370',
    time: '2023-10-15 12:15 PM',
    status: 'Delivered',
    payment: 'Paid (Online)',
    address: '123 Main St, Downtown Area, City',
    phone: '+91 98765 43210',
    deliveryPartner: 'Swiggy',
    deliveryId: 'SWGY78923',
    rating: 5,
  },
  {
    id: 'ORD-2002',
    customer: 'Sarah Williams',
    items: ['Buddha Bowl', 'Detox Water'],
    total: '₹320',
    time: '2023-10-15 12:45 PM',
    status: 'Processing',
    payment: 'Paid (Online)',
    address: '456 Park Avenue, Midtown, City',
    phone: '+91 87654 32109',
    deliveryPartner: 'Zomato',
    deliveryId: 'ZOM45678',
    rating: null,
  },
  {
    id: 'ORD-2003',
    customer: 'Rahul Mehta',
    items: ['Poke Bowl', 'Iced Tea'],
    total: '₹380',
    time: '2023-10-15 1:00 PM',
    status: 'Ready for Pickup',
    payment: 'Paid (Online)',
    address: '789 Lake View, Uptown, City',
    phone: '+91 76543 21098',
    deliveryPartner: 'Swiggy',
    deliveryId: 'SWGY78924',
    rating: null,
  },
  {
    id: 'ORD-2004',
    customer: 'James Wilson',
    items: ['Burrito Bowl', 'Lemonade'],
    total: '₹330',
    time: '2023-10-15 1:15 PM',
    status: 'Confirmed',
    payment: 'COD (Pending)',
    address: '101 River Road, Westside, City',
    phone: '+91 65432 10987',
    deliveryPartner: 'Pending',
    deliveryId: '',
    rating: null,
  },
  {
    id: 'ORD-2005',
    customer: 'Priya Sharma',
    items: ['Smoothie Bowl', 'Protein Shake'],
    total: '₹290',
    time: '2023-10-15 1:30 PM',
    status: 'Out for Delivery',
    payment: 'Paid (Online)',
    address: '202 Mountain View, Eastside, City',
    phone: '+91 54321 09876',
    deliveryPartner: 'Zomato',
    deliveryId: 'ZOM45679',
    rating: null,
  },
];

// Order status chips with colors
const getStatusChip = (status) => {
  const statusConfig = {
    'Confirmed': { color: 'info', icon: <CheckIcon /> },
    'Processing': { color: 'secondary', icon: null },
    'Ready for Pickup': { color: 'primary', icon: null },
    'Out for Delivery': { color: 'warning', icon: <DeliveryDiningIcon /> },
    'Delivered': { color: 'success', icon: <CheckIcon /> },
    'Cancelled': { color: 'error', icon: <CloseIcon /> },
  };

  const config = statusConfig[status] || { color: 'default', icon: null };

  return (
    <Chip 
      icon={config.icon} 
      label={status} 
      color={config.color} 
      size="small"
      sx={{ fontWeight: 500 }}
    />
  );
};

// Delivery partner badge
const getDeliveryPartnerBadge = (partner) => {
  const partnerConfig = {
    'Swiggy': { bgcolor: '#fc8019', color: 'white' },
    'Zomato': { bgcolor: '#e23744', color: 'white' },
    'Pending': { bgcolor: 'grey.300', color: 'text.primary' },
  };

  const config = partnerConfig[partner] || { bgcolor: 'grey.100', color: 'text.primary' };

  return (
    <Chip
      label={partner}
      size="small"
      sx={{
        bgcolor: config.bgcolor,
        color: config.color,
        fontWeight: 'bold',
        fontSize: '0.7rem',
      }}
    />
  );
};

export default function KitchenOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(ordersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTab, setSelectedTab] = useState(0);
  const [partnerFilter, setPartnerFilter] = useState('All');

  // Handle status change
  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Filter orders based on search term, status, and partner
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesPartner = partnerFilter === 'All' || order.deliveryPartner === partnerFilter;
    
    return matchesSearch && matchesStatus && matchesPartner;
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Count orders by status for badges
  const orderCounts = {
    new: orders.filter(order => ['Confirmed'].includes(order.status)).length,
    processing: orders.filter(order => ['Processing', 'Ready for Pickup'].includes(order.status)).length,
    delivery: orders.filter(order => ['Out for Delivery'].includes(order.status)).length,
    completed: orders.filter(order => ['Delivered'].includes(order.status)).length,
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Cloud Kitchen Orders
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage and track all your cloud kitchen orders across delivery platforms
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Orders
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h3" color="primary">
                  {orders.length}
                </Typography>
                <TodayIcon sx={{ ml: 1, color: 'primary.main' }} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {orders.filter(order => order.deliveryPartner === 'Swiggy').length} from Swiggy, 
                {' '}{orders.filter(order => order.deliveryPartner === 'Zomato').length} from Zomato
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ready for Pickup
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h3" color="secondary.main">
                  {orders.filter(order => order.status === 'Ready for Pickup').length}
                </Typography>
                <FastfoodIcon sx={{ ml: 1, color: 'secondary.main' }} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Awaiting delivery partners
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Completed
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h3" color="success.main">
                  {orders.filter(order => order.status === 'Delivered').length}
                </Typography>
                <CheckIcon sx={{ ml: 1, color: 'success.main' }} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Avg. rating: {
                  orders.filter(order => order.rating !== null).length > 0 
                    ? (orders.filter(order => order.rating !== null).reduce((sum, order) => sum + order.rating, 0) / 
                       orders.filter(order => order.rating !== null).length).toFixed(1)
                    : 'N/A'
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue Today
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h3" color="primary.main">
                  ₹{orders.reduce((total, order) => total + parseInt(order.total.replace('₹', '')), 0)}
                </Typography>
                <ReceiptIcon sx={{ ml: 1, color: 'primary.main' }} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {orders.filter(order => order.payment.includes('Paid')).length} paid orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Search by order ID, customer, or item"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="Confirmed">Confirmed</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Ready for Pickup">Ready for Pickup</MenuItem>
              <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Delivery Partner</InputLabel>
            <Select
              value={partnerFilter}
              label="Delivery Partner"
              onChange={(e) => setPartnerFilter(e.target.value)}
            >
              <MenuItem value="All">All Partners</MenuItem>
              <MenuItem value="Swiggy">Swiggy</MenuItem>
              <MenuItem value="Zomato">Zomato</MenuItem>
              <MenuItem value="Pending">Pending Assignment</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button 
            variant="outlined" 
            fullWidth 
            startIcon={<PrintIcon />}
            sx={{ height: '100%' }}
          >
            Export
          </Button>
        </Grid>
      </Grid>

      {/* Order Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab 
            label={
              <Badge badgeContent={orderCounts.new} color="error" max={99}>
                <span>New Orders</span>
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={orderCounts.processing} color="secondary" max={99}>
                <span>Preparing</span>
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={orderCounts.delivery} color="primary" max={99}>
                <span>Out for Delivery</span>
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={orderCounts.completed} color="success" max={99}>
                <span>Completed</span>
              </Badge>
            } 
          />
        </Tabs>
      </Paper>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No orders match your current filters.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Delivery</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2" fontWeight="bold">
                      {order.id}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.deliveryId && `Tracking: ${order.deliveryId}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{order.customer}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.phone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.items.slice(0, 2).join(', ')}
                      {order.items.length > 2 && '...'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.items.length} items
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {order.total}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.payment}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.time.split(' ')[1]} {order.time.split(' ')[2]}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.time.split(' ')[0]}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {getDeliveryPartnerBadge(order.deliveryPartner)}
                  </TableCell>
                  <TableCell>
                    <Stack direction="column" spacing={1}>
                      {getStatusChip(order.status)}
                      {order.rating && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ThumbUpIcon sx={{ color: 'success.main', fontSize: '0.875rem', mr: 0.5 }} />
                          <Typography variant="caption" color="success.main">
                            Rated {order.rating}/5
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      {order.status === 'Confirmed' && (
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="primary" 
                          sx={{ mr: 1 }}
                          onClick={() => handleStatusChange(order.id, 'Processing')}
                        >
                          Accept
                        </Button>
                      )}
                      {order.status === 'Processing' && (
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="primary"
                          sx={{ mr: 1 }}
                          onClick={() => handleStatusChange(order.id, 'Ready for Pickup')}
                        >
                          Ready
                        </Button>
                      )}
                      {order.status === 'Ready for Pickup' && (
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="primary"
                          sx={{ mr: 1 }}
                          onClick={() => handleStatusChange(order.id, 'Out for Delivery')}
                        >
                          Picked Up
                        </Button>
                      )}
                      {order.status === 'Out for Delivery' && (
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="success"
                          sx={{ mr: 1 }}
                          onClick={() => handleStatusChange(order.id, 'Delivered')}
                        >
                          Delivered
                        </Button>
                      )}
                      <IconButton size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
} 