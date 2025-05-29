// import axios from 'axios';

// const API_URL = 'http://localhost:8000/api';

// // Create axios instance with default config
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor for adding token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor for error handling and token expiration
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle authentication errors - 401, 403
//     if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//       console.error('Authentication error:', error.response.status, error.response.data);
      
//       // Clear auth data on unauthorized responses
//       if (window.location.pathname !== '/' && window.location.pathname !== '/register') {
//         // console.log('Clearing auth data due to authentication error');
//         // localStorage.removeItem('access_token');
//         // localStorage.removeItem('currentUser');
//         // localStorage.removeItem('isAdmin');
//         alert("You are not authorized.");
//         // Only redirect if not already on login or register page
//         window.location.href = '/mainpage';
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

// // Auth API
// export const authAPI = {
//   login: async (username, password) => {
//     try {
//       const params = new URLSearchParams();
//       params.append('username', username);
//       params.append('password', password);
      
//       console.log('Sending login request...');
//       const response = await api.post('/auth/token', params, {
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
//       });
      
//       console.log('Login response received:', response.status);
//       return response;
//     } catch (error) {
//       console.error('Login request failed:', error.message);
//       throw error;
//     }
//   },
  
//   register: (userData) => api.post('/auth/register', userData),
//   logout: () => api.post('/auth/logout'),
// };

// // User API
// export const userAPI = {
//   getAllUser: () => api.get('/users/all'),
//   getCurrentUser: async () => {
//     try {
//       console.log('Fetching current user data...');
//       const response = await api.get('/users/me');
//       console.log('Current user data received:', response.status);
//       return response;
//     } catch (error) {
//       console.error('Failed to fetch current user:', error.message);
//       throw error;
//     }
//   },
//   getUserById: (id) => api.get(`/users/${id}`),
//   assignDevice: (id, device_id) => {
//     return api.post('/users/assigndevice', null, {
//       params: {
//         user_id: id,
//         device_id: device_id
//       }
//     });
//   }
// };

// export const deviceAPI = {
//   createDevice: (deviceData) => api.post('/devices', deviceData),
// };

// export const sensorAPI = {
//   getReadingsForUser: (userId, days) => {
//     console.log('API call with days:', days);
//     return api.get(`/sensors/user/${userId}?days=${days}`);
//   }
// };

// export const predictionAPI = {
//   getPredictionsForUser: (userId, days = 7) =>
//     api.get(`/predictions/user/${userId}?days=${days}`),
//   getLatestPredictionForUser: (userId) =>
//     api.get(`/predictions/user/${userId}/latest`),
//   getHealthSummaryForUser: (userId, days = 7) =>
//     api.get(`/predictions/user/${userId}/summary?days=${days}`),
// };

// export const taskAPI = {
//   getUserTasks: async (userId) => {
//     try {
//       console.log(`Attempting to fetch tasks for user: ${userId}`);
//       const response = await api.get(`/tasks/user/${userId}`);
//       console.log('Tasks fetched successfully:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching tasks: ', error);
//       throw error;
//     }
//   },

//   createTask: async (taskData) => {
//     try {
//       const response = await api.post(`/tasks/`, taskData);
//       return response.data;
//     } catch (error) {
//       console.error('Error creating task: ', error);
//       throw error;
//     }
//   },

//   updateTask: async (taskId, taskData) => {
//     try {
//       const response = await api.put(`/tasks/${taskId}`, taskData);
//       return response.data;
//     } catch (error) {
//       console.error('Error updating task: ', error);
//       throw error;
//     }
//   },

//   markTaskAsDone: async (taskId) => {
//     try {
//       const response = await api.patch(`/tasks/${taskId}/mark-done`);
//       return response.data;
//     } catch (error) {
//       console.error('Error marking as done: ', error);
//       throw error;
//     }
//   },

//   deleteTask: async (taskId) => {
//     try {
//       await api.delete(`/tasks/${taskId}`);
//       return true;
//     } catch (error) {
//       console.error('Error deleting task: ', error);
//       throw error;
//     }
//   },

//   getTask: async (taskId) => {
//     try {
//       const response = await api.get(`/tasks/${taskId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching task: ', error);
//       throw error;
//     }
//   }
// };

import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling and token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors - 401, 403
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('Authentication error:', error.response.status, error.response.data);
      
      // Clear auth data on unauthorized responses
      if (window.location.pathname !== '/' && window.location.pathname !== '/register') {
        alert("You are not authorized.");
        window.location.href = '/mainpage';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (username, password) => {
    try {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);
      
      console.log('Sending login request...');
      const response = await api.post('/auth/token', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      console.log('Login response received:', response.status);
      return response;
    } catch (error) {
      console.error('Login request failed:', error.message);
      throw error;
    }
  },
  
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
};

// User API
export const userAPI = {
  getAllUser: () => api.get('/users/all'),
  getCurrentUser: async () => {
    try {
      console.log('Fetching current user data...');
      const response = await api.get('/users/me');
      console.log('Current user data received:', response.status);
      return response;
    } catch (error) {
      console.error('Failed to fetch current user:', error.message);
      throw error;
    }
  },
  getUserById: (id) => api.get(`/users/${id}`),
  assignDevice: (id, device_id) => {
    return api.post('/users/assigndevice', null, {
      params: {
        user_id: id,
        device_id: device_id
      }
    });
  }  
};

// Device api
export const deviceAPI = {
  createDevice: (deviceData) => api.post('/devices', deviceData),
};

// Sensor api
export const sensorAPI = {
  getReadingsForUser: (userId, days) => {
    console.log('API call with days:', days); 
    return api.get(`/sensors/user/${userId}?days=${days}`);
  }
};

// Prediction API
export const predictionAPI = {
  getPredictionsForUser: (userId, days = 7) => 
    api.get(`/predictions/user/${userId}?days=${days}`),
  getLatestPredictionForUser: (userId) => 
    api.get(`/predictions/user/${userId}/latest`),
  getHealthSummaryForUser: (userId, days = 7) => 
    api.get(`/predictions/user/${userId}/summary?days=${days}`),
};

export const taskAPI = {
  getUserTasks: async (userId) => {
    try {
      console.log(`Attempting to fetch tasks for user: ${userId}`);
      const response = await api.get(`/tasks/user/${userId}`);
      console.log('Tasks fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks: ', error);
      throw error;
    }
  },

  createTask: async (taskData) => {
    try {
      const response = await api.post(`/tasks/`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task: ', error);
      throw error;
    }
  },

  updateTask: async (taskId, taskData) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error updating task: ', error);
      throw error;
    }
  },

  markTaskAsDone: async (taskId) => {
    try {
      const response = await api.patch(`/tasks/${taskId}/mark-done`);
      return response.data;
    } catch (error) {
      console.error('Error marking as done: ', error);
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      return true;
    } catch (error) {
      console.error('Error deleting task: ', error);
      throw error;
    }
  },

  getTask: async (taskId) => {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task: ', error);
      throw error;
    }
  }
};

// Notification API
export const notificationAPI = {
  // Get all notifications for the current user
  getNotifications: async (skip = 0, limit = 100) => {
    try {
      const response = await api.get(`/notifications?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Get unread notifications count
  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  // Get a specific notification by ID
  getNotification: async (notificationId) => {
    try {
      const response = await api.get(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification:', error);
      throw error;
    }
  },

  // Mark a notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await api.post('/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Delete a notification
  deleteNotification: async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Admin-only: Get all notifications with filtering options
  getAllNotifications: async (skip = 0, limit = 100, userId = null, severity = null) => {
    try {
      let url = `/notifications/admin/all?skip=${skip}&limit=${limit}`;
      if (userId) url += `&user_id=${userId}`;
      if (severity) url += `&severity=${severity}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching all notifications:', error);
      throw error;
    }
  }
};