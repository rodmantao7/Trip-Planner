// src/components/LoginForm.js
import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3001/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    if (data.token) {
      onLogin(data.token);
    } else {
      console.log(data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Username: <input type="text" name="username" value={formData.username} onChange={handleChange} required /></label><br />
      <label>Password: <input type="password" name="password" value={formData.password} onChange={handleChange} required /></label><br />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
