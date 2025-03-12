import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
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
import DonateFood from './pages/DonateFood';
import DonateMoney from './pages/DonateMoney';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/donate-food" element={<DonateFood />} />
            <Route path="/donate-money" element={<DonateMoney />} />
            
            {/* Protected Routes */}
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
              path="/dashboard" 
              element={<PrivateRoute requiresAdmin={true}><Dashboard /></PrivateRoute>} 
            />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
