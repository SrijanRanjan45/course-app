import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MyCourses from './Mycourses';
import '../style.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/admin/login', { email, password });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', 'admin');
      setError(null); 
      alert('Logged in as admin!');
      navigate('/courses');
    } catch (err) {
      try{
        const response = await axios.post('http://localhost:3000/users/login', { email, password });
      
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', 'user');
        setError(null); 
        alert('Welcome user! Login Successful');
        navigate('/courses');
      }
      catch(err){
        setError('Invalid login credentials. Please try again.');
      }
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
