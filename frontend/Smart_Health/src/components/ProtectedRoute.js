import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Component to protect routes that require authentication
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { currentUser, isAdmin, loading, getToken } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Only process authorization check when auth loading is complete
    if (!loading) {
      // Check if token exists in localStorage
      const token = getToken();

      // Verify that user object exists AND token exists
      const userExists = currentUser !== null;
      const tokenExists = token !== null && token !== undefined;

      // Admin check - only if user exists
      const adminCheck = requireAdmin ? (userExists && isAdmin()) : true;

      // User must exist and have a token, and pass the admin check if required
      const isAuthorized = userExists && tokenExists && adminCheck;

      console.log('ProtectedRoute authorization check:', { 
        path: location.pathname,
        currentUser: !!currentUser, 
        hasToken: !!token,
        isAdminRequired: requireAdmin,
        isAdminUser: isAdmin(),
        isAuthorized
      });

      setIsAuthorized(isAuthorized);
      setIsChecking(false);
    }
  }, [currentUser, isAdmin, loading, requireAdmin, location.pathname, getToken]);

  // If still loading auth state or checking authorization, show a loading spinner
  if (loading || isChecking) {
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
        <p>Verifying access...</p>
      </div>
    );
  }

  // If not authorized, redirect appropriately
  if (!isAuthorized) {
    // If not logged in, redirect to login
    if (!currentUser) {
      console.log('Redirecting to login: No current user detected');
      return <Navigate to="/" replace />;
    }

    // If admin access is required but user is not an admin
    if (!isAdmin()) {
      console.log('Redirecting to unauthorized: Admin access required but user is not admin');
      return <Navigate to="/unauthorized" replace />;
    }

    // If we have a user but no token, logout and redirect to login
    console.log('Authentication failed: Missing token or invalid state');
    return <Navigate to="/" replace />;
  }

  // If authorized, render the children
  console.log('Access granted to protected route:', location.pathname);
  return children;
};

export default ProtectedRoute;