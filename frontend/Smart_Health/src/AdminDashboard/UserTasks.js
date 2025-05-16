import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, Form, Input, Select, Spin, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, CheckOutlined } from '@ant-design/icons';
import { taskAPI } from '../components/api';

const { Option } = Select;

const UserTasks = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getUserTasks(userId);
      setTasks(response);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setLoading(false);
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    form.setFieldsValue({
      task_des: task.task_des,
      task_status: task.task_status,
    });
    setModalVisible(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskAPI.deleteTask(taskId);
      message.success('Task deleted successfully');
      fetchTasks();
    } catch (error) {
      message.error('Failed to delete task');
    }
  };

  const handleMarkAsDone = async (taskId) => {
    try {
      await taskAPI.markTaskAsDone(taskId);
      message.success('Task marked as done');
      fetchTasks();
    } catch (error) {
      message.error('Failed to update task status');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingTask) {
        await taskAPI.updateTask(editingTask.task_id, {
          ...values,
          u_id: userId
        });
        message.success('Task updated successfully');
      } else {
        await taskAPI.createTask({
          ...values,
          u_id: userId
        });
        message.success('Task created successfully');
      }
      
      setModalVisible(false);
      fetchTasks();
    } catch (error) {
      console.error('Submit failed:', error);
    }
  };

  const columns = [
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
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="action-buttons">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEditTask(record)}
            size="small"
          />
          {record.task_status !== 'Done' && (
            <Button 
              icon={<CheckOutlined />} 
              onClick={() => handleMarkAsDone(record.task_id)}
              size="small"
              type="primary"
              style={{ backgroundColor: 'green' }}
            />
          )}
          <Button 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteTask(record.task_id)}
            danger
            size="small"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="user-tasks">
      <div className="tasks-header">
        <h3>User Tasks</h3>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAddTask}
        >
          Add Task
        </Button>
      </div>
      
      {loading ? (
        <Spin />
      ) : (
        <Table 
          columns={columns} 
          dataSource={tasks} 
          rowKey="task_id"
          pagination={{ pageSize: 5 }}
        />
      )}
      
      <Modal
        title={editingTask ? 'Edit Task' : 'Add Task'}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="task_des"
            label="Task Description"
            rules={[{ required: true, message: 'Please enter task description' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          
          <Form.Item
            name="task_status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
            initialValue="not done"
          >
            <Select>
              <Option value="Done">Done</Option>
              <Option value="not done">Not Done</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserTasks;