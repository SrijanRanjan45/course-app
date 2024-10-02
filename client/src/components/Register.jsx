import React, { useState } from 'react';
import axios from 'axios';
import '../style.css';

const Register = () => {
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  const handleRegister = async () => {
  try {
      const endpoint = role === 'admin' ? '/admin/signup' : '/users/signup';
      const response = await axios.post('http://localhost:3000' + endpoint, {
        email,
        password,
        firstName,
        lastName
      });

      
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
      <div className="role-selection">
        <button
          className={role === 'user' ? 'selected' : ''}
          onClick={() => handleRoleChange('user')}
        >
          Register as User
        </button>
        <button
          className={role === 'admin' ? 'selected' : ''}
          onClick={() => handleRoleChange('admin')}
        >
          Register as Admin
        </button>
      </div>
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
