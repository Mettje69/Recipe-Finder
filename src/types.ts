export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  category?: string;
}

export interface IngredientCategory {
  name: string;
  ingredients: string[];
}

export interface RecipeFilters {
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  category?: string;
  maxCookTime?: number;
  minServings?: number;
  maxServings?: number;
}

export type SortOption = 'name' | 'cookTime' | 'difficulty' | 'ingredients'; 