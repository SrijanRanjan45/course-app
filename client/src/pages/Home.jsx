import React, { useState } from 'react';


import Login from '../components/Login';
import Register from '../components/Register';
import Courses from '../components/Courses';
// import './style.css';

const Home = () => {
  // State to toggle between the components
  const [view, setView] = useState('login'); // 'login' | 'register' | 'courses'

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to the Course Platform</h1>
        <p>Choose an action to get started!</p>
      </header>

      <div className="home-navigation">
        <button
          className={`home-button ${view === 'login' ? 'active' : ''}`}
          onClick={() => setView('login')}
        >
          Login
        </button>
        <button
          className={`home-button ${view === 'register' ? 'active' : ''}`}
          onClick={() => setView('register')}
        >
          Register
        </button>
        <button
          className={`home-button ${view === 'courses' ? 'active' : ''}`}
          onClick={() => setView('courses')}
        >
          View Courses
        </button>
      </div>

      <div className="home-content">
        {/* Conditional Rendering Based on Selected View */}
        {view === 'login' && <Login />}
        {view === 'register' && <Register />}
        {view === 'courses' && <Courses />}
      </div>
    </div>
  );
};

export default Home;
