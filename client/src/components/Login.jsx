import React, { useState } from 'react';
import axios from 'axios';
// import './style.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // Handle login form submission
  const handleLogin = async () => {
    try {
      const response = await axios.post('/users/login', { email, password });
      
      // Store the token in localStorage on successful login
      localStorage.setItem('token', response.data.token);
      setError(null);  // Clear any previous errors
      alert('Login successful!');
      
      // Redirect the user or update the UI as needed
      window.location.href = '/courses'; // Example of a page redirect after login
    } catch (err) {
      setError('Invalid login credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div className="login-form">
        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter your email"
        />
        
        <label>Password:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Enter your password"
        />
        
        <button onClick={handleLogin}>Login</button>
        
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
