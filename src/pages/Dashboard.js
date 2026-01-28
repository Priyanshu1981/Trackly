import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../UserContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, getTasks, getHabits, getExams } = useContext(UserContext);
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    const tasksData = await getTasks();
    const habitsData = await getHabits();
    const examsData = await getExams();

    setTasks(tasksData);
    setHabits(habitsData);
    setExams(examsData);
  };

  const getDaysLeft = (examDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);
    
    const diffTime = exam - today;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays; // Can be negative if exam is in the past
  };

  const getTopicProgress = (topics) => {
    if (!topics || topics.length === 0) return 0;
    const completed = topics.filter(t => t.completed).length;
    return Math.round((completed / topics.length) * 100);
  };

  const getDaysInMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  };

  const isHabitCompletedOnDay = (habit, day) => {
    const date = new Date();
    date.setDate(day);
    const dateStr = date.toDateString();
    return habit.days && habit.days[dateStr];
  };

  const completedTasks = tasks.filter(t => t.completed).length;

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.email}!</h1>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>TASKS</h3>
          <p className="stat-number">{completedTasks}/{tasks.length}</p>
          <p className="stat-label">Completed</p>
        </div>

        <div className="stat-card">
          <h3>HABITS</h3>
          <p className="stat-number">{habits.length}</p>
          <p className="stat-label">Active</p>
        </div>

        <div className="stat-card">
          <h3>EXAMS</h3>
          <p className="stat-number">{exams.length}</p>
          <p className="stat-label">Planned</p>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="dashboard-section">
        <h2>📋 Recent Tasks</h2>
        <div className="section-content">
          {tasks.length === 0 ? (
            <p className="empty-text">No tasks yet. Create one to get started!</p>
          ) : (
            <div className="task-list">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <input type="checkbox" checked={task.completed} disabled />
                  <span>{task.text}</span>
                </div>
              ))}
              {tasks.length > 5 && <p className="more-text">+{tasks.length - 5} more tasks</p>}
            </div>
          )}
        </div>
      </div>

      {/* Habits Section */}
      <div className="dashboard-section">
        <h2>🔥 Habits Tracker</h2>
        <div className="section-content">
          {habits.length === 0 ? (
            <p className="empty-text">No habits yet. Create one to build consistency!</p>
          ) : (
            <div className="habits-container">
              {habits.map((habit) => (
                <div key={habit.id} className="habit-box">
                  <h4>{habit.name}</h4>
                  <p className="streak">🔥 {habit.streak || 0} days</p>
                  <div className="calendar">
                    {Array.from({ length: getDaysInMonth() }, (_, i) => i + 1).map((day) => (
                      <div
                        key={day}
                        className={`day ${isHabitCompletedOnDay(habit, day) ? 'completed' : ''}`}
                        title={`Day ${day}`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Exams Section */}
      <div className="dashboard-section">
        <h2>📚 Upcoming Exams</h2>
        <div className="section-content">
          {exams.length === 0 ? (
            <p className="empty-text">No exams planned. Add one to stay organized!</p>
          ) : (
            <div className="exams-container">
              {exams.map((exam) => {
                const daysLeft = getDaysLeft(exam.date);
                const progress = getTopicProgress(exam.topics);
                const isExp = daysLeft < 0;
                
                return (
                  <div key={exam.id} className={`exam-box ${isExp ? 'expired' : ''}`}>
                    <div className="exam-header">
                      <h4>{exam.subject}</h4>
                      <span className={`days-left ${isExp ? 'expired' : daysLeft < 7 ? 'urgent' : ''}`}>
                        {isExp ? 'Expired' : `${daysLeft} days left`}
                      </span>
                    </div>
                    <p className="exam-date">
                      Exam: {new Date(exam.date).toLocaleDateString()}
                    </p>
                    <div className="progress-section">
                      <div className="progress-header">
                        <span>Topics Progress</span>
                        <span className="progress-percent">{progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                      </div>
                      <p className="topics-count">
                        {exam.topics?.filter(t => t.completed).length || 0}/{exam.topics?.length || 0} topics done
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
