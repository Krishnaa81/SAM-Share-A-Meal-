import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert, Box, CircularProgress } from '@mui/material';

/**
 * PrivateRoute component for protecting routes that require authentication
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {boolean} props.requiresAdmin - Whether the route requires admin privileges
 * @param {boolean} props.requiresCorporate - Whether the route is for corporate users
 * @param {boolean} props.requiresRestaurant - Whether the route is for restaurant owners
 * @param {boolean} props.requiresCloudKitchen - Whether the route is for cloud kitchen owners
 * @returns {React.ReactNode} - Redirects to login if not authenticated, otherwise renders children
 */
const PrivateRoute = ({ 
  children, 
  requiresAdmin = false, 
  requiresCorporate = false,
  requiresRestaurant = false,
  requiresCloudKitchen = false
}) => {
  const { user, isAuthenticated, loading, authChecked } = useAuth();
  const location = useLocation();

  // Show loading indicator while authentication state is being determined
  if (loading || !authChecked) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '80vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check permissions based on route requirements
  const hasAccess = 
    // Regular route - any authenticated user can access
    (!requiresAdmin && !requiresCorporate && !requiresRestaurant && !requiresCloudKitchen) ||
    // Admin route - only admin can access
    (requiresAdmin && user?.role === 'admin') ||
    // Corporate route - corporate users and admins can access
    (requiresCorporate && (user?.role === 'corporate' || user?.role === 'admin')) ||
    // Restaurant route - restaurant owners and admins can access
    (requiresRestaurant && (user?.role === 'restaurant' || user?.role === 'admin')) ||
    // Cloud Kitchen route - cloud kitchen owners and admins can access
    (requiresCloudKitchen && (user?.role === 'cloudKitchen' || user?.role === 'admin'));

  // If user doesn't have access, show permission error
  if (!hasAccess) {
    let errorMessage = "You don't have permission to access this page.";
    
    if (requiresAdmin) {
      errorMessage += " This page requires administrator privileges.";
    } else if (requiresCorporate) {
      errorMessage += " This page is for corporate (CSR) users only.";
    } else if (requiresRestaurant) {
      errorMessage += " This page is for restaurant owners only.";
    } else if (requiresCloudKitchen) {
      errorMessage += " This page is for cloud kitchen owners only.";
    }
    
    return (
      <Box sx={{ m: 4 }}>
        <Alert severity="error">
          {errorMessage}
        </Alert>
      </Box>
    );
  }

  // User is authenticated and has necessary permissions, render the protected route
  return children;
};

export default PrivateRoute; 