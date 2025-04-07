import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recipe from '../models/Recipe';

dotenv.config();

const THEMEALDB_API_KEY = process.env.THEMEALDB_API_KEY;

// List of search terms to get a variety of recipes
const searchTerms = [
  'chicken', 'beef', 'fish', 'vegetarian', 'pasta',
  'soup', 'salad', 'rice', 'curry', 'breakfast',
  'dessert', 'bread', 'pork', 'lamb', 'seafood'
];

async function fetchTheMealDBRecipes() {
  const allRecipes = [];

  for (const term of searchTerms) {
    try {
      console.log(`Fetching recipes for "${term}"...`);
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/${THEMEALDB_API_KEY}/search.php?s=${term}`
      );
      
      if (response.data.meals) {
        const recipes = response.data.meals.map((recipe: any) => {
          // Get all ingredients and measures
          const ingredients = [];
          for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
              ingredients.push(`${measure?.trim() || ''} ${ingredient.trim()}`.trim());
            }
          }

          return {
            name: recipe.strMeal,
            description: `${recipe.strArea} ${recipe.strCategory} dish`,
            ingredients,
            instructions: recipe.strInstructions,
            cookTime: '45', // Default value as API doesn't provide it
            difficulty: recipe.strCategory.toLowerCase().includes('dessert') ? 'Easy' : 'Medium',
            servings: 4,
            category: recipe.strArea,
            image: recipe.strMealThumb,
            source: `https://www.themealdb.com/meal/${recipe.idMeal}`
          };
        });

        allRecipes.push(...recipes);
        console.log(`Found ${recipes.length} recipes for "${term}"`);
      }
    } catch (error) {
      console.error(`Error fetching recipes for "${term}":`, error);
    }
  }

  return allRecipes;
}

async function fetchAndStoreRecipes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recipe-finder');
    console.log('Connected to MongoDB');

    // Fetch recipes
    const recipes = await fetchTheMealDBRecipes();
    console.log(`\nTotal recipes fetched: ${recipes.length}`);

    // Clear existing recipes
    await Recipe.deleteMany({});
    console.log('Cleared existing recipes');

    // Insert new recipes
    await Recipe.insertMany(recipes);
    console.log(`Added ${recipes.length} recipes to database`);

    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fetchAndStoreRecipes(); 