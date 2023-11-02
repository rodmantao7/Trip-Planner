import React, { useState } from 'react';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: '', password: '', email: '', first_name: '', last_name: ''
      });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, email, firstName: first_name, lastName: last_name } = formData;
    const response = await fetch('http://localhost:3001/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email, first_name, last_name })
    });
    if (response.ok) {
      alert('User registered successfully!');
    } else {
      const errorData = await response.json();
      console.log('Error registering user:', errorData.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
        <label>Email: <input type="email" name="email" value={formData.email} onChange={handleChange} required /></label><br />
        <label>Username: <input type="text" name="username" value={formData.username} onChange={handleChange} required /></label><br />
        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required /><br />
        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required /><br />
        <label>Password: <input type="password" name="password" value={formData.password} onChange={handleChange} required /></label><br />
        <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
