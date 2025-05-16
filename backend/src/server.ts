import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import recipeRoutes from './routes/recipeRoutes';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/auth', authRoutes);

// Connect to MongoDB with better error handling
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipe-finder';
    console.log(`Attempting to connect to MongoDB at: ${mongoURI}`);
    
    await mongoose.connect(mongoURI);
    console.log('Successfully connected to MongoDB');
    
    // Log the database name
    if (mongoose.connection.db) {
      const dbName = mongoose.connection.db.databaseName;
      console.log(`Connected to database: ${dbName}`);
      
      // Log collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Available collections:', collections.map(c => c.name));
    }
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit with failure
  }
};

connectDB();

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 