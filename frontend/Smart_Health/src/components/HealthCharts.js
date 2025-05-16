import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaChartBar, FaUser, FaCog, FaBars, FaTimes } from 'react-icons/fa';
import './HealthCharts.css';
import { sensorAPI, userAPI, predictionAPI } from './api';
import { Home } from 'lucide-react';

const HealthCharts = () => {
  const navigate = useNavigate();
  const [temperatureData, setTemperatureData] = useState([]);
  const [heartRateData, setHeartRateData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [ecgData, setEcgData] = useState([]);
  const [predData, setPredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [user, setUser] = useState(null);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      
      // Auto-close sidebar on small screens when resizing
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Process the sensor data for charts
  const processChartData = useCallback((readings) => {
    // Sort readings by timestamp
    const sortedReadings = [...readings].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );

    const tempData = [];
    const heartData = [];
    const humidData = [];
    const ecgValues = [];

    // We can check the time range of the data
    let showDates = false;
    if (sortedReadings.length > 1) {
      const firstDate = new Date(sortedReadings[0].timestamp);
      const lastDate = new Date(sortedReadings[sortedReadings.length - 1].timestamp);
      const dayDiff = Math.floor((lastDate - firstDate) / (1000 * 60 * 60 * 24));
      showDates = dayDiff >= 1; // Show dates if data spans more than 1 day
    }

    sortedReadings.forEach(reading => {
      // Format timestamp
      const timestamp = new Date(reading.timestamp);
      let formattedTime;
    
      if (showDates) {
        // For multi-day views, include the date
        formattedTime = timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
                       ' ' + 
                       timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        // For single day view, just show the time
        formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      if (reading.temperature !== null && reading.temperature !== undefined) {
        tempData.push({
          time: formattedTime,
          value: reading.temperature,
          status: reading.prediction?.health_status
        });
      }
      
      if (reading.heart_rate !== null && reading.heart_rate !== undefined) {
        heartData.push({
          time: formattedTime,
          value: reading.heart_rate,
          status: reading.prediction?.health_status
        });
      }
      
      if (reading.humidity !== null && reading.humidity !== undefined) {
        humidData.push({
          time: formattedTime,
          value: reading.humidity,
          status: reading.prediction?.health_status
        });
      }
      
      if (reading.ecg !== null && reading.ecg !== undefined) {
        ecgValues.push({
          time: formattedTime,
          value: reading.ecg,
          status: reading.prediction?.health_status
        });
      }
    });

    setTemperatureData(tempData);
    setHeartRateData(heartData);
    setHumidityData(humidData);
    setEcgData(ecgValues);
  }, []);
  
  // Process prediction data for charts
  const processPredictionData = useCallback((predictions) => {
    // Sort predictions by timestamp
    const sortedPredictions = [...predictions].sort((a, b) => 
      new Date(a.prediction_timestamp || a.timestamp) - new Date(b.prediction_timestamp || b.timestamp)
    );

    const predValues = [];

    // We can check the time range of the data
    let showDates = false;
    if (sortedPredictions.length > 1) {
      const firstDate = new Date(sortedPredictions[0].prediction_timestamp || sortedPredictions[0].timestamp);
      const lastDate = new Date(sortedPredictions[sortedPredictions.length - 1].prediction_timestamp || sortedPredictions[sortedPredictions.length - 1].timestamp);
      const dayDiff = Math.floor((lastDate - firstDate) / (1000 * 60 * 60 * 24));
      showDates = dayDiff >= 1; // Show dates if data spans more than 1 day
    }

    sortedPredictions.forEach(prediction => {
      // Format timestamp
      const timestamp = new Date(prediction.prediction_timestamp || prediction.timestamp);
      let formattedTime;
    
      if (showDates) {
        // For multi-day views, include the date
        formattedTime = timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
                       ' ' + 
                       timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        // For single day view, just show the time
        formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      // Add prediction result as the value (using result field from DB)
      // Convert to a scale of 0-100 if it's not already
      if (prediction.result !== null && prediction.result !== undefined) {
        const value = (prediction.result >= 0 && prediction.result <= 1) ? 
          prediction.result * 100 : prediction.result;
          
        predValues.push({
          time: formattedTime,
          value: value,
          status: prediction.health_status
        });
      }
    });

    setPredData(predValues);
  }, []);
    
  // Fetch sensor data
  const fetchSensorData = useCallback(async (userId) => {
    setLoading(true);
    console.log('Fetching sensor data with days:', days);
    try {
      const response = await sensorAPI.getReadingsForUser(userId, days);
      const readings = response.data || [];
      
      if (readings.length === 0) {
        setError("No sensor data available for the selected period");
        setLoading(false);
        return;
      }
      // Log the time range of the received data
      if (readings.length > 0) {
        const dates = readings.map(r => new Date(r.timestamp));
        const oldestDate = new Date(Math.min.apply(null, dates));
        const newestDate = new Date(Math.max.apply(null, dates));
        console.log(`Got ${readings.length} readings from ${oldestDate.toISOString()} to ${newestDate.toISOString()}`);
      }
      // Process the data for charts
      processChartData(readings);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch sensor data:', error);
      setError("Error fetching sensor data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [days, processChartData]);

  // Fetch prediction data
  const fetchPredData = useCallback(async (userId) => {
    console.log('Fetching prediction data with days:', days);
    try {
      const response = await predictionAPI.getPredictionsForUser(userId, days);
      const predictions = response.data || [];
      
      if (predictions.length === 0) {
        console.log("No prediction data available for the selected period");
        setPredData([]);
        return;
      }
      
      // Log the time range of the received data
      if (predictions.length > 0) {
        const dates = predictions.map(r => new Date(r.prediction_timestamp || r.timestamp));
        const oldestDate = new Date(Math.min.apply(null, dates));
        const newestDate = new Date(Math.max.apply(null, dates));
        console.log(`Got ${predictions.length} predictions from ${oldestDate.toISOString()} to ${newestDate.toISOString()}`);
      }
      
      // Process the prediction data for charts
      processPredictionData(predictions);
    } catch (error) {
      console.error('Failed to fetch prediction data:', error);
      setPredData([]);
    }
  }, [days, processPredictionData]);

  // Fetch user data
  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await userAPI.getCurrentUser();
        setUser(response.data);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Set fallback user data for demo purposes
        const fallbackUser = {
          uid: 'demo-user-id',
          full_name: 'Demo User',
        };
        setUser(fallbackUser);
        return fallbackUser;
      }
    };

    fetchUserData().then(userData => {
      if (userData && userData.uid) {
        fetchSensorData(userData.uid);
        fetchPredData(userData.uid);
      }
    });
  }, [fetchSensorData, fetchPredData]); // Add fetchPredData to the dependency array

  // Second useEffect to fetch data when days changes
  useEffect(() => {
    if (user && user.uid) {
      fetchSensorData(user.uid);
      fetchPredData(user.uid);
    }
  }, [days, user, fetchSensorData, fetchPredData]);

  const handleHomeClick = () => {
    navigate('/mainpage');
    if (windowWidth < 768) setSidebarOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    if (windowWidth < 768) setSidebarOpen(false);
  };

  const handleSwitchAdmin = () => {
    navigate('/admin');
    if (windowWidth < 768) setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Get consistent icon size based on screen size
  const getIconSize = () => {
    return windowWidth < 480 ? 18 : 22;
  };

  // Close sidebar when clicking outside (for mobile)
  const handleOverlayClick = () => {
    if (windowWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Handle time range change
  const handleDaysChange = (newDays) => {
    setDays(newDays);
  };

  // Get color based on health status
  const getStatusColor = (statusData) => {
    const lastStatus = statusData && statusData.length > 0 ? 
      statusData[statusData.length - 1].status : null;
    
    switch(lastStatus) {
      case 'Normal':
        return '#34A853';
      case 'Attention':
        return '#FBBC05';
      case 'Warning':
        return '#EA4335';
      default:
        return '#4285F4';
    }
  };

  return (
    <div className="charts-container">
      {/* Overlay for mobile sidebar */}
      {windowWidth < 768 && (
        <div 
          className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} 
          onClick={handleOverlayClick}
        />
      )}
      
      {/* Menu toggle button */}
      {windowWidth < 768 && (
        <div className="menu-toggle" onClick={toggleSidebar}>
          {sidebarOpen ? (
            <FaTimes className="toggle-icon" size={getIconSize()} />
          ) : (
            <FaBars className="toggle-icon" size={getIconSize()} />
          )}
        </div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {windowWidth >= 768 && (
          <div className="menu-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? (
              <FaTimes className="toggle-icon" size={getIconSize()} />
            ) : (
              <FaBars className="toggle-icon" size={getIconSize()} />
            )}
          </div>
        )}

        <div className="sidebar-icons">
          <div className="sidebar-icon" onClick={handleHomeClick}>
            <Home className="icon" size={getIconSize()} />
            <span className="icon-text">Home</span>
          </div>
          <div className="sidebar-icon active">
            <FaChartBar className="icon" size={getIconSize()} />
            <span className="icon-text">Charts</span>
          </div>
          <div className="sidebar-icon" onClick={handleProfileClick}>
            <FaUser className="icon" size={getIconSize()} />
            <span className="icon-text">Profile</span>
          </div>
          <div className="sidebar-admin" onClick={handleSwitchAdmin}>
            <FaCog className="icon" size={getIconSize()} />
            <span className="icon-text">Admin</span>
          </div>
        </div>
      </div>
      
      <div className="charts-content">
        <div className="charts-header">
          <h2>Health Monitoring Charts</h2>
          <div className="time-selector">
            <button 
              className={days === 1 ? 'active' : ''} 
              onClick={() => handleDaysChange(1)}
            >
              24 Hours
            </button>
            <button 
              className={days === 7 ? 'active' : ''} 
              onClick={() => handleDaysChange(7)}
            >
              7 Days
            </button>
            <button 
              className={days === 30 ? 'active' : ''} 
              onClick={() => handleDaysChange(30)}
            >
              30 Days
            </button>
            <button 
              className={days === 0 ? 'active' : ''} 
              onClick={() => handleDaysChange(0)}
              disabled={loading}
            >
              All Data
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-indicator">Loading data...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Body Temperature (°C)</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={temperatureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={getStatusColor(temperatureData)} 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="chart-card">
              <h3>Heart Rate (BPM)</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={heartRateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={getStatusColor(heartRateData)} 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="chart-card">
              <h3>Humidity (%)</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={humidityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={getStatusColor(humidityData)} 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="chart-card">
              <h3>ECG</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ecgData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={getStatusColor(ecgData)} 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
                
            <div className="chart-card">
              <h3>Health Prediction Score</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={getStatusColor(predData)} 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Add a status summary component */}
        {!loading && !error && (
          <div className="status-summary">
            <h3>Status Summary</h3>
            <div className="status-indicators">
              {temperatureData.length > 0 && (
                <div className={`status-indicator ${temperatureData[temperatureData.length-1].status?.toLowerCase() || 'normal'}`}>
                  <span className="status-label">Temperature:</span>
                  <span className="status-value">{temperatureData[temperatureData.length-1].value} °C</span>
                  <span className="status-text">{temperatureData[temperatureData.length-1].status || 'Normal'}</span>
                </div>
              )}
              {heartRateData.length > 0 && (
                <div className={`status-indicator ${heartRateData[heartRateData.length-1].status?.toLowerCase() || 'normal'}`}>
                  <span className="status-label">Heart Rate:</span>
                  <span className="status-value">{heartRateData[heartRateData.length-1].value} BPM</span>
                  <span className="status-text">{heartRateData[heartRateData.length-1].status || 'Normal'}</span>
                </div>
              )}
              {predData.length > 0 && (
                <div className={`status-indicator ${predData[predData.length-1].status?.toLowerCase() || 'normal'}`}>
                  <span className="status-label">Health Score:</span>
                  <span className="status-value">{predData[predData.length-1].value.toFixed(1)}</span>
                  <span className="status-text">{predData[predData.length-1].status || 'Normal'}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthCharts;