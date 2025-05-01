// import React, { useState } from 'react';
// import './EmployeeManagement.css';
// import { Home, BarChart2, User, Users, Settings, Search, Plus } from 'lucide-react';

// const EmployeeManagement = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [employees, setEmployees] = useState([
//     { id: 'EMP001', name: 'John Doe', department: 'Engineering', healthStatus: 'Good', healthNotes: 'Annual checkup completed' },
//     { id: 'EMP002', name: 'Jane Smith', department: 'Marketing', healthStatus: 'Attention Needed', healthNotes: 'On medical leave until 15th' },
//     { id: 'EMP003', name: 'Robert Johnson', department: 'Finance', healthStatus: 'Critical', healthNotes: 'Hospitalized - heart condition' },
//     { id: 'EMP004', name: 'Emily Davis', department: 'Human Resources', healthStatus: 'Good', healthNotes: 'All vaccinations up to date' },
//   ]);
  
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
  
//   const handleSearch = () => {
//     // Implementation for search functionality would go here
//     console.log(`Searching for: ${searchQuery}`);
//   };
  
//   const handleEmployeeSelect = (employee) => {
//     setSelectedEmployee(employee);
//   };
  
//   const getHealthStatusColor = (status) => {
//     switch(status.toLowerCase()) {
//       case 'good':
//         return 'health-status-good';
//       case 'attention needed':
//         return 'health-status-attention';
//       case 'critical':
//         return 'health-status-critical';
//       default:
//         return '';
//     }
//   };
  
//   return (
//     <div className="container">
//       <div className="sidebar">
//         <Home className="sidebar-icon" />
//         <BarChart2 className="sidebar-icon" />
//         <User className="sidebar-icon active" />
//         <Users className="sidebar-icon" />
//         <Settings className="sidebar-icon" />
//       </div>
      
//       <div className="main-content">
//         <div className="search-container">
//           <input
//             type="text"
//             className="search-input"
//             placeholder="Search employee name"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <button className="search-button" onClick={handleSearch}>
//             <Search size={16} />
//             Search
//           </button>
//         </div>
        
//         <div className="content-area">
//           <div className="employee-list">
//             <div className="list-header">
//               <h2>Employees</h2>
//               <button className="add-button">
//                 <Plus size={16} />
//                 Add New
//               </button>
//             </div>
            
//             <div className="employee-cards">
//               {employees.map(emp => (
//                 <div
//                   key={emp.id}
//                   className={`employee-card ${selectedEmployee && selectedEmployee.id === emp.id ? 'selected' : ''}`}
//                   onClick={() => handleEmployeeSelect(emp)}
//                 >
//                   <div className="employee-avatar">
//                     {emp.name.charAt(0)}
//                   </div>
//                   <div className="employee-info">
//                     <h3>{emp.name}</h3>
//                     <p className="employee-id">{emp.id}</p>
//                     <p className="employee-department">{emp.department}</p>
//                     <div className={`health-status ${getHealthStatusColor(emp.healthStatus)}`}>
//                       {emp.healthStatus}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           {selectedEmployee && (
//             <div className="employee-details">
//               <h2>Employee Details</h2>
//               <div className="details-card">
//                 <div className="details-header">
//                   <div className="large-avatar">
//                     {selectedEmployee.name.charAt(0)}
//                   </div>
//                   <div>
//                     <h3>{selectedEmployee.name}</h3>
//                     <p>{selectedEmployee.id}</p>
//                     <p>{selectedEmployee.department}</p>
//                   </div>
//                 </div>
                
//                 <div className="health-section">
//                   <h4>Health Information</h4>
//                   <div className={`health-badge ${getHealthStatusColor(selectedEmployee.healthStatus)}`}>
//                     {selectedEmployee.healthStatus}
//                   </div>
//                   <p className="health-notes">{selectedEmployee.healthNotes}</p>
                  
//                   <div className="health-history">
//                     <h4>Recent Health Records</h4>
//                     <div className="record-item">
//                       <div className="record-date">Feb 15, 2025</div>
//                       <div className="record-desc">Annual physical examination</div>
//                     </div>
//                     <div className="record-item">
//                       <div className="record-date">Jan 10, 2025</div>
//                       <div className="record-desc">Vaccination update</div>
//                     </div>
//                     <div className="record-item">
//                       <div className="record-date">Nov 05, 2024</div>
//                       <div className="record-desc">Sick leave - influenza</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeManagement;
// import React, { useState, useEffect } from 'react';
// import './EmployeeManagement.css';
// import { Home, BarChart2, User, Users, Settings, Search, Plus } from 'lucide-react';

// const EmployeeManagement = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [employees, setEmployees] = useState([
//     { id: 'EMP001', name: 'John Doe', department: 'Engineering', healthStatus: 'Good', healthNotes: 'Annual checkup completed' },
//     { id: 'EMP002', name: 'Jane Smith', department: 'Marketing', healthStatus: 'Attention Needed', healthNotes: 'On medical leave until 15th' },
//     { id: 'EMP003', name: 'Robert Johnson', department: 'Finance', healthStatus: 'Critical', healthNotes: 'Hospitalized - heart condition' },
//     { id: 'EMP004', name: 'Emily Davis', department: 'Human Resources', healthStatus: 'Good', healthNotes: 'All vaccinations up to date' },
//   ]);
  
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
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
  
//   const handleSearch = () => {
//     // Implementation for search functionality would go here
//     console.log(`Searching for: ${searchQuery}`);
//   };
  
//   const handleEmployeeSelect = (employee) => {
//     setSelectedEmployee(employee);
//   };
  
//   const getHealthStatusColor = (status) => {
//     switch(status.toLowerCase()) {
//       case 'good':
//         return 'health-status-good';
//       case 'attention needed':
//         return 'health-status-attention';
//       case 'critical':
//         return 'health-status-critical';
//       default:
//         return '';
//     }
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
//     <div className="container">
//       {/* Overlay for mobile sidebar */}
//       {windowWidth < 768 && (
//         <div
//           className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
//           onClick={handleOverlayClick}
//         />
//       )}
      
//       {/* Menu toggle button for mobile */}
//       {windowWidth < 768 && (
//         <div className="menu-toggle" onClick={toggleSidebar}>
//           {sidebarOpen ? (
//             <Settings className="toggle-icon" size={getIconSize()} />
//           ) : (
//             <Settings className="toggle-icon" size={getIconSize()} />
//           )}
//         </div>
//       )}

//       {/* Sidebar */}
//       <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
//         {windowWidth >= 768 && (
//           <div className="menu-toggle" onClick={toggleSidebar}>
//             {sidebarOpen ? (
//               <Settings className="toggle-icon" size={getIconSize()} />
//             ) : (
//               <Settings className="toggle-icon" size={getIconSize()} />
//             )}
//           </div>
//         )}

//         <div className="sidebar-icons">
//           <div className="sidebar-icon">
//             <Home className="icon" size={getIconSize()} />
//             <span className="icon-text">Home</span>
//           </div>
//           <div className="sidebar-icon">
//             <BarChart2 className="icon" size={getIconSize()} />
//             <span className="icon-text">Dashboard</span>
//           </div>
//           <div className="sidebar-icon">
//             <User className="icon" size={getIconSize()} />
//             <span className="icon-text">Profile</span>
//           </div>
//           <div className="sidebar-icon active">
//             <Users className="icon" size={getIconSize()} />
//             <span className="icon-text">Employees</span>
//           </div>
//           <div className="sidebar-admin">
//             <Settings className="icon" size={getIconSize()} />
//             <span className="icon-text">Settings</span>
//           </div>
//         </div>
//       </div>
      
//       <div className="main-content">
//         <div className="search-container">
//           <input
//             type="text"
//             className="search-input"
//             placeholder="Search employee name"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <button className="search-button" onClick={handleSearch}>
//             <Search size={16} />
//             Search
//           </button>
//         </div>
        
//         <div className="content-area">
//           <div className="employee-list">
//             <div className="list-header">
//               <h2>Employees</h2>
//               <button className="add-button">
//                 <Plus size={16} />
//                 Add New
//               </button>
//             </div>
            
//             <div className="employee-cards">
//               {employees.map(emp => (
//                 <div
//                   key={emp.id}
//                   className={`employee-card ${selectedEmployee && selectedEmployee.id === emp.id ? 'selected' : ''}`}
//                   onClick={() => handleEmployeeSelect(emp)}
//                 >
//                   <div className="employee-avatar">
//                     {emp.name.charAt(0)}
//                   </div>
//                   <div className="employee-info">
//                     <h3>{emp.name}</h3>
//                     <p className="employee-id">{emp.id}</p>
//                     <p className="employee-department">{emp.department}</p>
//                     <div className={`health-status ${getHealthStatusColor(emp.healthStatus)}`}>
//                       {emp.healthStatus}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           {selectedEmployee && (
//             <div className="employee-details">
//               <h2>Employee Details</h2>
//               <div className="details-card">
//                 <div className="details-header">
//                   <div className="large-avatar">
//                     {selectedEmployee.name.charAt(0)}
//                   </div>
//                   <div>
//                     <h3>{selectedEmployee.name}</h3>
//                     <p>{selectedEmployee.id}</p>
//                     <p>{selectedEmployee.department}</p>
//                   </div>
//                 </div>
                
//                 <div className="health-section">
//                   <h4>Health Information</h4>
//                   <div className={`health-badge ${getHealthStatusColor(selectedEmployee.healthStatus)}`}>
//                     {selectedEmployee.healthStatus}
//                   </div>
//                   <p className="health-notes">{selectedEmployee.healthNotes}</p>
                  
//                   <div className="health-history">
//                     <h4>Recent Health Records</h4>
//                     <div className="record-item">
//                       <div className="record-date">Feb 15, 2025</div>
//                       <div className="record-desc">Annual physical examination</div>
//                     </div>
//                     <div className="record-item">
//                       <div className="record-date">Jan 10, 2025</div>
//                       <div className="record-desc">Vaccination update</div>
//                     </div>
//                     <div className="record-item">
//                       <div className="record-date">Nov 05, 2024</div>
//                       <div className="record-desc">Sick leave - influenza</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeManagement;

import React, { useState, useEffect } from 'react';
import { FaHome, FaChartBar, FaUser, FaCog, FaBars, FaTimes } from 'react-icons/fa';
import { Home, BarChart2, User, Users, Settings, Search, AlertTriangle, Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import { userAPI, sensorAPI, predictionAPI } from './api'; // Import your API functions

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDays, setFilterDays] = useState(7);
  const [accessDenied, setAccessDenied] = useState(false);

  // Check if user is admin on component mount
  useEffect(() => {
    // Mocked admin check - replace with your actual auth check
    const checkAdminStatus = async () => {
      try {
        // This would normally come from your auth context or API
        const userRole = localStorage.getItem('userRole') || 'user';
        const adminStatus = userRole === 'admin';
        setIsAdmin(adminStatus);
        
        if (!adminStatus) {
          setAccessDenied(true);
          setLoading(false);
        } else {
          fetchAllUsers();
        }
      } catch (err) {
        setError('Failed to authenticate user');
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAllUser();
      // For demo purposes, let's add health status to users
      const usersWithStatus = response.data.map(user => ({
        ...user,
        healthStatus: getRandomHealthStatus() // In a real app, this would come from your API
      }));
      setUsers(usersWithStatus);
      if (usersWithStatus.length > 0) {
        setSelectedUser(usersWithStatus[0]);
        fetchUserHealthData(usersWithStatus[0].id);
      }
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserHealthData = async (userId) => {
    setLoading(true);
    try {
      // Fetch sensor readings
      const sensorData = await sensorAPI.getReadingsForUser(userId, filterDays);
      
      // Fetch health predictions
      const predictionData = await predictionAPI.getHealthSummaryForUser(userId, filterDays);
      
      setHealthData({
        sensors: sensorData.data,
        predictions: predictionData.data
      });
    } catch (err) {
      setError(`Failed to fetch health data for user ${userId}`);
    } finally {
      setLoading(false);
    }
  };

  const getRandomHealthStatus = () => {
    const statuses = ['Good', 'Attention Needed', 'Critical'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchUserHealthData(user.id);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    const filteredUsers = users.filter(user => 
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.uid?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (filteredUsers.length > 0) {
      setSelectedUser(filteredUsers[0]);
      fetchUserHealthData(filteredUsers[0].uid);
    }
  };

  const updateDaysFilter = (days) => {
    setFilterDays(days);
    if (selectedUser) {
      fetchUserHealthData(selectedUser.uid);
    }
  };

  const getHealthStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'good':
        return 'health-status-good';
      case 'attention needed':
        return 'health-status-attention';
      case 'critical':
        return 'health-status-critical';
      default:
        return '';
    }
  };

  // Get consistent icon size based on screen size
  const getIconSize = () => {
    return windowWidth < 480 ? 18 : 22;
  };

  if (accessDenied) {
    return (
      <div className="access-denied">
        <AlertTriangle size={48} color="red" />
        <h2>Access Denied</h2>
        <p>You need administrator privileges to access this dashboard.</p>
        <button onClick={() => window.location.href = '/'}>
          Return to Home
        </button>
      </div>
    );
  }

  if (loading && users.length === 0) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error && users.length === 0) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container">
      {/* Overlay for mobile sidebar */}
      {windowWidth < 768 && (
        <div 
          className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} 
        />
      )}
      
      {/* Sidebar toggle button */}
        {windowWidth < 768 && (
            <div className="menu-toggle" onClick={toggleSidebar}>
                {sidebarOpen ? (
                  <FaTimes className="toggle-icon" size={getIconSize()} />
                ) : (
                  <FaBars className="toggle-icon" size={getIconSize()} />
                )}
              </div>
          )
          }
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-badge">
          <Shield size={16} />
          <span>Admin Panel</span>
        </div>

        <div className="sidebar-icons">
          <div className="sidebar-icon">
            <Home className="icon" size={getIconSize()} />
            <span className="icon-text">Home</span>
          </div>
          <div className="sidebar-icon">
            <FaChartBar className="icon" size={getIconSize()} />
            <span className="icon-text">Charts</span>
          </div>
          <div className="sidebar-icon active">
            <FaUser className="icon" size={getIconSize()} />
            <span className="icon-text">Profile</span>
          </div>
          <div className="sidebar-icon">
            <Users className="icon" size={getIconSize()} />
            <span className="icon-text">Admin</span>
          </div>
        </div>
      </div>
      
      <div className="main-content">
        <div className="admin-header">
          <h1>Admin Health Dashboard</h1>
          <div className="filter-controls">
            <span>Time range:</span>
            <button 
              className={filterDays === 7 ? 'active' : ''} 
              onClick={() => updateDaysFilter(7)}
            >
              7 days
            </button>
            <button 
              className={filterDays === 30 ? 'active' : ''} 
              onClick={() => updateDaysFilter(30)}
            >
              30 days
            </button>
            <button 
              className={filterDays === 90 ? 'active' : ''} 
              onClick={() => updateDaysFilter(90)}
            >
              90 days
            </button>
          </div>
        </div>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search user by name or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="search-button" onClick={handleSearch}>
            <Search size={16} />
            Search
          </button>
        </div>
        
        <div className="content-area">
          <div className="user-list">
            <div className="list-header">
              <h2>Users ({users.length})</h2>
              <div className="status-legend">
                <span className="legend-item">
                  <span className="status-dot health-status-good"></span> Good
                </span>
                <span className="legend-item">
                  <span className="status-dot health-status-attention"></span> Attention
                </span>
                <span className="legend-item">
                  <span className="status-dot health-status-critical"></span> Critical
                </span>
              </div>
            </div>
            
            <div className="user-cards">
              {users.map(user => (
                <div 
                  key={user.id} 
                  className={`user-card ${selectedUser && selectedUser.id === user.id ? 'selected' : ''}`}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="user-avatar">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <p className="user-id">{user.id}</p>
                    <div className={`health-status ${getHealthStatusColor(user.healthStatus)}`}>
                      {user.healthStatus}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {selectedUser && (
            <div className="user-details">
              <h2>User Health Details</h2>
              <div className="details-card">
                <div className="details-header">
                  <div className="large-avatar">
                    {selectedUser.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3>{selectedUser.name}</h3>
                    <p className="user-id">ID: {selectedUser.id}</p>
                    <div className={`health-badge ${getHealthStatusColor(selectedUser.healthStatus)}`}>
                      {selectedUser.healthStatus}
                    </div>
                  </div>
                </div>
                
                {loading ? (
                  <div className="loading-data">Loading health data...</div>
                ) : error ? (
                  <div className="error-data">{error}</div>
                ) : (
                  <div className="health-section">
                    <div className="health-summary">
                      <h4>Health Summary (Last {filterDays} days)</h4>
                      {healthData?.predictions?.summary && (
                        <p className="summary-text">{healthData.predictions.summary}</p>
                      )}
                      
                      {healthData?.predictions?.risks?.length > 0 && (
                        <div className="health-risks">
                          <h5>Identified Risks:</h5>
                          <ul>
                            {healthData.predictions.risks.map((risk, index) => (
                              <li key={index} className={`risk-item ${risk.severity.toLowerCase()}`}>
                                <AlertTriangle size={16} />
                                <span>{risk.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="sensor-readings">
                      <h4>Recent Sensor Readings</h4>
                      {healthData?.sensors?.length > 0 ? (
                        <div className="readings-table">
                          <table>
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Value</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {healthData.sensors.map((reading, index) => (
                                <tr key={index}>
                                  <td>{reading.timestamp}</td>
                                  <td>{reading.type}</td>
                                  <td>{reading.value} {reading.unit}</td>
                                  <td className={reading.status?.toLowerCase()}>{reading.status}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p>No sensor readings available for this period.</p>
                      )}
                    </div>
                    
                    <div className="health-actions">
                      <h4>Actions</h4>
                      <div className="action-buttons">
                        <button className="action-btn">Send Health Alert</button>
                        <button className="action-btn">Schedule Check-in</button>
                        <button className="action-btn">Download Health Report</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;