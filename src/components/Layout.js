import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = React.useContext(UserContext);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">T</div>
          <h2>Trackly</h2>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${isActive('/') ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-item ${isActive('/tasks') ? 'active' : ''}`}
            onClick={() => navigate('/tasks')}
          >
            ✓ Tasks
          </button>
          <button
            className={`nav-item ${isActive('/habits') ? 'active' : ''}`}
            onClick={() => navigate('/habits')}
          >
            🔥 Habits
          </button>
          <button
            className={`nav-item ${isActive('/exams') ? 'active' : ''}`}
            onClick={() => navigate('/exams')}
          >
            📚 Exams
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>

        {/* Mobile footer - logout at bottom */}
        <div className="mobile-footer">
          <div className="user-info-mobile">
            <div className="user-avatar">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <h4>{user?.email?.split('@')[0]}</h4>
              <p>{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </main>

      {/* Desktop footer in sidebar */}
      <div className="sidebar-footer-desktop">
        <div className="user-info">
          <div className="user-avatar">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <h4>{user?.email?.split('@')[0]}</h4>
            <p>{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Layout;
