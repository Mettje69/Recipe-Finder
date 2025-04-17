import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Mock user database
const users = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'password123', // In a real app, this would be hashed
    name: 'Test User'
  }
];

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      email,
      password, // In a real app, this would be hashed
      name
    };
    users.push(newUser);

    // Generate token
    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({ user: { id: newUser.id, email: newUser.email, name: newUser.name }, token });
  } catch (error) {
    res.status(400).json({ error: 'Error creating user' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    // Check password
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (error) {
    res.status(400).json({ error: 'Error logging in' });
  }
});

// Get current user
router.get('/me', (req, res) => {
  try {
    // In a real app, this would use the auth middleware
    // For now, just return a mock user
    res.json({ user: users[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

export default router; 