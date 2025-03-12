import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert, Box, CircularProgress } from '@mui/material';

/**
 * PrivateRoute component for protecting routes that require authentication
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {boolean} props.requiresAdmin - Whether the route requires admin privileges
 * @returns {React.ReactNode} - Redirects to login if not authenticated, otherwise renders children
 */
const PrivateRoute = ({ children, requiresAdmin = false }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading indicator while authentication state is being determined
  if (loading) {
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

  // Check if admin access is required but user is not an admin
  if (requiresAdmin && user?.role !== 'admin') {
    return (
      <Box sx={{ m: 4 }}>
        <Alert severity="error">
          You don't have permission to access this page. This page requires administrator privileges.
        </Alert>
      </Box>
    );
  }

  // User is authenticated and has necessary permissions, render the protected route
  return children;
};

export default PrivateRoute; 