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

// Auth API
export const authAPI = {
  login: (username, password) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    return api.post('/auth/token', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
};

// User API
export const userAPI = {
  getAllUser:()=>api.get('/users/all'),
  getCurrentUser: () => api.get('/users/me'),
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

// Device API
export const deviceAPI = {
  createDevice: (deviceData) => api.post('/devices', deviceData),
};

// Sensor API
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

// export default {
//   auth: authAPI,
//   users: userAPI,
//   devices: deviceAPI,
//   sensors: sensorAPI,
//   predictions: predictionAPI,
// };