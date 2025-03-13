import React from 'react';
import { Box, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, Container, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Restaurant as RestaurantIcon,
  Business as BusinessIcon,
  Kitchen as KitchenIcon,
  LocalShipping,
  ShoppingCart,
  Person,
  Settings,
  Assessment
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CustomerDashboard from '../pages/dashboards/CustomerDashboard';
import RestaurantDashboard from '../pages/dashboards/RestaurantDashboard';
import CSRDashboard from '../pages/dashboards/CSRDashboard';
import CloudKitchenDashboard from '../pages/dashboards/CloudKitchenDashboard';

const drawerWidth = 280;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBarStyled = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function DashboardLayout() {
  const [open, setOpen] = React.useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const getNavigationItems = () => {
    switch (user?.role) {
      case 'restaurant':
        return [
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
          { text: 'Orders', icon: <LocalShipping />, path: '/orders' },
          { text: 'Menu Management', icon: <RestaurantIcon />, path: '/menu' },
          { text: 'Analytics', icon: <Assessment />, path: '/analytics' },
          { text: 'Settings', icon: <Settings />, path: '/settings' },
        ];
      case 'corporate':
        return [
          { text: 'CSR Dashboard', icon: <BusinessIcon />, path: '/csr-dashboard' },
          { text: 'Donations', icon: <Assessment />, path: '/donations' },
          { text: 'Tax Benefits', icon: <Assessment />, path: '/tax-benefits' },
          { text: 'Settings', icon: <Settings />, path: '/settings' },
        ];
      case 'cloudKitchen':
        return [
          { text: 'Kitchen Dashboard', icon: <KitchenIcon />, path: '/kitchen-dashboard' },
          { text: 'Orders', icon: <LocalShipping />, path: '/orders' },
          { text: 'Menu', icon: <RestaurantIcon />, path: '/menu' },
          { text: 'Analytics', icon: <Assessment />, path: '/analytics' },
          { text: 'Settings', icon: <Settings />, path: '/settings' },
        ];
      case 'customer':
        return [
          { text: 'My Orders', icon: <LocalShipping />, path: '/orders' },
          { text: 'Cart', icon: <ShoppingCart />, path: '/cart' },
          { text: 'Profile', icon: <Person />, path: '/profile' },
        ];
      default:
        return [];
    }
  };

  const getDashboardByRole = () => {
    switch (user?.role) {
      case 'customer':
        return <CustomerDashboard />;
      case 'restaurant':
        return <RestaurantDashboard />;
      case 'corporate':
        return <CSRDashboard />;
      case 'cloudKitchen':
        return <CloudKitchenDashboard />;
      default:
        return <Typography>Access Denied</Typography>;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBarStyled position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {user?.role === 'restaurant' ? 'Restaurant Dashboard' :
             user?.role === 'corporate' ? 'CSR Dashboard' :
             user?.role === 'cloudKitchen' ? 'Cloud Kitchen Dashboard' :
             'Customer Dashboard'}
          </Typography>
        </Toolbar>
      </AppBarStyled>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.default',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            SAM
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {getNavigationItems().map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Container maxWidth={false} sx={{ mt: 4, mb: 4, height: 'calc(100vh - 64px)', overflow: 'auto' }}>
          {getDashboardByRole()}
        </Container>
      </Main>
    </Box>
  );
} 