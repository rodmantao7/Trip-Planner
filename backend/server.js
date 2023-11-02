const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3001;

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key';

// Database connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Nguyenviet@nh02',
  database: 'app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.post('/api/users/register', async (req, res) => {
    console.log("Register endpoint hit");
    try {
        const { email, username, first_name, last_name, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (email, username, first_name, last_name, password) VALUES (?, ?, ?, ?, ?)',
            [email, username, first_name, last_name, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/users/:userId', async (req, res) => {
    const [rows] = await pool.query('SELECT user_id, email, username, first_name, last_name FROM users WHERE user_id = ?', [req.params.userId]);
    if (rows.length > 0) {
        res.json(rows[0]);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

app.put('/api/users/:userId', async (req, res) => {
    const { email, username, first_name, last_name } = req.body;
    await pool.query('UPDATE users SET email = ?, username = ?, first_name = ?, last_name = ? WHERE user_id = ?',
        [email, username, first_name, last_name, req.params.userId]);
    res.status(200).json({ message: 'User updated successfully' });
});

app.post('/api/users/login', async (req, res) => {
    console.log("Login endpoint hit");
    const { username, password } = req.body;
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = users[0];
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ userId: user.user_id }, SECRET_KEY);
        res.json({ token, username });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

// Middleware to protect routes
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Fetch all trips
app.get('/api/trips', authenticateJWT, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM trips');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch a single trip by ID
app.get('/api/trips/:tripId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM trips WHERE trip_id = ?', [req.params.tripId]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Trip not found' });
    } else {
      res.json(rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new trip
app.post('/api/trips', async (req, res) => {
  const { destination, origin, distance, price, departure_date, return_date } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO trips (destination, origin, distance, price, departure_date, return_date) VALUES (?, ?, ?, ?, ?, ?)',
      [destination, origin, distance, price, departure_date, return_date]);
    res.status(201).json({ trip_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a trip
app.put('/api/trips/:tripId', async (req, res) => {
  const { destination, origin, distance, price, departure_date, return_date } = req.body;
  try {
    await pool.query('UPDATE trips SET destination = ?, origin = ?, distance = ?, price = ?, departure_date = ?, return_date = ? WHERE trip_id = ?',
      [destination, origin, distance, price, departure_date, return_date, req.params.tripId]);
    res.status(200).json({ message: 'Trip updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a trip
app.delete('/api/trips/:tripId', async (req, res) => {
  try {
    await pool.query('DELETE FROM trips WHERE trip_id = ?', [req.params.tripId]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
