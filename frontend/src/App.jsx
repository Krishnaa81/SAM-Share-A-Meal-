import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import CartProvider from './context/CartContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import OrderTracking from './pages/OrderTracking';
import DonateFood from './pages/DonateFood';
import DonateMoney from './pages/DonateMoney';
import Dashboard from './pages/Dashboard';
import CSRCredits from './pages/CSRCredits';
import DonationManagement from './pages/DonationManagement';
import CloudKitchen from './pages/CloudKitchen';
import CloudKitchens from './pages/CloudKitchens';
import CSRDashboard from './pages/dashboards/CSRDashboard';
import NotFound from './pages/NotFound';
import MenuManagement from './pages/MenuManagement';
import RestaurantOrders from './pages/RestaurantOrders';
import CloudKitchenDashboard from './pages/dashboards/CloudKitchenDashboard';
import KitchenMenu from './pages/KitchenMenu';
import KitchenOrders from './pages/KitchenOrders';
import TaxBenefits from './pages/TaxBenefits';
import * as imageUtils from './utils/imageUtils';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    success: {
      main: '#4caf50',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
        },
        containedPrimary: {
          boxShadow: '0px 4px 10px rgba(25, 118, 210, 0.3)',
        },
        containedSecondary: {
          boxShadow: '0px 4px 10px rgba(255, 152, 0, 0.3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

// Preloader component to ensure images are loaded
const ImagePreloader = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Function to preload images
    const preloadImages = () => {
      // Get all image elements on the page
      const images = document.querySelectorAll('img');
      
      // Collect image sources
      const imageSources = Array.from(images).map(img => img.getAttribute('src')).filter(Boolean);
      
      // Preload images
      imageUtils.preloadImages(imageSources);
      
      // Attach global error handler to all images
      images.forEach(img => {
        if (!img.hasAttribute('data-error-handled')) {
          img.setAttribute('data-error-handled', 'true');
          img.addEventListener('error', (e) => {
            // Determine image category from class names or parent elements
            let category = 'default';
            if (img.classList.contains('food-image') || img.closest('.food-item')) {
              category = 'food';
            } else if (img.classList.contains('restaurant-image') || img.closest('.restaurant-item')) {
              category = 'restaurant';
            } else if (img.classList.contains('avatar-image') || img.closest('.avatar')) {
              category = 'avatar';
            }
            imageUtils.handleImageError(e, category);
          });
        }
      });
    };
    
    // Preload images whenever route changes
    preloadImages();
  }, [location.pathname]);
  
  return null;
};

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <CartProvider>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                minHeight: '100vh',
                width: '100%'
              }}
            >
              <Header />
              <Box 
                component="main" 
                sx={{ 
                  flexGrow: 1,
                  width: '100%',
                  overflowX: 'hidden'
                }}
              >
                <ImagePreloader />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/csr-credits" element={<CSRCredits />} />
                  
                  {/* Customer Routes */}
                  <Route 
                    path="/restaurants" 
                    element={<PrivateRoute><Restaurants /></PrivateRoute>} 
                  />
                  <Route 
                    path="/restaurants/:id" 
                    element={<PrivateRoute><RestaurantDetail /></PrivateRoute>} 
                  />
                  <Route 
                    path="/cloud-kitchens" 
                    element={<PrivateRoute><CloudKitchens /></PrivateRoute>} 
                  />
                  <Route 
                    path="/profile" 
                    element={<PrivateRoute><Profile /></PrivateRoute>} 
                  />
                  <Route 
                    path="/cart" 
                    element={<PrivateRoute><Cart /></PrivateRoute>} 
                  />
                  <Route 
                    path="/checkout" 
                    element={<PrivateRoute><Checkout /></PrivateRoute>} 
                  />
                  <Route 
                    path="/orders" 
                    element={<PrivateRoute><Orders /></PrivateRoute>} 
                  />
                  <Route 
                    path="/orders/:id" 
                    element={<PrivateRoute><OrderDetail /></PrivateRoute>} 
                  />
                  <Route 
                    path="/order-tracking/:orderId" 
                    element={<PrivateRoute><OrderTracking /></PrivateRoute>} 
                  />
                  <Route 
                    path="/order-tracking" 
                    element={<PrivateRoute><OrderTracking /></PrivateRoute>} 
                  />
                  <Route 
                    path="/donate-food" 
                    element={<PrivateRoute><DonateFood /></PrivateRoute>} 
                  />
                  <Route 
                    path="/donate-money" 
                    element={<PrivateRoute><DonateMoney /></PrivateRoute>} 
                  />
                  
                  {/* Restaurant Owner Routes */}
                  <Route 
                    path="/dashboard" 
                    element={<PrivateRoute requiresRestaurant={true}><Dashboard /></PrivateRoute>} 
                  />
                  <Route 
                    path="/menu-management" 
                    element={<PrivateRoute requiresRestaurant={true}><MenuManagement /></PrivateRoute>} 
                  />
                  <Route 
                    path="/restaurant-orders" 
                    element={<PrivateRoute requiresRestaurant={true}><RestaurantOrders /></PrivateRoute>} 
                  />
                  
                  {/* Cloud Kitchen Routes */}
                  <Route 
                    path="/cloud-kitchen" 
                    element={<PrivateRoute requiresCloudKitchen={true}><CloudKitchenDashboard /></PrivateRoute>} 
                  />
                  <Route 
                    path="/kitchen-menu" 
                    element={<PrivateRoute requiresCloudKitchen={true}><KitchenMenu /></PrivateRoute>} 
                  />
                  <Route 
                    path="/kitchen-orders" 
                    element={<PrivateRoute requiresCloudKitchen={true}><KitchenOrders /></PrivateRoute>} 
                  />
                  
                  {/* Corporate (CSR) Routes */}
                  <Route 
                    path="/csr-dashboard" 
                    element={<PrivateRoute requiresCorporate={true}><CSRDashboard /></PrivateRoute>} 
                  />
                  <Route 
                    path="/tax-benefits" 
                    element={<PrivateRoute requiresCorporate={true}><TaxBenefits /></PrivateRoute>} 
                  />
                  <Route 
                    path="/donation-management" 
                    element={<PrivateRoute requiresAdmin={true}><DonationManagement /></PrivateRoute>} 
                  />
                  
                  {/* 404 Page */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Box>
              <Footer />
            </Box>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
