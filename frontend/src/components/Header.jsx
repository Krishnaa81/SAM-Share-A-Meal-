import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Badge,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  RestaurantMenu,
  ShoppingCart,
  Favorite,
  Person,
  Logout,
  Login,
  PersonAdd,
  Dashboard,
  LocalShipping,
  VolunteerActivism,
  Restaurant,
  Business,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/');
  };

  // Common navigation links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Restaurants', path: '/restaurants', icon: <RestaurantMenu /> },
    { name: 'Donate Food', path: '/donate-food', icon: <VolunteerActivism /> },
    { name: 'Cloud Kitchen', path: '/cloud-kitchen', icon: <Restaurant /> },
    { name: 'CSR Credits', path: '/csr-credits', icon: <Business /> },
  ];
  
  // Links for authenticated users
  const authLinks = [
    { name: 'My Orders', path: '/orders', icon: <LocalShipping /> },
    { name: 'Cart', path: '/cart', icon: <ShoppingCart /> },
  ];

  // Admin links
  const adminLinks = user?.role === 'admin' ? [
    { name: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { name: 'Donation Management', path: '/donation-management', icon: <VolunteerActivism /> },
  ] : [];

  // Mobile drawer content
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography
        variant="h6"
        component={RouterLink}
        to="/"
        sx={{
          my: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'primary.main',
          textDecoration: 'none',
          fontWeight: 700,
        }}
      >
        FoodShare
      </Typography>
      <Divider />
      <List>
        {navLinks.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton 
              component={RouterLink} 
              to={item.path}
              sx={{ textAlign: 'center' }}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
        
        {isAuthenticated && (
          <>
            {authLinks.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton 
                  component={RouterLink} 
                  to={item.path}
                  sx={{ textAlign: 'center' }}
                >
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
            
            {adminLinks.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton 
                  component={RouterLink} 
                  to={item.path}
                  sx={{ textAlign: 'center' }}
                >
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
            
            <ListItem disablePadding>
              <ListItemButton 
                component={RouterLink} 
                to="/profile"
                sx={{ textAlign: 'center' }}
              >
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton 
                onClick={handleLogout}
                sx={{ textAlign: 'center' }}
              >
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        )}
        
        {!isAuthenticated && (
          <>
            <ListItem disablePadding>
              <ListItemButton 
                component={RouterLink} 
                to="/login"
                sx={{ textAlign: 'center' }}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton 
                component={RouterLink} 
                to="/register"
                sx={{ textAlign: 'center' }}
              >
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" color="default" elevation={3} sx={{ bgcolor: 'white' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Desktop Logo */}
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
              }}
            >
              FoodShare
            </Typography>

            {/* Mobile Menu Icon */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleDrawerToggle}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Mobile Logo */}
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
              }}
            >
              FoodShare
            </Typography>

            {/* Desktop Navigation Links */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {navLinks.map((page) => (
                <Button
                  key={page.name}
                  component={RouterLink}
                  to={page.path}
                  sx={{ mx: 1, color: 'text.primary', display: 'flex', alignItems: 'center' }}
                  startIcon={page.icon}
                >
                  {page.name}
                </Button>
              ))}
              
              {isAuthenticated && authLinks.map((page) => (
                <Button
                  key={page.name}
                  component={RouterLink}
                  to={page.path}
                  sx={{ mx: 1, color: 'text.primary', display: 'flex', alignItems: 'center' }}
                  startIcon={page.name === 'Cart' ? (
                    <Badge badgeContent={cartItems.length} color="secondary">
                      {page.icon}
                    </Badge>
                  ) : page.icon}
                >
                  {page.name}
                </Button>
              ))}
              
              {isAuthenticated && adminLinks.map((page) => (
                <Button
                  key={page.name}
                  component={RouterLink}
                  to={page.path}
                  sx={{ mx: 1, color: 'text.primary', display: 'flex', alignItems: 'center' }}
                  startIcon={page.icon}
                >
                  {page.name}
                </Button>
              ))}
            </Box>
            
            {/* Cart Icon for Mobile */}
            {isAuthenticated && (
              <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
                <IconButton 
                  color="inherit"
                  component={RouterLink}
                  to="/cart"
                >
                  <Badge badgeContent={cartItems.length} color="secondary">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </Box>
            )}

            {/* User Menu */}
            <Box sx={{ flexGrow: 0 }}>
              {isAuthenticated ? (
                <>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar 
                        alt={user?.name} 
                        src={user?.profilePicture || ''} 
                        sx={{ bgcolor: 'primary.main' }}
                      >
                        {user?.name?.charAt(0)}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem 
                      onClick={handleCloseUserMenu}
                      component={RouterLink}
                      to="/profile"
                    >
                      <Person sx={{ mr: 1 }} /> Profile
                    </MenuItem>

                    <MenuItem 
                      onClick={handleCloseUserMenu}
                      component={RouterLink}
                      to="/orders"
                    >
                      <LocalShipping sx={{ mr: 1 }} /> My Orders
                    </MenuItem>

                    <MenuItem onClick={handleLogout}>
                      <Logout sx={{ mr: 1 }} /> Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex' }}>
                  <Button 
                    component={RouterLink}
                    to="/login"
                    sx={{ mr: 1 }}
                    startIcon={<Login />}
                  >
                    Login
                  </Button>
                  <Button 
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    color="primary"
                    startIcon={<PersonAdd />}
                  >
                    Register
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header; 