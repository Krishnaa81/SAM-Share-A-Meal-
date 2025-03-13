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
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Mock data for restaurant orders
const ordersData = [
  {
    id: 'ORD-1001',
    customer: 'John Smith',
    items: ['Butter Chicken', 'Naan', 'Mango Lassi'],
    total: '₹650',
    time: '2023-10-15 12:30 PM',
    status: 'Delivered',
    payment: 'Paid (Online)',
    address: '123 Main St, Downtown Area, City',
    phone: '+91 98765 43210'
  },
  {
    id: 'ORD-1002',
    customer: 'Priya Sharma',
    items: ['Paneer Tikka', 'Jeera Rice', 'Gulab Jamun'],
    total: '₹450',
    time: '2023-10-15 1:15 PM',
    status: 'Processing',
    payment: 'COD (Pending)',
    address: '456 Park Avenue, Midtown, City',
    phone: '+91 87654 32109'
  },
  {
    id: 'ORD-1003',
    customer: 'Michael Wong',
    items: ['Chicken Biryani', 'Raita', 'Falooda'],
    total: '₹550',
    time: '2023-10-15 2:00 PM',
    status: 'Out for Delivery',
    payment: 'Paid (Online)',
    address: '789 Lake View, Uptown, City',
    phone: '+91 76543 21098'
  },
  {
    id: 'ORD-1004',
    customer: 'Sarah Johnson',
    items: ['Veg Pulao', 'Dal Makhani', 'Choco Lava Cake'],
    total: '₹480',
    time: '2023-10-15 2:45 PM',
    status: 'Confirmed',
    payment: 'Paid (Online)',
    address: '101 River Road, Westside, City',
    phone: '+91 65432 10987'
  },
  {
    id: 'ORD-1005',
    customer: 'Raj Patel',
    items: ['Masala Dosa', 'Idli Sambar', 'Filter Coffee'],
    total: '₹350',
    time: '2023-10-15 3:30 PM',
    status: 'Ready for Pickup',
    payment: 'Paid (Online)',
    address: '202 Mountain View, Eastside, City',
    phone: '+91 54321 09876'
  },
];

// Order status chips with colors
const getStatusChip = (status) => {
  const statusConfig = {
    'Confirmed': { color: 'info', icon: <CheckIcon /> },
    'Processing': { color: 'secondary', icon: null },
    'Ready for Pickup': { color: 'primary', icon: null },
    'Out for Delivery': { color: 'warning', icon: <LocalShippingIcon /> },
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

export default function RestaurantOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(ordersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTab, setSelectedTab] = useState(0);

  // Handle status change
  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
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
          Restaurant Orders
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage and track all your restaurant orders
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
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Delivery
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h3" color="warning.main">
                  {orders.filter(order => order.status === 'Out for Delivery').length}
                </Typography>
                <LocalShippingIcon sx={{ ml: 1, color: 'warning.main' }} />
              </Box>
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
                <Typography variant="h3" color="secondary.main">
                  ₹{orders.reduce((total, order) => total + parseInt(order.total.replace('₹', '')), 0)}
                </Typography>
                <ReceiptIcon sx={{ ml: 1, color: 'secondary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search by order ID, customer name, or item"
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
        <Grid item xs={12} md={3}>
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
        <Grid item xs={12} md={3}>
          <Button 
            variant="outlined" 
            fullWidth 
            startIcon={<PrintIcon />}
            sx={{ height: '100%' }}
          >
            Print Report
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
                <span>Processing</span>
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
                    {getStatusChip(order.status)}
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
                          Dispatch
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