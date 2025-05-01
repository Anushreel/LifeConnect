import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit, FaCheck } from 'react-icons/fa';
import './TasksView.css';

const TasksView = ({ selectedDate, currentMonth, userId, onClose }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Format the full date for display
  const formatFullDate = () => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDate);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Fetch tasks for the selected date
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        // Format date as YYYY-MM-DD for API
        const dateString = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
        
        const response = await fetch(`/api/tasks/${userId}/${dateString}`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId && selectedDate) {
      fetchTasks();
    }
  }, [userId, selectedDate, currentMonth]);

  // Add a new task
  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    
    try {
      const dateString = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
      
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          date: dateString,
          description: newTask,
          completed: false
        }),
      });

      if (!response.ok) throw new Error('Failed to add task');
      
      const addedTask = await response.json();
      setTasks([...tasks, addedTask]);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');
      
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Start editing a task
  const handleStartEdit = (task) => {
    setEditingTask(task.id);
    setEditText(task.description);
  };

  // Save edited task
  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    
    try {
      const response = await fetch(`/api/tasks/${editingTask}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: editText
        }),
      });

      if (!response.ok) throw new Error('Failed to update task');
      
      setTasks(tasks.map(task => 
        task.id === editingTask ? { ...task, description: editText } : task
      ));
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Toggle task completion status
  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !currentStatus
        }),
      });

      if (!response.ok) throw new Error('Failed to update task status');
      
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className="tasks-overlay">
      <div className="tasks-container">
        <div className="tasks-header">
          <h2>Tasks for {formatFullDate()}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="add-task-form">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <button onClick={handleAddTask}>
            <FaPlus />
          </button>
        </div>

        {isLoading ? (
          <div className="loading-tasks">Loading tasks...</div>
        ) : (
          <div className="tasks-list">
            {tasks.length === 0 ? (
              <div className="no-tasks">No tasks for this day. Add one above!</div>
            ) : (
              tasks.map(task => (
                <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  {editingTask === task.id ? (
                    <div className="edit-task-form">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                        autoFocus
                      />
                      <button onClick={handleSaveEdit}>
                        <FaCheck />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div 
                        className="task-checkbox" 
                        onClick={() => handleToggleComplete(task.id, task.completed)}
                      >
                        {task.completed && <FaCheck />}
                      </div>
                      <div className="task-description">{task.description}</div>
                      <div className="task-actions">
                        <button onClick={() => handleStartEdit(task)}>
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDeleteTask(task.id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksView;