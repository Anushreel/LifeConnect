// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Bell, BellDot, X, CheckCircle } from 'lucide-react';
// import { notificationAPI } from './api';
// import './NotificationSystem.css';

// const NotificationSystem = ({ userId, isAdmin = false, onUserClick }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);
//   const [popupNotification, setPopupNotification] = useState(null);
//   const [lastCheckTime, setLastCheckTime] = useState(new Date());
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();
  
//   // Format the notification timestamp
//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp);
//     const now = new Date();
    
//     // If today, show time only
//     if (date.toDateString() === now.toDateString()) {
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     }
    
//     // If within last 7 days, show day of week and time
//     const daysDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
//     if (daysDiff < 7) {
//       return `${date.toLocaleDateString([], { weekday: 'short' })} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
//     }
    
//     // Otherwise show date
//     return date.toLocaleDateString();
//   };
  
//   // Fetch notifications initially and set up polling
//   useEffect(() => {
//     fetchNotifications();
    
//     // Poll for notifications every 30 seconds
//     const interval = setInterval(fetchNotifications, 30000);
    
//     // Set up event listener for clicks outside dropdown
//     document.addEventListener('mousedown', handleClickOutside);
    
//     return () => {
//       clearInterval(interval);
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [userId]);
  
//   const fetchNotifications = async () => {
//     try {
//       // Use the admin endpoint if user is an admin
//       let data;
//       if (isAdmin) {
//         data = await notificationAPI.getAllNotifications(0, 10);
//       } else {
//         data = await notificationAPI.getNotifications(0, 10);
//       }
      
//       // Check for new notifications to show popup
//       const currentTime = new Date();
//       const newNotifications = data.filter(notification =>
//         new Date(notification.created_at || notification.timestamp) > lastCheckTime &&
//         !notification.read
//       );
      
//       // Show popup for the newest notification if any
//       if (newNotifications.length > 0) {
//         const newestNotification = newNotifications.sort((a, b) =>
//           new Date(b.created_at || b.timestamp) - new Date(a.created_at || a.timestamp)
//         )[0];
        
//         setPopupNotification(newestNotification);
//         setShowPopup(true);
        
//         // Auto-dismiss popup after 5 seconds
//         setTimeout(() => {
//           setShowPopup(false);
//         }, 5000);
//       }
      
//       setLastCheckTime(currentTime);
//       setNotifications(data);
      
//       // Update unread count
//       const unreadCount = await notificationAPI.getUnreadCount();
//       setUnreadCount(unreadCount.count || data.filter(notification => !notification.read).length);
//     } catch (error) {
//       console.error('Failed to fetch notifications:', error);
//     }
//   };
  
//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setShowDropdown(false);
//     }
//   };
  
//   const toggleDropdown = () => {
//     setShowDropdown(!showDropdown);
//   };
  
//   const handleNotificationClick = async (notification) => {
//     // Mark notification as read
//     if (!notification.read) {
//       try {
//         await notificationAPI.markAsRead(notification.id);
        
//         // Update local state
//         setNotifications(prevNotifications =>
//           prevNotifications.map(item =>
//             item.id === notification.id ? { ...item, read: true } : item
//           )
//         );
//         setUnreadCount(prev => Math.max(0, prev - 1));
//       } catch (error) {
//         console.error('Failed to mark notification as read:', error);
//       }
//     }
    
//     // For admin notifications about users, handle user click
//     if (isAdmin && notification.affected_user_id && onUserClick) {
//       onUserClick(notification.affected_user_id);
//       setShowDropdown(false);
//     }
//   };
  
//   const handleMarkAllAsRead = async () => {
//     try {
//       await notificationAPI.markAllAsRead();
      
//       // Update local state
//       setNotifications(prevNotifications =>
//         prevNotifications.map(item => ({ ...item, read: true }))
//       );
//       setUnreadCount(0);
//       setShowDropdown(false);
//     } catch (error) {
//       console.error('Failed to mark all notifications as read:', error);
//     }
//   };
  
//   const dismissPopup = () => {
//     setShowPopup(false);
//   };
  
//   const viewAllNotifications = () => {
//     navigate('/notifications');
//     setShowDropdown(false);
//   };
  
//   // Get notification type class
//   const getNotificationType = (notification) => {
//     const type = notification.type?.toLowerCase();
//     if (type === 'health' || type === 'critical') return 'health';
//     if (type === 'task' || type === 'warning') return 'task';
//     if (type === 'admin') return 'admin';
//     return 'system';
//   };
  
//   return (
//     <div className="notification-system">
//       {/* Bell icon with unread count */}
//       <div className="notification-bell" onClick={toggleDropdown}>
//         {unreadCount > 0 ? (
//           <div className="notification-container">
//             <BellDot size={24} className="bell-icon active" />
//             <span className="notification-badge">{unreadCount}</span>
//           </div>
//         ) : (
//           <Bell size={24} className="bell-icon" />
//         )}
//       </div>
      
//       {/* Notification dropdown */}
//       {showDropdown && (
//         <div className="notification-dropdown" ref={dropdownRef}>
//           <div className="notification-header">
//             <h3>Notifications</h3>
//             {unreadCount > 0 && (
//               <button className="mark-all-read" onClick={handleMarkAllAsRead}>
//                 <CheckCircle size={14} />
//                 Mark all read
//               </button>
//             )}
//           </div>
          
//           <div className="notification-list">
//             {notifications.length === 0 ? (
//               <div className="no-notifications">No notifications</div>
//             ) : (
//               notifications.slice(0, 5).map(notification => (
//                 <div
//                   key={notification.id}
//                   className={`notification-item ${!notification.read ? 'unread' : ''}`}
//                   onClick={() => handleNotificationClick(notification)}
//                 >
//                   <div className={`notification-indicator ${getNotificationType(notification)}`}></div>
//                   <div className="notification-content">
//                     <p className="notification-message">{notification.message}</p>
//                     <span className="notification-time">{formatTime(notification.created_at || notification.timestamp)}</span>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
          
//           <div className="notification-footer">
//             <button className="view-all" onClick={viewAllNotifications}>
//               View all notifications
//             </button>
//           </div>
//         </div>
//       )}
      
//       {/* Popup notification */}
//       {showPopup && popupNotification && (
//         <div className={`notification-popup ${getNotificationType(popupNotification)}`}>
//           <div className="popup-content">
//             <div className="popup-header">
//               <h4>{isAdmin && popupNotification.type === 'admin' ? 'Admin Alert' : 'LifeConnect Alert'}</h4>
//               <button className="close-popup" onClick={dismissPopup}>
//                 <X size={18} />
//               </button>
//             </div>
//             <p>{popupNotification.message}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationSystem;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, BellDot, X, CheckCircle } from 'lucide-react';
import { notificationAPI } from './api';
import './NotificationSystem.css';

const NotificationSystem = ({ userId, isAdmin = false, onUserClick }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupNotification, setPopupNotification] = useState(null);
  const [lastCheckTime, setLastCheckTime] = useState(new Date());
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  // Format the notification timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // If today, show time only
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If within last 7 days, show day of week and time
    const daysDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      return `${date.toLocaleDateString([], { weekday: 'short' })} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise show date
    return date.toLocaleDateString();
  };
  
  // Fetch notifications initially and set up polling
  useEffect(() => {
    fetchNotifications();
    
    // Poll for notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    // Set up event listener for clicks outside dropdown
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userId]);
  
  const fetchNotifications = async () => {
    try {
      // Skip if no userId is provided
      if (!userId) return;
      
      // Use the admin endpoint if user is an admin
      let data;
      if (isAdmin) {
        data = await notificationAPI.getAllNotifications(0, 10);
      } else {
        data = await notificationAPI.getNotifications(0, 10);
      }
      
      // Check for new notifications to show popup
      const currentTime = new Date();
      const newNotifications = data.filter(notification => 
        new Date(notification.created_at || notification.timestamp) > lastCheckTime && 
        !notification.read
      );
      
      // Show popup for the newest notification if any
      if (newNotifications.length > 0) {
        const newestNotification = newNotifications.sort((a, b) => 
          new Date(b.created_at || b.timestamp) - new Date(a.created_at || a.timestamp)
        )[0];
        
        setPopupNotification(newestNotification);
        setShowPopup(true);
        
        // Auto-dismiss popup after 5 seconds
        setTimeout(() => {
          setShowPopup(false);
        }, 5000);
      }
      
      setLastCheckTime(currentTime);
      setNotifications(data);
      
      // Update unread count
      const unreadCount = await notificationAPI.getUnreadCount();
      setUnreadCount(unreadCount.count || data.filter(notification => !notification.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };
  
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };
  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  
  const handleNotificationClick = async (notification) => {
    // Mark notification as read
    if (!notification.read) {
      try {
        await notificationAPI.markAsRead(notification.id);
        
        // Update local state
        setNotifications(prevNotifications => 
          prevNotifications.map(item => 
            item.id === notification.id ? { ...item, read: true } : item
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
    
    // For admin notifications about users, handle user click
    if (isAdmin && notification.affected_user_id && onUserClick) {
      onUserClick(notification.affected_user_id);
      setShowDropdown(false);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(item => ({ ...item, read: true }))
      );
      setUnreadCount(0);
      setShowDropdown(false);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };
  
  const dismissPopup = () => {
    setShowPopup(false);
  };
  
  const viewAllNotifications = () => {
    // Close dropdown before navigation
    setShowDropdown(false);
    
    // Use setTimeout to ensure dropdown closing animation completes
    setTimeout(() => {
      navigate('/notifications');
    }, 100);
  };
  
  // Get notification type class
  const getNotificationType = (notification) => {
    const type = notification.type?.toLowerCase();
    if (type === 'health' || type === 'critical') return 'health';
    if (type === 'task' || type === 'warning') return 'task';
    if (type === 'admin') return 'admin';
    return 'system';
  };
  
  return (
    <div className="notification-system">
      {/* Bell icon with unread count */}
      <div className="notification-bell" onClick={toggleDropdown}>
        {unreadCount > 0 ? (
          <div className="notification-container">
            <BellDot size={24} className="bell-icon active" />
            <span className="notification-badge">{unreadCount}</span>
          </div>
        ) : (
          <Bell size={24} className="bell-icon" />
        )}
      </div>
      
      {/* Notification dropdown */}
      {showDropdown && (
        <div className="notification-dropdown" ref={dropdownRef}>
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button className="mark-all-read" onClick={handleMarkAllAsRead}>
                <CheckCircle size={14} />
                Mark all read
              </button>
            )}
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">No notifications</div>
            ) : (
              notifications.slice(0, 5).map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={`notification-indicator ${getNotificationType(notification)}`}></div>
                  <div className="notification-content">
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">{formatTime(notification.created_at || notification.timestamp)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* <div className="notification-footer">
            <button className="view-all" onClick={viewAllNotifications}>
              View all notifications
            </button>
          </div> */}
        </div>
      )}
      
      {/* Popup notification */}
      {showPopup && popupNotification && (
        <div className={`notification-popup ${getNotificationType(popupNotification)}`}>
          <div className="popup-content">
            <div className="popup-header">
              <h4>{isAdmin && popupNotification.type === 'admin' ? 'Admin Alert' : 'LifeConnect Alert'}</h4>
              <button className="close-popup" onClick={dismissPopup}>
                <X size={18} />
              </button>
            </div>
            <p>{popupNotification.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;