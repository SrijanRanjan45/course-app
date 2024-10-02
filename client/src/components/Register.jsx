import React, { useState } from 'react';
import axios from 'axios';
import './style.css';

const Register = () => {
  // State to capture user input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Handle registration form submission
  const handleRegister = async () => {
    try {
      const response = await axios.post('/users/signup', {
        email,
        password,
        firstName,
        lastName
      });

      // Clear form fields upon successful registration
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setError(null);
      setSuccessMessage('Registration successful! You can now login.');
    } catch (err) {
      setError('Registration failed. Please try again.');
      setSuccessMessage(null);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <div className="register-form">
        <label>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter your first name"
        />
        
        <label>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter your last name"
        />
        
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
        
        <button onClick={handleRegister}>Register</button>
        
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
};

export default Register;
