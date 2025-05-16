import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Input, Select, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { taskAPI } from '../components/api';

const { Option } = Select;

const AdminTaskView = ({ users }) => {
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAllUsersTasks();
  }, [users]);

  const fetchAllUsersTasks = async () => {
    try {
      setLoading(true);
      const tasksPromises = users.map(user => 
        taskAPI.getUserTasks(user.uid)
          .then(tasks => tasks.map(task => ({
            ...task,
            user_name: user.full_name,
            user_id: user.uid
          })))
          .catch(error => {
            console.error(`Failed to fetch tasks for user ${user.uid}:`, error);
            return [];
          })
      );
      
      const results = await Promise.all(tasksPromises);
      const flattenedTasks = results.flat();
      setAllTasks(flattenedTasks);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch all tasks:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
  };

  const filteredTasks = allTasks.filter(task => {
    const matchesSearch = 
      task.task_des.toLowerCase().includes(searchText.toLowerCase()) ||
      task.user_name.toLowerCase().includes(searchText.toLowerCase()) ||
      task.user_id.toString().includes(searchText);
      
    const matchesStatus = statusFilter === 'all' || task.task_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'User',
      dataIndex: 'user_name',
      key: 'user_name',
      sorter: (a, b) => a.user_name.localeCompare(b.user_name),
    },
    {
      title: 'User ID',
      dataIndex: 'user_id',
      key: 'user_id',
    },
    {
      title: 'Task ID',
      dataIndex: 'task_id',
      key: 'task_id',
    },
    {
      title: 'Description',
      dataIndex: 'task_des',
      key: 'task_des',
    },
    {
      title: 'Status',
      dataIndex: 'task_status',
      key: 'task_status',
      render: (status) => (
        <Tag color={status === 'Done' ? 'green' : 'volcano'}>
          {status}
        </Tag>
      ),
      filters: [
        { text: 'Done', value: 'Done' },
        { text: 'Not Done', value: 'not done' },
      ],
      onFilter: (value, record) => record.task_status === value,
    }
  ];

  return (
    <div className="admin-task-view">
      <div className="filter-container">
        <Space>
          <Input
            placeholder="Search tasks or users"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            style={{ width: 250 }}
          />
          
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            onChange={handleStatusFilter}
          >
            <Option value="all">All Status</Option>
            <Option value="Done">Done</Option>
            <Option value="not done">Not Done</Option>
          </Select>
          
          <Button type="primary" onClick={fetchAllUsersTasks}>
            Refresh
          </Button>
        </Space>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : (
        <Table 
          columns={columns} 
          dataSource={filteredTasks}
          rowKey={record => `${record.user_id}-${record.task_id}`}
        />
      )}
    </div>
  );
};

export default AdminTaskView;