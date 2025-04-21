import mongoose from 'mongoose';
import User from '../models/User';

const updatedRecipes = [
  // Chinese Cuisine
  {
    name: "Chinese Dumplings",
    description: "Homemade pork and vegetable dumplings",
    ingredients: ["Dumpling Wrappers", "Ground Pork", "Cabbage", "Ginger", "Garlic", "Soy Sauce", "Sesame Oil", "Green Onions"],
    instructions: "1. Make filling\n2. Wrap dumplings\n3. Steam or fry\n4. Serve with sauce",
    cookTime: "60",
    difficulty: "Medium",
    servings: 6,
    category: "Chinese",
    image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },

  // Vietnamese Cuisine
  {
    name: "Vietnamese Pho",
    description: "Traditional Vietnamese noodle soup",
    ingredients: ["Rice Noodles", "Beef", "Onion", "Ginger", "Star Anise", "Cinnamon", "Cardamom", "Bean Sprouts", "Thai Basil", "Lime"],
    instructions: "1. Make broth\n2. Cook noodles\n3. Slice beef\n4. Assemble bowl",
    cookTime: "90",
    difficulty: "Hard",
    servings: 4,
    category: "Vietnamese",
    image: "https://images.unsplash.com/photo-1555126634-323283e090fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },

  // Quick Recipes
  {
    name: "Microwave Baked Potato",
    description: "Classic baked potato in the microwave",
    ingredients: ["Potato", "Butter", "Salt", "Optional: cheese, sour cream"],
    instructions: [
      "Wash potato and prick several times",
      "Microwave 5 minutes, turn over",
      "Microwave 3-5 more minutes until tender",
      "Cut open, fluff with fork, add toppings"
    ],
    cookTime: "10",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },

  // Italian Cuisine
  {
    name: "Spaghetti Carbonara",
    description: "Classic Italian pasta dish with eggs, cheese, pancetta, and black pepper",
    ingredients: ["Spaghetti", "Eggs", "Pecorino Romano", "Parmesan", "Pancetta", "Black Pepper", "Garlic", "Olive Oil"],
    instructions: "1. Cook pasta in salted water\n2. Fry pancetta until crispy\n3. Mix eggs and cheese\n4. Combine all ingredients",
    cookTime: "30",
    difficulty: "Medium",
    servings: 4,
    category: "Italian",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  
  {
    name: "Margherita Pizza",
    description: "Traditional Neapolitan pizza with tomatoes, mozzarella, and basil",
    ingredients: ["Pizza Dough", "Tomato Sauce", "Mozzarella", "Fresh Basil", "Olive Oil", "Garlic", "Oregano"],
    instructions: "1. Prepare dough\n2. Add toppings\n3. Bake at high heat\n4. Garnish with basil",
    cookTime: "25",
    difficulty: "Medium",
    servings: 4,
    category: "Italian",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  
  {
    name: "Risotto alla Milanese",
    description: "Creamy Italian rice dish with saffron and parmesan",
    ingredients: ["Arborio Rice", "Saffron", "Parmesan", "Butter", "White Wine", "Onion", "Chicken Stock"],
    instructions: "1. Toast rice\n2. Add wine\n3. Gradually add stock\n4. Finish with cheese",
    cookTime: "35",
    difficulty: "Medium",
    servings: 4,
    category: "Italian",
    image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  
  {
    name: "Pasta Primavera",
    description: "Fresh pasta dish with spring vegetables",
    ingredients: ["Pasta", "Broccoli", "Carrots", "Bell Peppers", "Zucchini", "Cherry Tomatoes", "Garlic", "Olive Oil", "Parmesan", "Fresh Basil"],
    instructions: "1. Cook pasta\n2. Sauté vegetables\n3. Combine with sauce\n4. Top with cheese",
    cookTime: "25",
    difficulty: "Easy",
    servings: 4,
    category: "Italian",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  
  {
    name: "Osso Buco",
    description: "Classic Italian braised veal shanks",
    ingredients: ["Veal Shanks", "White Wine", "Chicken Stock", "Carrots", "Celery", "Onion", "Garlic", "Tomato Paste", "Gremolata"],
    instructions: "1. Brown meat\n2. Cook vegetables\n3. Add liquid\n4. Braise until tender",
    cookTime: "120",
    difficulty: "Hard",
    servings: 4,
    category: "Italian",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },

  // Japanese Cuisine
  {
    name: "Sushi Roll",
    description: "Homemade California roll with crab and avocado",
    ingredients: ["Sushi Rice", "Nori", "Crab Meat", "Avocado", "Cucumber", "Sesame Seeds", "Soy Sauce", "Wasabi"],
    instructions: "1. Cook sushi rice\n2. Prepare fillings\n3. Roll sushi\n4. Cut and serve",
    cookTime: "45",
    difficulty: "Hard",
    servings: 4,
    category: "Japanese",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },

  {
    name: "Okonomiyaki",
    description: "Japanese savory pancake",
    ingredients: ["Cabbage", "Flour", "Eggs", "Pork Belly", "Green Onions", "Okonomiyaki Sauce", "Mayo", "Bonito Flakes"],
    instructions: "1. Mix batter\n2. Add fillings\n3. Cook pancake\n4. Add toppings",
    cookTime: "30",
    difficulty: "Medium",
    servings: 4,
    category: "Japanese",
    image: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },

  // Indian Cuisine
  {
    name: "Butter Chicken",
    description: "Creamy Indian curry with tender chicken",
    ingredients: ["Chicken", "Yogurt", "Tomato Sauce", "Cream", "Garam Masala", "Ginger", "Garlic", "Rice"],
    instructions: "1. Marinate chicken\n2. Cook sauce\n3. Add chicken\n4. Finish with cream",
    cookTime: "45",
    difficulty: "Medium",
    servings: 4,
    category: "Indian",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },

  // Mexican Cuisine
  {
    name: "Beef Tacos",
    description: "Mexican-style beef tacos with fresh toppings",
    ingredients: ["Ground Beef", "Taco Seasoning", "Tortillas", "Lettuce", "Tomatoes", "Onions", "Cilantro", "Lime", "Sour Cream", "Cheese"],
    instructions: "1. Brown beef\n2. Add seasoning\n3. Warm tortillas\n4. Assemble tacos",
    cookTime: "25",
    difficulty: "Easy",
    servings: 4,
    category: "Mexican",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

export default updatedRecipes; 