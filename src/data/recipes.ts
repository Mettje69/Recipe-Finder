import { Recipe } from '../types';
import { ingredientCategories } from '../data/ingredients';

// Sample recipe data
const recipes: Recipe[] = [
  {
    id: '1',
    name: 'Spaghetti Carbonara',
    description: 'A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.',
    ingredients: ['Pasta', 'Eggs', 'Cheese', 'Bacon', 'Black Pepper'],
    instructions: [
      'Bring a large pot of salted water to boil and cook Pasta according to package directions.',
      'Meanwhile, whisk Eggs and Cheese in a bowl.',
      'Cook Bacon in a large skillet until crispy.',
      'Drain Pasta, reserving some pasta water.',
      'Working quickly, add hot Pasta to skillet with Bacon, remove from heat.',
      'Add egg mixture, stirring constantly to create a creamy sauce.',
      'Add pasta water if needed to reach desired consistency.',
      'Season with Black Pepper and serve immediately.'
    ],
    prepTime: '10 minutes',
    cookTime: '20 minutes',
    difficulty: 'Medium',
    servings: 4,
    category: 'Italian',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: '2',
    name: 'Classic Burger',
    description: 'A juicy beef burger with fresh toppings on a toasted bun.',
    ingredients: ['Ground Beef', 'Bread', 'Lettuce', 'Tomatoes', 'Onions', 'Cheese'],
    instructions: [
      'Form Ground Beef into patties, season with salt and pepper.',
      'Heat grill or skillet to medium-high heat.',
      'Cook patties for 4-5 minutes per side for medium-rare.',
      'Add Cheese during the last minute of cooking if desired.',
      'Toast Bread.',
      'Assemble burgers with Lettuce, Tomatoes, and Onions.',
      'Serve with your favorite condiments.'
    ],
    prepTime: '15 minutes',
    cookTime: '10 minutes',
    difficulty: 'Easy',
    servings: 4,
    category: 'American',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: '3',
    name: 'Chicken Stir Fry',
    description: 'A quick and healthy Asian-inspired dish with chicken and vegetables.',
    ingredients: ['Chicken Breast', 'Broccoli', 'Carrots', 'Soy Sauce', 'Ginger', 'Garlic'],
    instructions: [
      'Cut Chicken Breast into bite-sized pieces.',
      'Chop vegetables into similar-sized pieces.',
      'Mix Soy Sauce, Ginger, and Garlic in a small bowl.',
      'Heat oil in a wok or large skillet over high heat.',
      'Add Chicken Breast and cook until no longer pink, about 5 minutes.',
      'Add vegetables and stir-fry until tender-crisp, about 3-5 minutes.',
      'Pour sauce over Chicken Breast and vegetables, stir to coat.',
      'Serve hot with rice or noodles.'
    ],
    prepTime: '15 minutes',
    cookTime: '15 minutes',
    difficulty: 'Medium',
    servings: 4,
    category: 'Asian',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: '4',
    name: 'Fettuccine Alfredo',
    description: 'A creamy Italian pasta dish with fettuccine noodles and parmesan cheese.',
    ingredients: ['Pasta', 'Cream', 'Cheese', 'Butter', 'Garlic', 'Black Pepper'],
    instructions: [
      'Cook Pasta according to package directions.',
      'In a large skillet, melt Butter and sauté Garlic until fragrant.',
      'Add Cream and bring to a simmer.',
      'Gradually add Cheese, stirring until melted and smooth.',
      'Add cooked Pasta and toss to coat.',
      'Season with Black Pepper and serve immediately.'
    ],
    prepTime: '10 minutes',
    cookTime: '15 minutes',
    difficulty: 'Easy',
    servings: 4,
    category: 'Italian',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }
];

// Get all valid ingredients from categories
const validIngredients = ingredientCategories.flatMap(category => category.ingredients.map(ingredient => ingredient.toLowerCase()));

// Function to validate recipe ingredients
export const validateRecipeIngredients = (recipes: Recipe[]): Recipe[] => {
  return recipes.map(recipe => {
    const invalidIngredients = recipe.ingredients.filter(ingredient => 
      !validIngredients.includes(ingredient.toLowerCase())
    );

    if (invalidIngredients.length > 0) {
      console.warn(`Invalid ingredients found in recipe "${recipe.name}":`, invalidIngredients);
      // Optionally, you can remove invalid ingredients or handle them as needed
      recipe.ingredients = recipe.ingredients.filter(ingredient => 
        validIngredients.includes(ingredient.toLowerCase())
      );
    }

    return recipe;
  });
};

/**
 * Find recipes that can be made with the given ingredients
 * @param selectedIngredients Array of ingredients the user has selected
 * @returns Array of recipes that can be made with the selected ingredients
 */
export const findRecipesByIngredients = (selectedIngredients: string[]): Recipe[] => {
  // If no ingredients are selected, return all recipes
  if (selectedIngredients.length === 0) {
    return recipes;
  }

  // Filter recipes that contain at least one of the selected ingredients
  return recipes.filter(recipe => {
    // Check if any of the recipe's ingredients match the selected ingredients
    return recipe.ingredients.some(recipeIngredient => 
      selectedIngredients.some(selectedIngredient => 
        recipeIngredient.toLowerCase().includes(selectedIngredient.toLowerCase())
      )
    );
  });
};

export default recipes; 