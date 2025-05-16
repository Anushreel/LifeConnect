import React, { useState, useEffect } from 'react';
import { format, getDaysInMonth, startOfMonth, getDay, parseISO, isSameDay, isSameMonth } from 'date-fns';
import { taskAPI } from './api';
import { FaCheckCircle, FaCircle, FaPlus, FaTrash, FaPencilAlt } from 'react-icons/fa';
import './TaskCalendar.css';

const TaskCalendar = ({ userId }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [userTasks, setUserTasks] = useState({});
  const [newTask, setNewTask] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to create a date key for storing tasks
  const getDateKey = (date) => {
    return format(date, 'yyyy-MM-dd');
  };

  // Fetch user tasks
  useEffect(() => {
    const fetchTasks = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        const taskData = await taskAPI.getUserTasks(userId);
        setTasks(taskData);
        
        // Organize tasks by full date
        const tasksByDate = {};
        taskData.forEach(task => {
          const taskDate = new Date(task.created_at || new Date());
          const dateKey = getDateKey(taskDate);
          
          if (!tasksByDate[dateKey]) {
            tasksByDate[dateKey] = [];
          }
          tasksByDate[dateKey].push(task);
        });
        setUserTasks(tasksByDate);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const generateCalendarDays = (date) => {
    const daysInMonth = getDaysInMonth(date);
    const startDay = getDay(startOfMonth(date));
    const calendarDays = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startDay) {
          week.push(null);
        } else if (day > daysInMonth) {
          week.push(null);
        } else {
          // Create actual date object for each day
          const dayDate = new Date(date.getFullYear(), date.getMonth(), day);
          week.push(dayDate);
          day++;
        }
      }
      calendarDays.push(week);
      
      // Break early if we've filled the month
      if (day > daysInMonth) break;
    }

    return calendarDays;
  };

  const handleDateClick = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const calendarDays = generateCalendarDays(currentMonth);
  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Handle task creation
  const handleAddTask = async (e) => {
    e.preventDefault();
    
    if (!newTask.trim()) return;
    
    const taskData = {
      u_id: userId,
      task_des: newTask,
      task_status: 'Not Done'
    };
    
    try {
      setIsLoading(true);
      const createdTask = await taskAPI.createTask(taskData);
      
      // Ensure the created task has the selected date
      createdTask.created_at = selectedDate.toISOString();
      
      // Update local state
      setTasks([...tasks, createdTask]);
      
      // Update tasks by date using full date key
      const dateKey = getDateKey(selectedDate);
      const updatedTasksByDate = { ...userTasks };
      if (!updatedTasksByDate[dateKey]) {
        updatedTasksByDate[dateKey] = [];
      }
      updatedTasksByDate[dateKey].push(createdTask);
      setUserTasks(updatedTasksByDate);
      
      // Reset form
      setNewTask('');
      setShowTaskModal(false);
    } catch (err) {
      console.error('Failed to create task:', err);
      setError('Failed to create task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle task update
  const handleUpdateTask = async (e) => {
    e.preventDefault();
    
    if (!editingTask || !newTask.trim()) return;
    
    const taskData = {
      task_des: newTask
    };
    
    try {
      setIsLoading(true);
      const updatedTask = await taskAPI.updateTask(editingTask.task_id, taskData);
      
      // Preserve the original created_at date
      updatedTask.created_at = editingTask.created_at;
      
      // Update local state
      const updatedTasks = tasks.map(task => 
        task.task_id === updatedTask.task_id ? updatedTask : task
      );
      setTasks(updatedTasks);
      
      // Update tasks by date using full date key
      const dateKey = getDateKey(new Date(updatedTask.created_at));
      const updatedTasksByDate = { ...userTasks };
      if (updatedTasksByDate[dateKey]) {
        updatedTasksByDate[dateKey] = updatedTasksByDate[dateKey].map(task => 
          task.task_id === updatedTask.task_id ? updatedTask : task
        );
      }
      setUserTasks(updatedTasksByDate);
      
      // Reset form
      setNewTask('');
      setEditingTask(null);
      setShowTaskModal(false);
    } catch (err) {
      console.error('Failed to update task:', err);
      setError('Failed to update task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle marking task as done
  const handleMarkAsDone = async (taskId) => {
    try {
      setIsLoading(true);
      const updatedTask = await taskAPI.markTaskAsDone(taskId);
      
      // Find the original task to preserve created_at
      const originalTask = tasks.find(task => task.task_id === taskId);
      if (originalTask) {
        updatedTask.created_at = originalTask.created_at;
      }
      
      // Update local state
      const updatedTasks = tasks.map(task => 
        task.task_id === taskId ? updatedTask : task
      );
      setTasks(updatedTasks);
      
      // Update tasks by date
      const updatedTasksByDate = { ...userTasks };
      Object.keys(updatedTasksByDate).forEach(dateKey => {
        if (updatedTasksByDate[dateKey].some(task => task.task_id === taskId)) {
          updatedTasksByDate[dateKey] = updatedTasksByDate[dateKey].map(task => 
            task.task_id === taskId ? updatedTask : task
          );
        }
      });
      setUserTasks(updatedTasksByDate);
    } catch (err) {
      console.error('Failed to mark task as done:', err);
      setError('Failed to update task status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    try {
      setIsLoading(true);
      await taskAPI.deleteTask(taskId);
      
      // Update local state
      const updatedTasks = tasks.filter(task => task.task_id !== taskId);
      setTasks(updatedTasks);
      
      // Update tasks by date
      const updatedTasksByDate = { ...userTasks };
      Object.keys(updatedTasksByDate).forEach(dateKey => {
        updatedTasksByDate[dateKey] = updatedTasksByDate[dateKey].filter(task => 
          task.task_id !== taskId
        );
        if (updatedTasksByDate[dateKey].length === 0) {
          delete updatedTasksByDate[dateKey];
        }
      });
      setUserTasks(updatedTasksByDate);
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openAddTaskModal = () => {
    setEditingTask(null);
    setNewTask('');
    setShowTaskModal(true);
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setNewTask(task.task_des);
    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
    setEditingTask(null);
    setNewTask('');
  };

  // Get tasks for selected date
  const selectedDateKey = getDateKey(selectedDate);
  const selectedDateTasks = userTasks[selectedDateKey] || [];

  // Check if a date has tasks (for calendar indicators)
  const hasTasksOnDate = (date) => {
    if (!date) return false;
    const dateKey = getDateKey(date);
    return userTasks[dateKey] && userTasks[dateKey].length > 0;
  };

  return (
    <div className="task-calendar-container">
      {error && <div className="error-message">{error}</div>}
      
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <span>{format(currentMonth, 'MMMM yyyy')}</span>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      
      <div className="calendar">
        <div className="calendar-days">
          {dayLabels.map((day, index) => (
            <div key={`day-${index}`} className="day-label">{day}</div>
          ))}
        </div>
        
        {calendarDays.map((week, weekIndex) => (
          <div key={`week-${weekIndex}`} className="calendar-week">
            {week.map((date, dayIndex) => (
              <div
                key={`day-${weekIndex}-${dayIndex}`}
                className={`calendar-day ${date && isSameDay(date, selectedDate) ? 'selected' : ''} ${!date ? 'empty' : ''} ${date && hasTasksOnDate(date) ? 'has-tasks' : ''}`}
                onClick={() => handleDateClick(date)}
              >
                <span className="day-number">{date ? date.getDate() : ''}</span>
                {date && hasTasksOnDate(date) && (
                  <div className="task-indicator"></div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="tasks-section">
        <div className="tasks-header">
          <h3>Tasks for {format(selectedDate, 'MMMM d, yyyy')}</h3>
          <button className="add-task-btn" onClick={openAddTaskModal}>
            <FaPlus /> Add Task
          </button>
        </div>
        
        {isLoading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <>
            {selectedDateTasks.length === 0 ? (
              <div className="no-tasks">No tasks for this date</div>
            ) : (
              <ul className="task-list">
                {selectedDateTasks.map(task => (
                  <li key={task.task_id} className={`task-item ${task.task_status === 'Done' ? 'completed' : ''}`}>
                    <div className="task-content">
                      <span 
                        className="task-status-icon" 
                        onClick={() => task.task_status !== 'Done' && handleMarkAsDone(task.task_id)}
                      >
                        {task.task_status === 'Done' ? (
                          <FaCheckCircle className="task-done" />
                        ) : (
                          <FaCircle className="task-not-done" />
                        )}
                      </span>
                      <span className="task-text">{task.task_des}</span>
                    </div>
                    <div className="task-actions">
                      {task.task_status !== 'Done' && (
                        <button className="task-edit-btn" onClick={() => openEditTaskModal(task)}>
                          <FaPencilAlt />
                        </button>
                      )}
                      <button className="task-delete-btn" onClick={() => handleDeleteTask(task.task_id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="task-modal-overlay">
          <div className="task-modal">
            <div className="task-modal-header">
              <h3>{editingTask ? 'Edit Task' : 'Add New Task'}</h3>
              <button className="close-modal-btn" onClick={closeTaskModal}>×</button>
            </div>
            <form onSubmit={editingTask ? handleUpdateTask : handleAddTask}>
              <div className="task-modal-content">
                <textarea
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter task description..."
                  rows={4}
                  required
                />
              </div>
              <div className="task-modal-footer">
                <button type="button" className="cancel-btn" onClick={closeTaskModal}>Cancel</button>
                <button type="submit" className="save-btn" disabled={isLoading}>
                  {isLoading ? 'Saving...' : (editingTask ? 'Update Task' : 'Add Task')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCalendar;