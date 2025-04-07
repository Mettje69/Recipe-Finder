export interface IngredientCategory {
  name: string;
  ingredients: string[];
}

export const ingredientCategories: IngredientCategory[] = [
  {
    name: 'Proteins',
    ingredients: [
      'chicken breast',
      'ground beef',
      'salmon',
      'eggs',
      'tofu',
      'shrimp',
      'pork chops',
      'turkey',
      'lamb',
      'bacon'
    ]
  },
  {
    name: 'Vegetables',
    ingredients: [
      'broccoli',
      'carrots',
      'spinach',
      'bell peppers',
      'zucchini',
      'mushrooms',
      'onions',
      'garlic',
      'tomatoes',
      'lettuce',
      'cucumber',
      'asparagus',
      'cauliflower',
      'potatoes',
      'sweet potatoes'
    ]
  },
  {
    name: 'Grains & Pasta',
    ingredients: [
      'rice',
      'pasta',
      'quinoa',
      'bread',
      'tortillas',
      'flour',
      'oats',
      'couscous',
      'noodles'
    ]
  },
  {
    name: 'Dairy & Alternatives',
    ingredients: [
      'milk',
      'cheese',
      'yogurt',
      'butter',
      'cream',
      'sour cream',
      'almond milk',
      'soy milk',
      'coconut milk'
    ]
  },
  {
    name: 'Fruits',
    ingredients: [
      'apples',
      'bananas',
      'oranges',
      'berries',
      'lemons',
      'limes',
      'avocados',
      'pineapple',
      'mango',
      'peaches'
    ]
  },
  {
    name: 'Herbs & Spices',
    ingredients: [
      'basil',
      'oregano',
      'thyme',
      'rosemary',
      'cilantro',
      'parsley',
      'cumin',
      'paprika',
      'chili powder',
      'curry powder',
      'ginger',
      'garlic powder',
      'onion powder',
      'black pepper',
      'salt'
    ]
  },
  {
    name: 'Condiments & Sauces',
    ingredients: [
      'olive oil',
      'soy sauce',
      'vinegar',
      'ketchup',
      'mustard',
      'mayonnaise',
      'hot sauce',
      'barbecue sauce',
      'teriyaki sauce',
      'salsa'
    ]
  },
  {
    name: 'Nuts & Seeds',
    ingredients: [
      'almonds',
      'peanuts',
      'walnuts',
      'chia seeds',
      'flax seeds',
      'sunflower seeds',
      'pumpkin seeds',
      'cashews',
      'pecans',
      'hazelnuts'
    ]
  },
  {
    name: 'Sweeteners',
    ingredients: [
      'sugar',
      'honey',
      'maple syrup',
      'agave nectar',
      'stevia',
      'brown sugar',
      'powdered sugar',
      'molasses'
    ]
  },
  {
    name: 'Other',
    ingredients: [
      'chocolate chips',
      'coconut',
      'raisins',
      'dried cranberries',
      'breadcrumbs',
      'yeast',
      'baking powder',
      'baking soda',
      'vanilla extract',
      'chicken broth',
      'beef broth',
      'vegetable broth'
    ]
  }
];

// Flatten ingredients array for search functionality
export const ingredients = ingredientCategories.flatMap(category => category.ingredients) 