import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recipe from '../models/Recipe';
import updatedRecipes from './updatedRecipes';

dotenv.config();

const updateRecipeImages = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recipe-finder');
    console.log('Connected to MongoDB');

    // Update each recipe's image
    for (const recipe of updatedRecipes) {
      const result = await Recipe.findOneAndUpdate(
        { name: recipe.name },
        { $set: { image: recipe.image } },
        { new: true }
      );

      if (result) {
        console.log(`Updated image for ${recipe.name}`);
      } else {
        console.log(`Recipe not found: ${recipe.name}`);
      }
    }

    console.log('Recipe images update completed');
    process.exit(0);
  } catch (error) {
    console.error('Error updating recipe images:', error);
    process.exit(1);
  }
};

updateRecipeImages(); 