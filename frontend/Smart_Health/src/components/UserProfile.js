// import React, { useState ,useEffect} from 'react';
// import './UserProfile.css';
// import { useNavigate } from 'react-router-dom';
// import illustration from "./illustration.png";
// import { userAPI } from './api';
// import { FaHome, FaChartBar, FaUser, FaCog, FaBars, FaTimes } from 'react-icons/fa';

// const UserProfile = () => {
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
  
//   const handlePasswordChange = (e) => {
//     e.preventDefault();
//     if (newPassword === confirmPassword && newPassword !== '') {
//       alert('Password changed successfully!');
//       setNewPassword('');
//       setConfirmPassword('');
//     } else {
//       alert('Passwords do not match or are empty!');
//     }
//   };
  
//   return (
//     <div className="profile-container">
//       <div className="sidebar">
//         <div className="menu-icon">
//           <div className="menu-line"></div>
//           <div className="menu-line"></div>
//           <div className="menu-line"></div>
//         </div>
        
//         <div className="sidebar-icons">
//           <div className="sidebar-icon">
//             <i className="icon-home"></i>
//           </div>
//           <div className="sidebar-icon">
//             <i className="icon-chart"></i>
//           </div>
//           <div className="sidebar-icon active">
//             <i className="icon-user"></i>
//           </div>
//         </div>
//       </div>
      
//       <div className="main-content">
//         <div className="profile-header">
//         <div>
//   <img
//     src={illustration}
//     alt="Profile"
//     className="profile-img"
//   />
// </div>
//           <h2 className="welcome-text">Welcome, Amogh</h2>
//         </div>
        
//         <div className="profile-sections">
//           <div className="personal-info-section">
//             <h3>Personal Information</h3>
            
//             <div className="info-field">
//               <label>Name</label>
//               <div className="input-field">Amogha k</div>
//             </div>
            
//             <div className="info-field">
//               <label>DOB</label>
//               <div className="input-field">03/08/2003</div>
//             </div>
            
//             <div className="info-field">
//               <label>Height</label>
//               <div className="input-field">5'9"</div>
//             </div>
            
//             <div className="info-field">
//               <label>Weight</label>
//               <div className="input-field">49 kg</div>
//             </div>
            
//             <div className="info-field">
//               <label>Email</label>
//               <div className="input-field">amoghak2003@gmail.com</div>
//             </div>
            
//             <div className="info-field">
//               <label>Phone</label>
//               <div className="input-field">+91 80881 20220</div>
//             </div>
            
//             <div className="info-field">
//               <label>Blood Type</label>
//               <div className="input-field"> O+</div>
//             </div>
//           </div>
          
//           <div className="password-section">
//             <h3>Password</h3>
            
//             <div className="password-info">
//               <p>Last changed: 2 months ago</p>
//               <div className="password-dots">
//                 {Array(10).fill(<span className="dot"></span>)}
//               </div>
//             </div>
            
//             <div className="change-password">
//               <h4>Change Password</h4>
//               <form onSubmit={handlePasswordChange}>
//                 <input
//                   type="password"
//                   placeholder="New password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                 />
//                 <input
//                   type="password"
//                   placeholder="Confirm password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                 />
//                 <button type="submit">Update Password</button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;

import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import { useNavigate } from 'react-router-dom';
import illustration from "./illustration.png";
import { FaChartBar, FaUser, FaCog, FaBars, FaTimes } from 'react-icons/fa';
import { Home } from 'lucide-react';
import { userAPI, deviceAPI,authAPI } from './api';

const UserProfile = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [channelId, setChannelId] = useState('');
  const [readAPIKey, setReadAPIKey] = useState('');
  const [deviceId, setDeviceId] = useState('');
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

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await userAPI.getCurrentUser();
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Set fallback user data for demo purposes
        setUser({
          full_name: 'Amogha k',
          dob: '2003-08-03',
          height: 175, // 5'9" in cm
          weight: 49,
          email: 'amoghak2003@gmail.com',
          phno: '+91 80881 20220',
          blood_group: 'O+'
        });
      }
    };

    fetchUserData();
  }, []);
  
  // password change
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword && newPassword !== '') {
      alert('Password changed successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      alert('Passwords do not match or are empty!');
    }
  };

  // Assign Device
  const handleAssignDevice = async (e) => {
    e.preventDefault();
    if (!deviceId || !user) {
      alert('Please enter a Channel ID!');
      return;
    }
    
    try {
      await userAPI.assignDevice(user.uid, deviceId);
      alert('Device assigned successfully!');
      setDeviceId('');
    } catch (error) {
      console.error('Failed to assign device:', error);
      alert('Failed to assign device. Please try again.');
    }
  };

  // Create Device
  const handleCreateDevice = async (e) => {
    e.preventDefault();
    try {
      const deviceData = {};

      if (channelId) {
        deviceData.thingspeak_channel_id = channelId;
      }

      if (readAPIKey) {
        deviceData.thingspeak_read_api_key = readAPIKey;
      }
      const response = await deviceAPI.createDevice(deviceData);
      alert(`Device created successfully! Device ID: ${response.thingspeak_channel_id}`);
      setChannelId('');
      setReadAPIKey('');
    } catch (error) {
      console.error('Failed to create device:', error);
      alert('Failed to create device. Please try again.');
    }
  };

  // logout
  const handleLogout = async (e) => {
    e.preventDefault();
        try {
          const response = await authAPI.logout();
          //local store to save token
          localStorage.setItem("access_token", response.data.access_token);
          console.log("logout successful, token:", response.data.access_token);
    
          // redirect to login
          navigate("/");
        } catch (err) {
          console.error("Failed to out: ", err);
        }
  };
    
  const handleHomeClick = () => {
    navigate('/mainpage');
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
    <div className="profile-container">
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
          <div className="sidebar-icon" onClick={handleChartClick}>
            <FaChartBar className="icon" size={getIconSize()} />
            <span className="icon-text">Charts</span>
          </div>
          <div className="sidebar-icon active">
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
        <div className="profile-header">
          <div className="profile-picture">
            <img 
              src={illustration}  
              alt="Profile" 
              className="profile-img"
            />
          </div>
          <h2 className="welcome-text">Welcome, {user ? user.full_name : 'User'}</h2>
        </div>
        
        <div className="profile-sections">
          <div className="personal-info-section">
            <h3>Personal Information</h3>
            
            <div className="info-field">
              <label>Name</label>
              <div className="input-field">{user ? user.full_name : 'Loading...'}</div>
            </div>
            
            <div className="info-field">
              <label>DOB</label>
              <div className="input-field">{user ? formatDate(user.dob) : 'Loading...'}</div>
            </div>
            
            <div className="info-field">
              <label>Height</label>
              <div className="input-field">{user ? formatHeight(user.height) : 'Loading...'}</div>
            </div>
            
            <div className="info-field">
              <label>Weight</label>
              <div className="input-field">{user ? `${user.weight} kg` : 'Loading...'}</div>
            </div>
            
            <div className="info-field">
              <label>Email</label>
              <div className="input-field">{user ? user.email : 'Loading...'}</div>
            </div>
            
            <div className="info-field">
              <label>Phone</label>
              <div className="input-field">{user ? user.phno : 'Loading...'}</div>
            </div>
            
            <div className="info-field">
              <label>Blood Type</label>
              <div className="input-field">{user ? user.blood_group : 'Loading...'}</div>
            </div>
            <div>
              <form onSubmit={handleLogout}>
                <button type="submit" className="logout-button">Logout</button>
              </form>
            </div>
          </div>

          <div className="password-section">
            <h3>Account Management</h3>
            
            <div className="change-password">
              <h4>Change Password</h4>
              <form onSubmit={handlePasswordChange}>
                <input 
                  type="password" 
                  placeholder="New password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input 
                  type="password" 
                  placeholder="Confirm password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit" className="password-button">Update Password</button>
              </form>
            </div>
            
            <div className="device-section">
              <h4>Assign Device</h4>
              <form onSubmit={handleAssignDevice}>
                <input 
                  type="text" 
                  placeholder="Channel ID" 
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                />
                <button type="submit" className="device-button">Assign Device</button>
              </form>
            </div>
            
            <div className="device-section">
              <h4>Create Device</h4>
              <form onSubmit={handleCreateDevice}>
                <input 
                  type="text" 
                  placeholder="Channel Id" 
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="Read API key" 
                  value={readAPIKey}
                  onChange={(e) => setReadAPIKey(e.target.value)}
                />
                <button type="submit" className="device-button">Create Device</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format date from YYYY-MM-DD to MM/DD/YYYY
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
};

// Helper function to format height from cm to feet and inches
const formatHeight = (heightInCm) => {
  if (!heightInCm) return '';
  
  // Convert cm to inches
  const inches = heightInCm / 2.54;
  
  // Calculate feet and remaining inches
  const feet = Math.floor(inches / 12);
  const remainingInches = Math.round(inches % 12);
  
  return `${feet}'${remainingInches}"`;
};

export default UserProfile;