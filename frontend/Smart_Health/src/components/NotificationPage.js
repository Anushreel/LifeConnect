import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { notificationAPI, userAPI } from './api';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState({});
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

  // Get severity class based on notification type
  const getSeverityClass = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'critical';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  // Get type display name
  const getTypeDisplayName = (type) => {
    switch (type?.toLowerCase()) {
      case 'health':
        return 'Health Alert';
      case 'task':
        return 'Task Reminder';
      case 'system':
        return 'System Notice';
      case 'admin':
        return 'Admin Alert';
      default:
        return 'Notification';
    }
  };

  // Fetch notifications and check if user is admin
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Check if user is admin
        const userResponse = await userAPI.getCurrentUser();
        const isUserAdmin = userResponse.data.is_admin || false;
        setIsAdmin(isUserAdmin);
        
        // Fetch notifications based on user role
        let notificationsData;
        if (isUserAdmin) {
          // Admin gets all notifications
          notificationsData = await notificationAPI.getAllNotifications();
          
          // Also fetch user data for admin to show which user each notification is for
          const usersData = await userAPI.getAllUser();
          const usersMap = {};
          usersData.data.forEach(user => {
            usersMap[user.uid] = user;
          });
          setUsers(usersMap);
        } else {
          // Regular user gets only their notifications
          notificationsData = await notificationAPI.getNotifications();
        }
        
        setNotifications(notificationsData);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await notificationAPI.markAsRead(notification.id);
        
        // Update local state to mark as read
        setNotifications(prevNotifications => 
          prevNotifications.map(item => 
            item.id === notification.id ? { ...item, read: true } : item
          )
        );
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
    
    // If admin and clicking on a user notification, navigate to that user's detail
    if (isAdmin && notification.user_id && notification.user_id !== 'admin') {
      navigate(`/admin/user/${notification.user_id}`);
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(item => ({ ...item, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  // Navigate back to previous page
  const handleBack = () => {
    navigate(-1);
  };

  // Render components
  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft />
        </button>
        <h1>Notifications</h1>
        {notifications.length > 0 && (
          <button className="mark-all-read-button" onClick={handleMarkAllAsRead}>
            <FaCheckCircle /> Mark All Read
          </button>
        )}
      </div>

      {loading ? (
        <div className="notifications-loading">Loading notifications...</div>
      ) : error ? (
        <div className="notifications-error">{error}</div>
      ) : notifications.length === 0 ? (
        <div className="no-notifications">
          <p>No notifications to display</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className={`notification-indicator ${getSeverityClass(notification.severity)}`}></div>
              <div className="notification-content">
                <div className="notification-header">
                  <span className="notification-type">{getTypeDisplayName(notification.type)}</span>
                  <span className="notification-time">{formatTime(notification.timestamp)}</span>
                </div>
                <p className="notification-message">{notification.message}</p>
                {isAdmin && notification.user_id && users[notification.user_id] && (
                  <div className="notification-user">
                    User: {users[notification.user_id].full_name || users[notification.user_id].username}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;