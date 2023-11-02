// src/components/TripsList.js
import React from 'react';

const TripsList = ({ trips, onDelete, onEdit }) => {
  return (
    <ul>
      {trips.map((trip) => (
        <li key={trip.trip_id}>
          {trip.destination} - {trip.origin} | Departure: {trip.departure_date} | Return: {trip.return_date}
          <button onClick={() => onEdit(trip)}>Edit</button>
          <button onClick={() => onDelete(trip.trip_id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TripsList;
