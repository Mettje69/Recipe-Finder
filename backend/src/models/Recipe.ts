import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  ingredients: [{
    type: String,
    required: true,
    trim: true
  }],
  instructions: [{
    type: String,
    required: true,
    trim: true
  }],
  cookTime: {
    type: Number,
    required: true,
    min: 0
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  servings: {
    type: Number,
    required: true,
    min: 1
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
recipeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create text indexes for searching
recipeSchema.index({ name: 'text', description: 'text', ingredients: 'text', category: 'text' });

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe; 