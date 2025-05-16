import React, { useState, useEffect } from 'react';
import { userAPI, predictionAPI, sensorAPI, taskAPI } from '../components/api';
import { Card, Table, Input, Button, Tabs, Alert, Spin, Tag, Space, message } from 'antd';
import { SearchOutlined, UserOutlined, HeartOutlined, WarningOutlined, LockOutlined } from '@ant-design/icons';
import UserHealthDetails from './UserHealthDetails';
import AdminTaskView from './AdminTaskView';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [healthSummary, setHealthSummary] = useState({
    critical: 0,
    warning: 0,
    normal: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getAllUser();
        setUsers(response.data);
        
        // Calculate health summary
        const summary = { critical: 0, warning: 0, normal: 0 };
        
        // Fetch latest health status for each user
        for (const user of response.data) {
          try {
            const predictionResponse = await predictionAPI.getLatestPredictionForUser(user.uid);
            const status = predictionResponse.data?.health_status?.toLowerCase() || 'normal';
            if (status === 'critical') summary.critical++;
            else if (status === 'warning') summary.warning++;
            else summary.normal++;
          } catch (error) {
            console.error(`Failed to fetch prediction for user ${user.uid}`, error);
            summary.normal++; // Default to normal if no prediction found
          }
        }
        
        setHealthSummary(summary);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch users data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user => {
    return (
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.uid.toString().includes(searchTerm)
    );
  });

  const handleViewUser = (user) => {
    setSelectedUser(user);
  };

  const handleBack = () => {
    setSelectedUser(null);
  };

  const getHealthStatusTag = (status) => {
    if (!status) return <Tag color="default">Unknown</Tag>;
    
    switch (status.toLowerCase()) {
      case 'critical':
        return <Tag color="red">Critical</Tag>;
      case 'warning':
        return <Tag color="orange">Warning</Tag>;
      case 'normal':
        return <Tag color="green">Normal</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'uid',
      key: 'uid',
      sorter: (a, b) => a.uid - b.uid,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        record.healthStatus ? getHealthStatusTag(record.healthStatus) : <Spin size="small" />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="primary" onClick={() => handleViewUser(record)}>
          View Details
        </Button>
      ),
    },
  ];

  if (selectedUser) {
    return <UserHealthDetails user={selectedUser} onBack={handleBack} />;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <div className="dashboard-summary">
            <Card title="Dashboard Overview" className="summary-card">
              <div className="stats-container">
                <Card className="stat-card">
                  <UserOutlined className="stat-icon" />
                  <h3>Total Users</h3>
                  <p>{users.length}</p>
                </Card>
                <Card className="stat-card critical">
                  <WarningOutlined className="stat-icon" />
                  <h3>Critical Status</h3>
                  <p>{healthSummary.critical}</p>
                </Card>
                <Card className="stat-card warning">
                  <HeartOutlined className="stat-icon" />
                  <h3>Warning Status</h3>
                  <p>{healthSummary.warning}</p>
                </Card>
              </div>
            </Card>
          </div>

          <Tabs defaultActiveKey="users" className="admin-tabs">
            <TabPane tab="Users Health Status" key="users">
              <div className="search-container">
                <Input
                  placeholder="Search by name or ID"
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
                />
              </div>

              <Table 
                columns={columns} 
                dataSource={filteredUsers} 
                rowKey="uid" 
                className="users-table"
                loading={loading}
              />
            </TabPane>
            <TabPane tab="Tasks Management" key="tasks">
              <AdminTaskView users={users} />
            </TabPane>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;