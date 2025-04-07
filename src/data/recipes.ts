import { Recipe } from '../types';

// Sample recipe data
const recipes: Recipe[] = [
  {
    id: '1',
    name: 'Spaghetti Carbonara',
    description: 'A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.',
    ingredients: ['spaghetti', 'eggs', 'pecorino cheese', 'guanciale', 'black pepper'],
    instructions: [
      'Bring a large pot of salted water to boil and cook spaghetti according to package directions.',
      'Meanwhile, whisk eggs and cheese in a bowl.',
      'Cook guanciale in a large skillet until crispy.',
      'Drain pasta, reserving some pasta water.',
      'Working quickly, add hot pasta to skillet with guanciale, remove from heat.',
      'Add egg mixture, stirring constantly to create a creamy sauce.',
      'Add pasta water if needed to reach desired consistency.',
      'Season with black pepper and serve immediately.'
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
    ingredients: ['ground beef', 'burger buns', 'lettuce', 'tomato', 'onion', 'cheese'],
    instructions: [
      'Form ground beef into patties, season with salt and pepper.',
      'Heat grill or skillet to medium-high heat.',
      'Cook patties for 4-5 minutes per side for medium-rare.',
      'Add cheese during the last minute of cooking if desired.',
      'Toast burger buns.',
      'Assemble burgers with lettuce, tomato, and onion.',
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
    ingredients: ['chicken breast', 'broccoli', 'carrots', 'soy sauce', 'ginger', 'garlic'],
    instructions: [
      'Cut chicken into bite-sized pieces.',
      'Chop vegetables into similar-sized pieces.',
      'Mix soy sauce, ginger, and garlic in a small bowl.',
      'Heat oil in a wok or large skillet over high heat.',
      'Add chicken and cook until no longer pink, about 5 minutes.',
      'Add vegetables and stir-fry until tender-crisp, about 3-5 minutes.',
      'Pour sauce over chicken and vegetables, stir to coat.',
      'Serve hot with rice or noodles.'
    ],
    prepTime: '15 minutes',
    cookTime: '15 minutes',
    difficulty: 'Medium',
    servings: 4,
    category: 'Asian',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }
];

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