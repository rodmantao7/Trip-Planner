// src/App.js
import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import TripForm from './TripForm';
import TripsList from './TripList';

const App = () => {
  const [trips, setTrips] = useState([]);
  const [editingTrip, setEditingTrip] = useState(null);
  const [token, setToken] = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Fetch trips from the backend
  const fetchTrips = async () => {
    const response = await fetch('http://localhost:3001/api/trips', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    setTrips(data);
  };

  // Handle login
  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
    fetchTrips();
  };

  // Handle logout
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  // Toggle between Register and Login forms
  const toggleShowRegisterForm = () => {
    setShowRegisterForm(!showRegisterForm);
  };

  const handleFormSubmit = async (formData) => {
    const requestOptions = editingTrip
      ? {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      : {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        };

    const url = editingTrip
      ? `http://localhost:3001/api/trips/${editingTrip.trip_id}`
      : 'http://localhost:3001/api/trips';

    await fetch(url, requestOptions);
    setEditingTrip(null);
    fetchTrips();
  };

  // Delete a trip
  const handleDelete = async (tripId) => {
    await fetch(`http://localhost:3001/api/trips/${tripId}`, {
      method: 'DELETE',
    });
    fetchTrips();
  };

  // Edit a trip
  const handleEdit = (trip) => {
    setEditingTrip(trip);
  };


  // Fetch trips on initial render
  useEffect(() => {
    // const storedToken = localStorage.getItem('token');
    // if (storedToken) {
      // setToken(storedToken);
      fetchTrips();
    // }
  }, []);

  return (
  //   <div className="App">
  //     <h1>Trips Management</h1>
  //     {!token ? (
  //       <>
  //         {showRegisterForm ? (
  //           <div>
  //             <RegisterForm />
  //             <p>Already have an account? <button onClick={toggleShowRegisterForm}>Login</button></p>
  //           </div>
  //         ) : (
  //           <div>
  //             <LoginForm onLogin={handleLogin} />
  //             <p>Don't have an account? <button onClick={toggleShowRegisterForm}>Register</button></p>
  //           </div>
  //         )}
  //       </>
  //     ) : (
  //       <>
  //         <button onClick={handleLogout}>Logout</button>
  //         <TripForm onSubmit={handleFormSubmit} initialData={editingTrip} />
  //         <TripsList trips={trips} onDelete={handleDelete} onEdit={handleEdit} />
  //       </>
  //     )}
  //   </div>
  // ); 
      <div className="App">
      <h1>Trips Management</h1>
      <TripForm onSubmit={handleFormSubmit} initialData={editingTrip} />
      <TripsList trips={trips} onDelete={handleDelete} onEdit={handleEdit} />
    </div>
  );
};

export default App;
