import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  IconButton,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Restaurant as RestaurantIcon,
  Room as RoomIcon,
  LocalShipping as LocalShippingIcon,
  AttachMoney as AttachMoneyIcon,
  Star as StarIcon,
  People as PeopleIcon,
  Whatshot as WhatshotIcon,
  RestaurantMenu as RestaurantMenuIcon,
  BarChart as BarChartIcon,
  ArrowForward as ArrowForwardIcon,
  Timer as TimerIcon,
  TrendingFlat as TrendingFlatIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  Storefront as StorefrontIcon,
  Fastfood as FastFoodIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { getRecentOrders, getOrderStats, getPlatformPerformance } from '../../api/orderService';
import { getTopSellingItems } from '../../api/menuService';
import { getDashboardStats, getCustomerRatings } from '../../api/statsService';

// Status chips with colors
const getStatusChip = (status) => {
  const statusConfig = {
    'Confirmed': { color: 'info', icon: <CheckIcon fontSize="small" /> },
    'Processing': { color: 'secondary', icon: null },
    'Ready for Pickup': { color: 'primary', icon: null },
    'Out for Delivery': { color: 'warning', icon: <LocalShippingIcon fontSize="small" /> },
    'Delivered': { color: 'success', icon: <CheckIcon fontSize="small" /> },
    'Cancelled': { color: 'error', icon: <CloseIcon fontSize="small" /> },
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

export default function CloudKitchenDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for different data sections
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topSellingItems, setTopSellingItems] = useState([]);
  const [platformPerformance, setPlatformPerformance] = useState([]);
  const [customerRating, setCustomerRating] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all required data in parallel
        const [
          statsResponse,
          ordersResponse,
          itemsResponse,
          platformResponse,
          ratingResponse
        ] = await Promise.all([
          getDashboardStats('cloudKitchen'),
          getRecentOrders(4),
          getTopSellingItems(5),
          getPlatformPerformance(),
          getCustomerRatings()
        ]);

        setDashboardStats(statsResponse);
        setRecentOrders(ordersResponse);
        setTopSellingItems(itemsResponse);
        setPlatformPerformance(platformResponse);
        setCustomerRating(ratingResponse);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Cloud Kitchen Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome back, {user?.name}! Here's how your cloud kitchen is performing today.
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="text.secondary">
                  Today's Orders
                </Typography>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <RestaurantMenuIcon />
                </Avatar>
              </Box>
              <Typography variant="h3" component="div">
                {dashboardStats?.todayOrders || 0}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {dashboardStats?.ordersTrend >= 0 ? (
                  <TrendingUp color="success" fontSize="small" sx={{ mr: 0.5 }} />
                ) : (
                  <TrendingDown color="error" fontSize="small" sx={{ mr: 0.5 }} />
                )}
                <Typography variant="body2" color={dashboardStats?.ordersTrend >= 0 ? 'success.main' : 'error.main'} sx={{ mr: 1 }}>
                  {Math.abs(dashboardStats?.ordersTrend || 0)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  vs. yesterday
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="text.secondary">
                  Today's Revenue
                </Typography>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <AttachMoneyIcon />
                </Avatar>
              </Box>
              <Typography variant="h3" component="div">
                ₹{dashboardStats?.todayRevenue || 0}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {dashboardStats?.revenueTrend >= 0 ? (
                  <TrendingUp color="success" fontSize="small" sx={{ mr: 0.5 }} />
                ) : (
                  <TrendingDown color="error" fontSize="small" sx={{ mr: 0.5 }} />
                )}
                <Typography variant="body2" color={dashboardStats?.revenueTrend >= 0 ? 'success.main' : 'error.main'} sx={{ mr: 1 }}>
                  {Math.abs(dashboardStats?.revenueTrend || 0)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  vs. yesterday
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="text.secondary">
                  Avg. Order Value
                </Typography>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <BarChartIcon />
                </Avatar>
              </Box>
              <Typography variant="h3" component="div">
                ₹{dashboardStats?.avgOrderValue || 0}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {dashboardStats?.avgOrderTrend === 0 ? (
                  <TrendingFlatIcon color="info" fontSize="small" sx={{ mr: 0.5 }} />
                ) : dashboardStats?.avgOrderTrend > 0 ? (
                  <TrendingUp color="success" fontSize="small" sx={{ mr: 0.5 }} />
                ) : (
                  <TrendingDown color="error" fontSize="small" sx={{ mr: 0.5 }} />
                )}
                <Typography variant="body2" color={
                  dashboardStats?.avgOrderTrend === 0 ? 'info.main' :
                  dashboardStats?.avgOrderTrend > 0 ? 'success.main' : 'error.main'
                } sx={{ mr: 1 }}>
                  {Math.abs(dashboardStats?.avgOrderTrend || 0)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  vs. yesterday
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="text.secondary">
                  Customer Rating
                </Typography>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <StarIcon />
                </Avatar>
              </Box>
              <Typography variant="h3" component="div">
                {customerRating?.average || 0}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {customerRating?.trend >= 0 ? (
                  <TrendingUp color="success" fontSize="small" sx={{ mr: 0.5 }} />
                ) : (
                  <TrendingDown color="error" fontSize="small" sx={{ mr: 0.5 }} />
                )}
                <Typography variant="body2" color={customerRating?.trend >= 0 ? 'success.main' : 'error.main'} sx={{ mr: 1 }}>
                  {Math.abs(customerRating?.trend || 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  last 30 days
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Top Selling Items */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Top Selling Items
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                component="a"
                href="/kitchen-menu"
              >
                View Menu
              </Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Item Name</TableCell>
                    <TableCell align="right">Orders</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                    <TableCell align="right">Trend</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topSellingItems.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <FastFoodIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                          {item.name}
                        </Box>
                      </TableCell>
                      <TableCell align="right">{item.orders}</TableCell>
                      <TableCell align="right">₹{item.revenue}</TableCell>
                      <TableCell align="right">
                        {item.trend > 0 && <TrendingUp fontSize="small" color="success" />}
                        {item.trend < 0 && <TrendingDown fontSize="small" color="error" />}
                        {item.trend === 0 && <TrendingFlatIcon fontSize="small" color="action" />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        {/* Recent Orders */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Orders
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                component="a"
                href="/kitchen-orders"
              >
                View All
              </Button>
            </Box>
            <List sx={{ width: '100%' }}>
              {recentOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <IconButton edge="end" aria-label="more">
                        <MoreVertIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar 
                        sx={{ 
                          bgcolor: order.platform === 'Swiggy' ? '#fc8019' : 
                                  order.platform === 'Zomato' ? '#e23744' : 'primary.main'
                        }}
                      >
                        {order.platform === 'Swiggy' || order.platform === 'Zomato' ? 
                          order.platform.charAt(0) : <StorefrontIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle2">
                            {order.id}
                          </Typography>
                          <Typography variant="subtitle2" color="primary">
                            ₹{order.total}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            variant="body2"
                            color="text.primary"
                          >
                            {order.customerName}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              {order.items.join(', ')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {order.orderTime}
                            </Typography>
                          </Box>
                          <Box sx={{ mt: 0.5 }}>
                            {getStatusChip(order.status)}
                          </Box>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        
        {/* Platform Performance */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance by Platform
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Platform</TableCell>
                    <TableCell align="right">Orders</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                    <TableCell align="right">Commission Paid</TableCell>
                    <TableCell align="right">Average Rating</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {platformPerformance.map((platform) => (
                    <TableRow key={platform.platform} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              width: 28, 
                              height: 28, 
                              mr: 1,
                              bgcolor: platform.platform === 'Swiggy' ? '#fc8019' : 
                                      platform.platform === 'Zomato' ? '#e23744' : 'primary.main'
                            }}
                          >
                            {platform.platform === 'Direct Website' ? 
                              <StorefrontIcon fontSize="small" /> : 
                              platform.platform.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" fontWeight="medium">
                            {platform.platform}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{platform.orders}</TableCell>
                      <TableCell align="right">₹{platform.revenue}</TableCell>
                      <TableCell align="right">₹{platform.commission}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          {platform.rating}
                          <StarIcon sx={{ color: 'gold', ml: 0.5, fontSize: 16 }} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 