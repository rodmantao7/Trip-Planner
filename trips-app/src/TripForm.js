// src/components/TripForm.js
import React, { useState, useEffect } from 'react';

const TripForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    destination: '',
    origin: '',
    distance: '',
    price: '',
    departure_date: '',
    return_date: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        destination: initialData.destination,
        origin: initialData.origin,
        distance: initialData.distance,
        price: initialData.price,
        departure_date: initialData.departure_date,
        return_date: initialData.return_date,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      destination: '',
      origin: '',
      distance: '',
      price: '',
      departure_date: '',
      return_date: '',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Destination:
        <input
          type="text"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Origin:
        <input
          type="text"
          name="origin"
          value={formData.origin}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Distance:
        <input
          type="number"
          name="distance"
          value={formData.distance}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Price:
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Departure Date:
        <input
          type="date"
          name="departure_date"
          value={formData.departure_date}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Return Date:
        <input
          type="date"
          name="return_date"
          value={formData.return_date}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default TripForm;
