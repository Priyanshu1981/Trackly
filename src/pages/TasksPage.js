import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../UserContext';
import './TasksPage.css';

const TasksPage = () => {
  const { user, getTasks, addTask, updateTask, deleteTask } = useContext(UserContext);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const loadTasks = async () => {
    const tasksData = await getTasks();
    setTasks(tasksData);
  };

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user, loadTasks]); // ✅ Added loadTasks to dependency array

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      await addTask(newTask);
      setNewTask('');
      loadTasks();
    }
  };

  const handleToggleTask = async (taskId, task) => {
    await updateTask(taskId, { completed: !task.completed });
    loadTasks();
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    loadTasks();
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="tasks-page">
      <h1>Tasks</h1>
      <p className="task-progress">
        {completedCount} of {tasks.length} completed
      </p>

      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          required
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p>No tasks yet. Add one to get started!</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`task-item ${task.completed ? 'completed' : ''}`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task.id, task)}
              />
              <span>{task.text}</span>
              <button
                className="delete-btn"
                onClick={() => handleDeleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TasksPage;
