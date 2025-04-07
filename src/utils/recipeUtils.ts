import { Recipe } from '../types'

// Sample recipes data - in a real app, this would come from an API
const recipes: Recipe[] = [
  {
    id: '1',
    name: 'Pasta with Tomato Sauce',
    image: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=500',
    ingredients: ['Pasta', 'Tomato Sauce', 'Garlic', 'Olive Oil', 'Salt', 'Pepper'],
    instructions: [
      'Boil pasta according to package instructions',
      'Heat olive oil in a pan and add minced garlic',
      'Add tomato sauce and seasonings',
      'Combine with cooked pasta'
    ],
    prepTime: '5 mins',
    cookTime: '15 mins',
    servings: 4,
    difficulty: 'Easy',
    category: 'Italian'
  },
  {
    id: '2',
    name: 'Chicken Stir Fry',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500',
    ingredients: ['Chicken', 'Bell Pepper', 'Onion', 'Soy Sauce', 'Rice', 'Olive Oil'],
    instructions: [
      'Cook rice according to package instructions',
      'Cut chicken and vegetables into bite-sized pieces',
      'Stir fry chicken in olive oil until cooked',
      'Add vegetables and soy sauce',
      'Serve over rice'
    ],
    prepTime: '10 mins',
    cookTime: '20 mins',
    servings: 4,
    difficulty: 'Medium',
    category: 'Asian'
  },
  {
    id: '3',
    name: 'Vegetable Omelette',
    image: 'https://images.unsplash.com/photo-1612240498936-65f5101365d2?w=500',
    ingredients: ['Eggs', 'Bell Pepper', 'Onion', 'Cheese', 'Salt', 'Pepper'],
    instructions: [
      'Beat eggs with salt and pepper',
      'Dice vegetables',
      'Cook vegetables in a pan',
      'Pour eggs over vegetables',
      'Add cheese and fold omelette'
    ],
    prepTime: '5 mins',
    cookTime: '10 mins',
    servings: 2,
    difficulty: 'Easy',
    category: 'Breakfast'
  },
  {
    id: '4',
    name: 'Greek Salad',
    image: 'https://images.unsplash.com/photo-1588644525273-f37b60d78512?w=500',
    ingredients: ['Tomato', 'Cucumber', 'Red Onion', 'Olive Oil', 'Salt', 'Pepper', 'Cheese'],
    instructions: [
      'Chop tomatoes, cucumber, and red onion',
      'Combine vegetables in a bowl',
      'Add olive oil and seasonings',
      'Top with crumbled cheese'
    ],
    prepTime: '10 mins',
    cookTime: '0 mins',
    servings: 2,
    difficulty: 'Easy',
    category: 'Salads'
  },
  {
    id: '5',
    name: 'Beef Stir Fry',
    image: 'https://images.unsplash.com/photo-1605908580297-f3e1c02e64ff?w=500',
    ingredients: ['Beef', 'Bell Pepper', 'Onion', 'Soy Sauce', 'Rice', 'Olive Oil'],
    instructions: [
      'Cook rice according to package instructions',
      'Slice beef into thin strips',
      'Stir fry beef in olive oil until browned',
      'Add vegetables and soy sauce',
      'Serve over rice'
    ],
    prepTime: '15 mins',
    cookTime: '25 mins',
    servings: 4,
    difficulty: 'Medium',
    category: 'Asian'
  }
]

export const findRecipes = (selectedIngredients: string[]): Recipe[] => {
  if (selectedIngredients.length === 0) return []
  
  const normalizedSelectedIngredients = new Set(
    selectedIngredients.map(i => i.toLowerCase())
  )

  // Consider common pantry items as always available
  const commonIngredients = new Set(['salt', 'pepper', 'olive oil'].map(i => i.toLowerCase()))

  return recipes.filter(recipe => {
    const recipeIngredients = recipe.ingredients.map(i => i.toLowerCase())
    const requiredIngredients = new Set(
      recipeIngredients.filter(i => !commonIngredients.has(i))
    )
    
    let matchCount = 0
    for (const ingredient of requiredIngredients) {
      if (normalizedSelectedIngredients.has(ingredient)) {
        matchCount++
      }
    }

    // Recipe should match if user has at least 70% of non-common ingredients
    const matchPercentage = matchCount / requiredIngredients.size
    return matchPercentage >= 0.7
  })
} 