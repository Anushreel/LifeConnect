// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { authAPI, userAPI } from '../components/api'; // Adjust path if needed

// // Create the context
// const AuthContext = createContext();

// // Custom hook to use the auth context
// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isAdminUser, setIsAdminUser] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [authError, setAuthError] = useState(null);

//   // Function to login user
//   const login = async (username, password) => {
//     setAuthError(null);
//     try {
//       console.log('Login attempt for:', username);
//       const response = await authAPI.login(username, password);
      
//       if (!response.data || !response.data.access_token) {
//         throw new Error('Invalid login response: Missing access token');
//       }
      
//       // Save token to localStorage
//       const token = response.data.access_token;
//       localStorage.setItem('access_token', token);
//       console.log('Token saved to localStorage');
      
//       // Fetch user information after login
//       try {
//         const userResponse = await userAPI.getCurrentUser();
        
//         if (!userResponse.data) {
//           throw new Error('Failed to get user data after login');
//         }
        
//         console.log('User data retrieved successfully');
        
//         // Set user data and admin status
//         const userData = userResponse.data;
//         setCurrentUser(userData);
        
//         // Check if user has admin role
//         const adminStatus = Boolean(userData.is_admin || userData.role === 'admin');
//         setIsAdminUser(adminStatus);
        
//         // Store user data in localStorage
//         localStorage.setItem('currentUser', JSON.stringify(userData));
//         localStorage.setItem('isAdmin', adminStatus ? 'true' : 'false');
        
//         return response.data;
//       } catch (userError) {
//         console.error('Failed to get user details after login:', userError);
        
//         // Use minimal user data if API call fails
//         const minimalUser = { username };
//         setCurrentUser(minimalUser);
//         localStorage.setItem('currentUser', JSON.stringify(minimalUser));
        
//         return response.data;
//       }
//     } catch (error) {
//       console.error('Login failed:', error);
//       setAuthError(error);
//       throw error;
//     }
//   };

//   // Function to logout user
//   const logout = async () => {
//     try {
//       // Try to call logout API, but continue even if it fails
//       await authAPI.logout();
//     } catch (error) {
//       console.error('Logout API error:', error);
//     } finally {
//       // Always clear local state and storage
//       clearAuthData();
//     }
//   };

//   // Check if user is an admin
//   const isAdmin = () => {
//     return isAdminUser;
//   };

//   // Function to get token from localStorage
//   const getToken = () => {
//     return localStorage.getItem('access_token');
//   };

//   // Load user from localStorage
//   const loadUserFromStorage = () => {
//     try {
//       const token = localStorage.getItem('access_token');
//       const storedUser = localStorage.getItem('currentUser');
//       const isAdmin = localStorage.getItem('isAdmin') === 'true';
      
//       if (token && storedUser) {
//         const parsedUser = JSON.parse(storedUser);
//         console.log('User loaded from localStorage:', parsedUser.username || 'unknown');
//         setCurrentUser(parsedUser);
//         setIsAdminUser(isAdmin);
//         return true;
//       }
//     } catch (error) {
//       console.error('Failed to load user from localStorage:', error);
//     }
//     return false;
//   };

//   // Helper to clear all auth data
//   const clearAuthData = () => {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('currentUser');
//     localStorage.removeItem('isAdmin');
//     setCurrentUser(null);
//     setIsAdminUser(false);
//     setAuthError(null);
//   };

//   // Effect to load user on component mount
//   useEffect(() => {
//     const initAuth = async () => {
//       console.log('Initializing authentication...');
//       setLoading(true);
      
//       try {
//         // First try to load from localStorage
//         const loadedFromStorage = loadUserFromStorage();
        
//         // If we have a token, verify with backend
//         const token = localStorage.getItem('access_token');
//         if (token) {
//           try {
//             console.log('Verifying authentication with backend...');
//             const response = await userAPI.getCurrentUser();
            
//             if (response.data) {
//               setCurrentUser(response.data);
//               // Check for admin status
//               const adminStatus = Boolean(response.data.is_admin || response.data.role === 'admin');
//               setIsAdminUser(adminStatus);
//               localStorage.setItem('currentUser', JSON.stringify(response.data));
//               localStorage.setItem('isAdmin', adminStatus ? 'true' : 'false');
//               console.log('Authentication verified successfully');
//             } else {
//               console.warn('Backend verification response missing user data');
//               if (!loadedFromStorage) {
//                 clearAuthData();
//               }
//             }
//           } catch (apiError) {
//             console.error('Backend authentication verification failed:', apiError);
//             // If token verification fails, clear everything
//             clearAuthData();
//           }
//         } else {
//           // No token, clear any stale data
//           clearAuthData();
//         }
//       } catch (error) {
//         console.error('Auth initialization failed:', error);
//         clearAuthData();
//       } finally {
//         setLoading(false);
//         console.log('Authentication initialization complete');
//       }
//     };

//     initAuth();
//   }, []);

//   // Context value
//   const value = {
//     currentUser,
//     isAdmin,
//     login,
//     logout,
//     getToken,
//     loading,
//     authError
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;

import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, userAPI } from '../components/api'; // Adjust path if needed

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Function to login user
  const login = async (username, password) => {
    setAuthError(null);
    try {
      console.log('Login attempt for:', username);
      const response = await authAPI.login(username, password);
      
      if (!response.data || !response.data.access_token) {
        throw new Error('Invalid login response: Missing access token');
      }
      
      // Save token to localStorage
      const token = response.data.access_token;
      localStorage.setItem('access_token', token);
      console.log('Token saved to localStorage');
      
      // Fetch user information after login
      try {
        const userResponse = await userAPI.getCurrentUser();
        
        if (!userResponse.data) {
          throw new Error('Failed to get user data after login');
        }
        
        console.log('User data retrieved successfully');
        
        // Set user data and admin status
        const userData = userResponse.data;
        setCurrentUser(userData);
        
        // Check if user has admin role
        const adminStatus = Boolean(userData.is_admin || userData.role === 'admin');
        setIsAdminUser(adminStatus);
        
        // Store user data in localStorage
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('isAdmin', adminStatus ? 'true' : 'false');
        
        return response.data;
      } catch (userError) {
        console.error('Failed to get user details after login:', userError);
        
        // Use minimal user data if API call fails
        const minimalUser = { username };
        setCurrentUser(minimalUser);
        localStorage.setItem('currentUser', JSON.stringify(minimalUser));
        
        return response.data;
      }
    } catch (error) {
      console.error('Login failed:', error);
      setAuthError(error);
      throw error;
    }
  };

  // Function to logout user
  const logout = async () => {
    try {
      // Try to call logout API, but continue even if it fails
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local state and storage
      clearAuthData();
    }
  };

  // Check if user is an admin
  const isAdmin = () => {
    return isAdminUser;
  };

  // Function to get token from localStorage
  const getToken = () => {
    return localStorage.getItem('access_token');
  };

  // Load user from localStorage
  const loadUserFromStorage = () => {
    try {
      const token = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('currentUser');
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      
      if (token && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('User loaded from localStorage:', parsedUser.username || 'unknown');
        setCurrentUser(parsedUser);
        setIsAdminUser(isAdmin);
        return true;
      }
    } catch (error) {
      console.error('Failed to load user from localStorage:', error);
    }
    return false;
  };

  // Helper to clear all auth data
  const clearAuthData = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
    setCurrentUser(null);
    setIsAdminUser(false);
    setAuthError(null);
  };

  // Effect to load user on component mount
  useEffect(() => {
    const initAuth = async () => {
      console.log('Initializing authentication...');
      setLoading(true);
      
      try {
        // First try to load from localStorage
        const loadedFromStorage = loadUserFromStorage();
        
        // If we have a token, verify with backend
        const token = localStorage.getItem('access_token');
        if (token) {
          try {
            console.log('Verifying authentication with backend...');
            const response = await userAPI.getCurrentUser();
            
            if (response.data) {
              console.log('Backend returned user data:', response.data);
              setCurrentUser(response.data);
              // Check for admin status
              const adminStatus = Boolean(response.data.is_admin || response.data.role === 'admin');
              console.log('Admin status:', adminStatus);
              setIsAdminUser(adminStatus);
              localStorage.setItem('currentUser', JSON.stringify(response.data));
              localStorage.setItem('isAdmin', adminStatus ? 'true' : 'false');
              console.log('Authentication verified successfully');
            } else {
              console.warn('Backend verification response missing user data');
              if (!loadedFromStorage) {
                clearAuthData();
              }
            }
          } catch (apiError) {
            console.error('Backend authentication verification failed:', apiError);
            // If token verification fails, clear everything
            clearAuthData();
          }
        } else {
          // No token, clear any stale data
          clearAuthData();
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        clearAuthData();
      } finally {
        setLoading(false);
        console.log('Authentication initialization complete');
      }
    };

    initAuth();
    
    // Debug timer to inspect authentication state
    const debugTimer = setInterval(() => {
      const token = localStorage.getItem('access_token');
      const user = localStorage.getItem('currentUser');
      const admin = localStorage.getItem('isAdmin');
      console.log('Auth debug:', { 
        token: token ? 'exists' : 'missing',
        user: user ? JSON.parse(user).username : 'none',
        admin: admin || 'false',
        stateUser: currentUser ? currentUser.username : 'none',
        stateAdmin: isAdminUser
      });
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(debugTimer);
  }, []);

  // Context value
  const value = {
    currentUser,
    isAdmin,
    login,
    logout,
    getToken,
    loading,
    authError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;