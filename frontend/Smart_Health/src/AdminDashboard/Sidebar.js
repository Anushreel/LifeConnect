import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaChartBar, FaUser, FaCog, FaBars, FaTimes } from 'react-icons/fa';
import { Home } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const location = useLocation();
  
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

  const handleHomeClick = () => {
    navigate('/mainpage');
    if (windowWidth < 768) setSidebarOpen(false);
  };

  const handleChartClick = () => {
    navigate('/charts');
    if (windowWidth < 768) setSidebarOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    if (windowWidth < 768) setSidebarOpen(false);
  };

  const handleAdminClick = () => {
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

  // Determine which navigation item is active
  const isActive = (path) => {
    return location.pathname.includes(path);
  };
  
  return (
    <>
      {/* Overlay for mobile sidebar */}
      {windowWidth < 768 && (
        <div 
          className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} 
          onClick={handleOverlayClick}
        />
      )}
      
      {/* Menu toggle button for mobile */}
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
          <div className={`sidebar-icon ${isActive('mainpage') ? 'active' : ''}`} onClick={handleHomeClick}>
            <Home className="icon" size={getIconSize()} />
            <span className="icon-text">Home</span>
          </div>
          <div className={`sidebar-icon ${isActive('charts') ? 'active' : ''}`} onClick={handleChartClick}>
            <FaChartBar className="icon" size={getIconSize()} />
            <span className="icon-text">Charts</span>
          </div>
          <div className={`sidebar-icon ${isActive('profile') ? 'active' : ''}`} onClick={handleProfileClick}>
            <FaUser className="icon" size={getIconSize()} />
            <span className="icon-text">Profile</span>
          </div>
          <div className={`sidebar-icon ${isActive('admin') ? 'active' : ''}`} onClick={handleAdminClick}>
            <FaCog className="icon" size={getIconSize()} />
            <span className="icon-text">Admin</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;