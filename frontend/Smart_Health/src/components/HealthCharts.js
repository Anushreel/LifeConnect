// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import './HealthCharts.css';

// const HealthCharts = () => {
//   const navigate = useNavigate();
  
//   // Sample data for each graph
//   const temperatureData = [
//     { day: 'Mon', value: 36.6 },
//     { day: 'Tue', value: 36.7 },
//     { day: 'Wed', value: 36.8 },
//     { day: 'Thu', value: 36.7 },
//     { day: 'Fri', value: 36.5 },
//     { day: 'Sat', value: 36.6 },
//     { day: 'Sun', value: 36.7 },
//   ];
  
//   const oxygenData = [
//     { day: 'Mon', value: 98 },
//     { day: 'Tue', value: 97 },
//     { day: 'Wed', value: 98 },
//     { day: 'Thu', value: 99 },
//     { day: 'Fri', value: 98 },
//     { day: 'Sat', value: 97 },
//     { day: 'Sun', value: 98 },
//   ];
  
//   const heartRateData = [
//     { day: 'Mon', value: 72 },
//     { day: 'Tue', value: 75 },
//     { day: 'Wed', value: 70 },
//     { day: 'Thu', value: 74 },
//     { day: 'Fri', value: 76 },
//     { day: 'Sat', value: 73 },
//     { day: 'Sun', value: 71 },
//   ];
  
//   const humidityData = [
//     { day: 'Mon', value: 45 },
//     { day: 'Tue', value: 48 },
//     { day: 'Wed', value: 52 },
//     { day: 'Thu', value: 50 },
//     { day: 'Fri', value: 47 },
//     { day: 'Sat', value: 49 },
//     { day: 'Sun', value: 46 },
//   ];
  
//   const handleHomeClick = () => {
//     navigate('/mainpage');
//   };
  
//   const handleProfileClick = () => {
//     navigate('/profile');
//   };
  
//   return (
//     <div className="charts-container">
//       <div className="sidebar">
//         <div className="menu-icon">
//           <div className="menu-line"></div>
//           <div className="menu-line"></div>
//           <div className="menu-line"></div>
//         </div>
        
//         <div className="sidebar-icons">
//           <div className="sidebar-icon" onClick={handleHomeClick}>
//             <i className="icon-home"></i>
//           </div>
//           <div className="sidebar-icon active">
//             <i className="icon-chart"></i>
//           </div>
//           <div className="sidebar-icon" onClick={handleProfileClick}>
//             <i className="icon-user"></i>
//           </div>
//         </div>
//       </div>
      
//       <div className="charts-content">
//         <div className="charts-grid">
//           <div className="chart-card">
//             <h3>Graph of Body Temp</h3>
//             <div className="chart-container">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={temperatureData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="day" />
//                   <YAxis domain={[36, 37.5]} />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="value" stroke="#1e6b75" activeDot={{ r: 8 }} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
          
//           <div className="chart-card">
//             <h3>Graph of Oxygen Saturation</h3>
//             <div className="chart-container">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={oxygenData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="day" />
//                   <YAxis domain={[95, 100]} />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="value" stroke="#4285F4" activeDot={{ r: 8 }} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
          
//           <div className="chart-card">
//             <h3>Graph of Heart Rate</h3>
//             <div className="chart-container">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={heartRateData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="day" />
//                   <YAxis domain={[60, 85]} />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="value" stroke="#EA4335" activeDot={{ r: 8 }} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
          
//           <div className="chart-card">
//             <h3>Graph of Humidity</h3>
//             <div className="chart-container">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={humidityData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="day" />
//                   <YAxis domain={[40, 60]} />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="value" stroke="#34A853" activeDot={{ r: 8 }} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HealthCharts;

import React, { useState, useEffect,useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaChartBar, FaUser, FaCog, FaBars, FaTimes } from 'react-icons/fa';
import './HealthCharts.css';
import { sensorAPI, userAPI } from './api';
import { Home } from 'lucide-react';

const HealthCharts = () => {
  const navigate = useNavigate();
  const [temperatureData, setTemperatureData] = useState([]);
  const [heartRateData, setHeartRateData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [ecgData, setEcgData] = useState([]);
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
  },[]);
    
  // Fetch sensor data
  const fetchSensorData = useCallback(async (userId) => {
    setLoading(true);
    console.log('Fetching sensor data with days:', days);
    try {
      // if (days === 0) {
      //   response = await sensorAPI.getAllReadingsForUser(userId);
      // }
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
  }, [days, processChartData]);;

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
      }
    });
  }, [fetchSensorData]); // Add fetchSensorData to the dependency array

  // Second useEffect (around line 297)
  useEffect(() => {
    if (user && user.uid) {
      fetchSensorData(user.uid);
    }
  }, [days, user, fetchSensorData]);

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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthCharts;