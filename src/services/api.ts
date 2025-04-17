import { Recipe, RecipeFilters } from '../types';

// Make sure this URL matches your backend server
const API_URL = 'http://localhost:5000/api';

export const api = {
  // Get all recipes
  getAllRecipes: async (): Promise<Recipe[]> => {
    console.log('API: Starting getAllRecipes request to', `${API_URL}/recipes`)
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `${API_URL}/recipes`, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      xhr.onload = function() {
        console.log('API: getAllRecipes response status:', xhr.status)
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);
            console.log('API: Successfully parsed recipes response:', data)
            resolve(data);
          } catch (error) {
            console.error('API: Failed to parse response:', error)
            reject(new Error('Failed to parse response'));
          }
        } else {
          console.error('API: Request failed with status', xhr.status)
          reject(new Error(`Request failed with status ${xhr.status}`));
        }
      };
      
      xhr.onerror = function(error) {
        console.error('API: Network error occurred:', error)
        reject(new Error('Network error occurred'));
      };
      
      console.log('API: Sending getAllRecipes request')
      xhr.send();
    });
  },

  // Search recipes by ingredients
  searchRecipes: async (ingredients: string[], filters: RecipeFilters): Promise<Recipe[]> => {
    try {
      const response = await fetch(`${API_URL}/recipes/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ ingredients, filters }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to search recipes: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  // Get recipe by ID
  getRecipeById: async (id: string): Promise<Recipe> => {
    try {
      const response = await fetch(`${API_URL}/recipes/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recipe: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  // Create new recipe
  createRecipe: async (recipe: Omit<Recipe, 'id'>): Promise<Recipe> => {
    try {
      const response = await fetch(`${API_URL}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(recipe),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create recipe: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  // Update recipe
  updateRecipe: async (id: string, recipe: Partial<Recipe>): Promise<Recipe> => {
    try {
      const response = await fetch(`${API_URL}/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(recipe),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update recipe: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  // Delete recipe
  deleteRecipe: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/recipes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete recipe: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },
}; 