import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const THEMEALDB_API_KEY = process.env.THEMEALDB_API_KEY;

async function testSpoonacular() {
  try {
    console.log('Testing Spoonacular API...');
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/random?apiKey=${SPOONACULAR_API_KEY}&number=1`
    );
    console.log('Spoonacular API Response:', {
      status: response.status,
      recipeCount: response.data.recipes.length,
      firstRecipe: response.data.recipes[0].title
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Spoonacular API Error:', error.response?.data || error.message);
    } else {
      console.error('Spoonacular API Error:', error);
    }
  }
}

async function testTheMealDB() {
  try {
    console.log('\nTesting TheMealDB API...');
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/${THEMEALDB_API_KEY}/search.php?s=chicken`
    );
    console.log('TheMealDB API Response:', {
      status: response.status,
      recipeCount: response.data.meals?.length || 0,
      firstRecipe: response.data.meals?.[0]?.strMeal || 'No recipes found'
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('TheMealDB API Error:', error.response?.data || error.message);
    } else {
      console.error('TheMealDB API Error:', error);
    }
  }
}

async function testAllApis() {
  await testSpoonacular();
  await testTheMealDB();
}

testAllApis(); 