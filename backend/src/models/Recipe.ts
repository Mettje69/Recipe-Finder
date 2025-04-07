import mongoose, { Document } from 'mongoose';

export interface IRecipe extends Document {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: number;
  category: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  ingredients: [{
    type: String,
    required: true
  }],
  instructions: [{
    type: String,
    required: true
  }],
  cookTime: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  servings: {
    type: Number,
    required: true,
    min: 1
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for searching recipes by ingredients
recipeSchema.index({ ingredients: 'text' });

export default mongoose.model<IRecipe>('Recipe', recipeSchema); 