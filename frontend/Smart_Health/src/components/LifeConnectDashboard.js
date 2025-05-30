// import React, { useState, useEffect } from 'react';
// import './LifeConnectDashboard.css';
// import { useNavigate } from 'react-router-dom';
// import docwithlaptop from "./docwithlaptop.png";
// import illustration from "./illustration.png";
// import { userAPI, sensorAPI, predictionAPI } from './api';
// import { format, getDaysInMonth, startOfMonth, getDay } from 'date-fns';
// import { FaChartBar, FaUser, FaCog, FaBars, FaTimes } from 'react-icons/fa';
// import { Home } from 'lucide-react';
// import TaskCalendar from './TaskCalendar'; // Import the TaskCalendar component

// const HealthDashboard = () => {
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date().getDate());
//   const [user, setUser] = useState(null);
//   const [reading, setSensorData] = useState([]);
//   const [pred, setPredictionData] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const navigate = useNavigate();

//   // Handle window resize for responsive behavior
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
      
//       // Auto-close sidebar on small screens when resizing
//       if (window.innerWidth < 768) {
//         setSidebarOpen(false);
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Calculate age from dob
//   const calculateAge = (dob) => {
//     if (!dob) return '';
    
//     const birthDate = new Date(dob);
//     const today = new Date();
  
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();
  
//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//       age--;
//     }
  
//     return age;
//   };
  
//   // Calculate bmi
//   const bmiCal = (height, weight) => {
//     if (!height || !weight) return '-';
//     let bmi = weight / ((height / 100) ** 2);
//     return bmi.toFixed(1);
//   };

//   // Fetch user data
//   useEffect(() => {
//     const fetchUserDataAndSensorData = async () => {
//       try {
//         // Fetch current user data
//         const userResponse = await userAPI.getCurrentUser();
//         setUser(userResponse.data);
    
//         const userId = userResponse.data.uid;
    
//         // Fetch sensor data for user
//         const sensorResponse = await sensorAPI.getReadingsForUser(userId, 1);
        
//         // Check if the response contains data and it's an array with at least one reading
//         if (sensorResponse.data && Array.isArray(sensorResponse.data) && sensorResponse.data.length > 0) {
//           // Set the most recent reading (first item in the array)
//           setSensorData(sensorResponse.data[0]);
//           console.log('Most recent reading:', sensorResponse.data[0]);
//         } else {
//           console.log('No sensor readings available');
//           setSensorData(null); // Ensure we have a defined state even if empty
//         }
    
//         // Fetch health summary separately
//         const prediction = await predictionAPI.getHealthSummaryForUser(userId);
//         setPredictionData(prediction.data);
//         console.log('Health Summary:', prediction.data);
        
//       } catch (error) {
//         console.error('Failed to fetch user or sensor data:', error);
//       }
//     };
    
//     fetchUserDataAndSensorData();
//   }, []);

//   const handleProfileClick = () => {
//     navigate('/profile');
//     if (windowWidth < 768) setSidebarOpen(false);
//   };

//   const handleChartClick = () => {
//     navigate('/charts');
//     if (windowWidth < 768) setSidebarOpen(false);
//   };

//   const handleSwitchAdmin = () => {
//     navigate('/admin');
//     if (windowWidth < 768) setSidebarOpen(false);
//   };

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   // Get consistent icon size based on screen size
//   const getIconSize = () => {
//     return windowWidth < 480 ? 18 : 22;
//   };

//   // Close sidebar when clicking outside (for mobile)
//   const handleOverlayClick = () => {
//     if (windowWidth < 768) {
//       setSidebarOpen(false);
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       {/* Overlay for mobile sidebar */}
//       {windowWidth < 768 && (
//         <div
//           className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
//           onClick={handleOverlayClick}
//         />
//       )}
      
//       {/* Menu toggle button */}
//       {windowWidth < 768 && (
//         <div className="menu-toggle" onClick={toggleSidebar}>
//           {sidebarOpen ? (
//             <FaTimes className="toggle-icon" size={getIconSize()} />
//           ) : (
//             <FaBars className="toggle-icon" size={getIconSize()} />
//           )}
//         </div>
//       )}

//       {/* Sidebar */}
//       <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
//         {windowWidth >= 768 && (
//           <div className="menu-toggle" onClick={toggleSidebar}>
//             {sidebarOpen ? (
//               <FaTimes className="toggle-icon" size={getIconSize()} />
//             ) : (
//               <FaBars className="toggle-icon" size={getIconSize()} />
//             )}
//           </div>
//         )}

//         <div className="sidebar-icons">
//           <div className="sidebar-icon active">
//             <Home className="icon" size={getIconSize()} />
//             <span className="icon-text">Home</span>
//           </div>
//           <div className="sidebar-icon" onClick={handleChartClick}>
//             <FaChartBar className="icon" size={getIconSize()} />
//             <span className="icon-text">Charts</span>
//           </div>
//           <div className="sidebar-icon" onClick={handleProfileClick}>
//             <FaUser className="icon" size={getIconSize()} />
//             <span className="icon-text">Profile</span>
//           </div>
//           <div className="sidebar-admin" onClick={handleSwitchAdmin}>
//             <FaCog className="icon" size={getIconSize()} />
//             <span className="icon-text">Admin</span>
//           </div>
//         </div>
//       </div>

//       <div className="main-content">
//         <div className="header">
//           <div className="logo">LifeConnect</div>
//         </div>

//         <div className="welcome-card">
//           <div className="welcome-text">
//             <h1>Hello, {user ? user.full_name : 'User'}</h1>
//             <p>better health, better life</p>
//           </div>
//           <div className="welcome-illustration">
//             <img
//               src={docwithlaptop}
//               alt="Healthcare professional"
//               style={{ maxWidth: "160px", height: "auto", width: "100%" }}
//             />
//           </div>
//         </div>

//         <div className="metrics-grid">
//           <div className="metric-card">
//             <h3>Heart Rate</h3>
//             <h4>{reading && reading.heart_rate !== undefined ? `${reading.heart_rate} bpm` : 'N/A'}</h4>
//           </div>

//           <div className="metric-card">
//             <h3>Temperature</h3>
//             <h4>{reading && reading.temperature !== undefined ? `${reading.temperature} °C` : 'N/A'}</h4>
//           </div>

//           <div className="metric-card">
//             <h3>ECG</h3>
//             <h4>{reading && reading.ecg !== undefined ? `${reading.ecg} %` : 'N/A'}</h4>
//           </div>

//           <div className="metric-card">
//             <h3>Humidity</h3>
//             <h4>{reading && reading.humidity !== undefined ? `${reading.humidity} %` : 'N/A'}</h4>
//           </div>

//           <div className="metric-card health-score">
//             <h3>Overall Health Score</h3>
//             <div className="circular-progress">
//               <div className="percentage">{pred ? `${pred.health_percentage || 'N/A'} %` : 'N/A'}</div>
//             </div>
//             <div className="percentage">{pred ? (pred.health_status || pred.latest_status || 'N/A') : 'N/A'}</div>
//           </div>
//         </div>
//       </div>

//       <div className="right-panel">
//         <div className="profile-section">
//           <div className="profile-picture" onClick={handleProfileClick}>
//             <img src={illustration} alt="Profile" className="profile-img" />
//           </div>
//           <div className="profile-name">{user ? user.full_name : 'User'}</div>
//           <div className="profile-age">{user && user.dob ? `${calculateAge(user.dob)} years` : 'Age'}</div>

//           <div className="profile-stats">
//             <div className="stat-box">
//               <span className="stat-label">Height</span>
//               <span className="stat-value">
//                 {user && user.height ?
//                   `${(user.height / 30.48).toFixed(1)} ft` :
//                   '-'}
//               </span>
//             </div>
//             <div className="stat-box">
//               <span className="stat-label">Weight</span>
//               <span className="stat-value">{user && user.weight ? `${user.weight} kg` : '-'}</span>
//             </div>
//             <div className="stat-box">
//               <span className="stat-label">BMI</span>
//               <span className="stat-value">{user ? bmiCal(user.height, user.weight) : '-'}</span>
//             </div>
//           </div>
//         </div>

//         {/* Replace calendar with TaskCalendar component */}
//         {user && <TaskCalendar userId={user.uid} />}
//       </div>
//     </div>
//   );
// };
// export default HealthDashboard;

import React, { useState, useEffect } from 'react';
import './LifeConnectDashboard.css';
import { useNavigate } from 'react-router-dom';
import docwithlaptop from "./docwithlaptop.png"; 
import illustration from "./illustration.png";
import { userAPI, sensorAPI, predictionAPI } from './api'; 
import { format, getDaysInMonth, startOfMonth, getDay } from 'date-fns';
import { FaChartBar, FaUser, FaCog, FaBars, FaTimes } from 'react-icons/fa';
import { Home } from 'lucide-react';
import TaskCalendar from './TaskCalendar'; // Import the TaskCalendar component
import NotificationSystem from './NotificationSystem'; // Import the NotificationSystem component

const HealthDashboard = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [user, setUser] = useState(null);
  const [reading, setSensorData] = useState([]);
  const [pred, setPredictionData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

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

  // Calculate age from dob
  const calculateAge = (dob) => {
    if (!dob) return '';
    
    const birthDate = new Date(dob);
    const today = new Date();
  
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
  
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  };
  
  // Calculate bmi
  const bmiCal = (height, weight) => {
    if (!height || !weight) return '-';
    let bmi = weight / ((height / 100) ** 2);
    return bmi.toFixed(1);
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserDataAndSensorData = async () => {
      try {
        // Fetch current user data
        const userResponse = await userAPI.getCurrentUser();
        setUser(userResponse.data);
    
        const userId = userResponse.data.uid; 
    
        // Fetch sensor data for user
        const sensorResponse = await sensorAPI.getReadingsForUser(userId, 1); 
        
        // Check if the response contains data and it's an array with at least one reading
        if (sensorResponse.data && Array.isArray(sensorResponse.data) && sensorResponse.data.length > 0) {
          // Set the most recent reading (first item in the array)
          setSensorData(sensorResponse.data[0]);
          console.log('Most recent reading:', sensorResponse.data[0]);
        } else {
          console.log('No sensor readings available');
          setSensorData(null); // Ensure we have a defined state even if empty
        }
    
        // Fetch health summary separately
        const prediction = await predictionAPI.getHealthSummaryForUser(userId); 
        setPredictionData(prediction.data);
        console.log('Health Summary:', prediction.data);
        
      } catch (error) {
        console.error('Failed to fetch user or sensor data:', error);
      }
    };
    
    fetchUserDataAndSensorData();
  }, []);

  const handleProfileClick = () => {
    navigate('/profile');
    if (windowWidth < 768) setSidebarOpen(false);
  };

  const handleChartClick = () => {
    navigate('/charts');
    if (windowWidth < 768) setSidebarOpen(false);
  };

  const handleSwitchAdmin = () => {
    navigate('/admin');
    if (windowWidth < 768) setSidebarOpen(false);
  };
  
  const handleNotificationsClick = () => {
    navigate('/notifications');
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

  return (
    <div className="dashboard-container">
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
          <div className="sidebar-icon active">
            <Home className="icon" size={getIconSize()} />
            <span className="icon-text">Home</span>
          </div>
          <div className="sidebar-icon" onClick={handleChartClick}>
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

      <div className="main-content">
        <div className="header">
          <div className="logo">LifeConnect</div>
          {/* Add NotificationSystem component to header */}
          <div className="header-actions">
            <NotificationSystem 
              userId={user?.uid} 
              isAdmin={false} 
            />
          </div>
        </div>

        <div className="welcome-card">
          <div className="welcome-text">
            <h1>Hello, {user ? user.full_name : 'User'}</h1>
            <p>better health, better life</p>
          </div>
          <div className="welcome-illustration">
            <img 
              src={docwithlaptop} 
              alt="Healthcare professional" 
              style={{ maxWidth: "160px", height: "auto", width: "100%" }} 
            />
          </div>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <h3>Heart Rate</h3>
            <h4>{reading && reading.heart_rate !== undefined ? `${reading.heart_rate} bpm` : 'N/A'}</h4>
          </div>

          <div className="metric-card">
            <h3>Temperature</h3>
            <h4>{reading && reading.temperature !== undefined ? `${reading.temperature} °C` : 'N/A'}</h4>
          </div>

          <div className="metric-card">
            <h3>ECG</h3>
            <h4>{reading && reading.ecg !== undefined ? `${reading.ecg} %` : 'N/A'}</h4>
          </div>

          <div className="metric-card">
            <h3>Humidity</h3>
            <h4>{reading && reading.humidity !== undefined ? `${reading.humidity} %` : 'N/A'}</h4>
          </div>

          <div className="metric-card health-score">
            <h3>Overall Health Score</h3>
            <div className="circular-progress">
              <div className="percentage">{pred ? `${pred.health_percentage || 'N/A'} %` : 'N/A'}</div>
            </div>
            <div className="percentage">{pred ? (pred.health_status || pred.latest_status || 'N/A') : 'N/A'}</div>
          </div>
        </div>
      </div>

      <div className="right-panel">
        <div className="profile-section">
          <div className="profile-picture" onClick={handleProfileClick}>
            <img src={illustration} alt="Profile" className="profile-img" />
          </div>
          <div className="profile-name">{user ? user.full_name : 'User'}</div>
          <div className="profile-age">{user && user.dob ? `${calculateAge(user.dob)} years` : 'Age'}</div>

          <div className="profile-stats">
            <div className="stat-box">
              <span className="stat-label">Height</span>
              <span className="stat-value">
                {user && user.height ? 
                  `${(user.height / 30.48).toFixed(1)} ft` : 
                  '-'}
              </span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Weight</span>
              <span className="stat-value">{user && user.weight ? `${user.weight} kg` : '-'}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">BMI</span>
              <span className="stat-value">{user ? bmiCal(user.height, user.weight) : '-'}</span>
            </div>
          </div>
        </div>

        {/* Replace calendar with TaskCalendar component */}
        {user && <TaskCalendar userId={user.uid} />}
      </div>
    </div>
  );
};

export default HealthDashboard;