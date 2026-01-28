import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1>Welcome to Trackly</h1>
        <p>Your all-in-one productivity companion</p>
        <p>Manage tasks, build habits, and plan exams all in one place!</p>
        <button onClick={() => navigate('/auth')}>Get Started</button>
      </div>
    </div>
  );
};

export default LandingPage;
