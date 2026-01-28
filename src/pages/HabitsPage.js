import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../UserContext';
import './HabitsPage.css';

const HabitsPage = () => {
  const { user, getHabits, addHabit, updateHabit, deleteHabit } = useContext(UserContext);
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');

  const loadHabits = async () => {
    const habitsData = await getHabits();
    setHabits(habitsData);
  };

  useEffect(() => {
    if (user) {
      loadHabits();
    }
  }, [user, loadHabits]);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (newHabit.trim()) {
      await addHabit(newHabit);
      setNewHabit('');
      loadHabits();
    }
  };

  const handleCheckHabit = async (habitId, habit) => {
    const today = new Date().toDateString();
    const days = habit.days || {};
    
    if (days[today]) {
      delete days[today];
    } else {
      days[today] = true;
    }

    const streak = calculateStreak(days);
    await updateHabit(habitId, { days, streak });
    loadHabits();
  };

  const calculateStreak = (days) => {
    if (Object.keys(days).length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();

    while (days[currentDate.toDateString()]) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  };

  const handleDeleteHabit = async (habitId) => {
    if (window.confirm('Delete this habit?')) {
      await deleteHabit(habitId);
      loadHabits();
    }
  };

  return (
    <div className="habits-page">
      <h1>Daily Habits</h1>

      <form onSubmit={handleAddHabit} className="habit-form">
        <input
          type="text"
          placeholder="Add new habit..."
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          required
        />
        <button type="submit">Add Habit</button>
      </form>

      <div className="habits-list">
        {habits.length === 0 ? (
          <p>No habits yet. Create one to build a better you!</p>
        ) : (
          habits.map((habit) => (
            <div key={habit.id} className="habit-card">
              <div className="habit-info">
                <h3>{habit.name}</h3>
                <p>🔥 Streak: {habit.streak || 0} days</p>
              </div>
              <div className="habit-actions">
                <button
                  className={`check-btn ${
                    habit.days && habit.days[new Date().toDateString()]
                      ? 'completed'
                      : ''
                  }`}
                  onClick={() => handleCheckHabit(habit.id, habit)}
                >
                  {habit.days && habit.days[new Date().toDateString()]
                    ? '✓'
                    : 'Mark Done'}
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteHabit(habit.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HabitsPage;
