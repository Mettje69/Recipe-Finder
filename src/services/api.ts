import { Recipe, RecipeFilters } from '../types';

const API_URL = 'http://localhost:5000/api';

export const api = {
  // Get all recipes
  getAllRecipes: async (): Promise<Recipe[]> => {
    const response = await fetch(`${API_URL}/recipes`);
    if (!response.ok) throw new Error('Failed to fetch recipes');
    return response.json();
  },

  // Search recipes by ingredients
  searchRecipes: async (ingredients: string[], filters: RecipeFilters): Promise<Recipe[]> => {
    const response = await fetch(`${API_URL}/recipes/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients, filters }),
    });
    if (!response.ok) throw new Error('Failed to search recipes');
    return response.json();
  },

  // Get recipe by ID
  getRecipeById: async (id: string): Promise<Recipe> => {
    const response = await fetch(`${API_URL}/recipes/${id}`);
    if (!response.ok) throw new Error('Failed to fetch recipe');
    return response.json();
  },

  // Create new recipe
  createRecipe: async (recipe: Omit<Recipe, 'id'>): Promise<Recipe> => {
    const response = await fetch(`${API_URL}/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
    });
    if (!response.ok) throw new Error('Failed to create recipe');
    return response.json();
  },

  // Update recipe
  updateRecipe: async (id: string, recipe: Partial<Recipe>): Promise<Recipe> => {
    const response = await fetch(`${API_URL}/recipes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
    });
    if (!response.ok) throw new Error('Failed to update recipe');
    return response.json();
  },

  // Delete recipe
  deleteRecipe: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/recipes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete recipe');
  },
}; 