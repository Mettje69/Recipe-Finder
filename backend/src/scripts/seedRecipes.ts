import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recipe from '../models/Recipe';
import User from '../models/User';

dotenv.config();

// Create a default user first
const createDefaultUser = async () => {
  try {
    const defaultUser = await User.findOne({ username: 'admin' });
    if (!defaultUser) {
      const newUser = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123'
      });
      return await newUser.save();
    }
    return defaultUser;
  } catch (error) {
    console.error('Error creating default user:', error);
    throw error;
  }
};

const sampleRecipes = [
  // Italian Cuisine
  {
    name: "Spaghetti Carbonara",
    description: "Classic Italian pasta dish with eggs, cheese, pancetta, and black pepper",
    ingredients: ["Spaghetti", "Eggs", "Pecorino Romano", "Parmesan", "Pancetta", "Black Pepper", "Garlic", "Olive Oil"],
    instructions: [
      "Cook pasta in salted water until al dente",
      "Fry pancetta until crispy and golden",
      "Mix eggs and cheese in a bowl",
      "Combine hot pasta with egg mixture and pancetta"
    ],
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
    instructions: [
      "Prepare and stretch the pizza dough",
      "Spread tomato sauce evenly",
      "Add fresh mozzarella slices",
      "Bake at high heat until crust is golden",
      "Garnish with fresh basil leaves"
    ],
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
    instructions: [
      "Toast rice with onions until translucent",
      "Add white wine and let it absorb",
      "Gradually add hot stock while stirring",
      "Finish with butter and parmesan"
    ],
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
    instructions: [
      "Cook pasta until al dente",
      "Sauté vegetables until crisp-tender",
      "Combine pasta with vegetables and sauce",
      "Top with freshly grated parmesan"
    ],
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
    instructions: [
      "Brown veal shanks on all sides",
      "Sauté vegetables until softened",
      "Add wine and stock to cover",
      "Braise until meat is tender"
    ],
    cookTime: "120",
    difficulty: "Hard",
    servings: 4,
    category: "Italian",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },

  // Asian Cuisine
  {
    name: "Chicken Stir Fry",
    description: "Quick and healthy Asian-style stir fry with vegetables",
    ingredients: ["Chicken Breast", "Broccoli", "Carrots", "Bell Peppers", "Soy Sauce", "Ginger", "Garlic", "Sesame Oil", "Rice"],
    instructions: [
      "Cut chicken into bite-sized pieces",
      "Chop all vegetables into similar sizes",
      "Stir fry chicken until cooked through",
      "Add vegetables and sauce, cook until crisp-tender"
    ],
    cookTime: "25",
    difficulty: "Easy",
    servings: 4,
    category: "Asian",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Pad Thai",
    description: "Classic Thai noodle dish with tamarind sauce",
    ingredients: ["Rice Noodles", "Shrimp", "Tofu", "Bean Sprouts", "Eggs", "Tamarind Sauce", "Fish Sauce", "Peanuts", "Lime"],
    instructions: [
      "Soak rice noodles in warm water",
      "Cook protein of choice until done",
      "Add noodles and sauce, stir fry together",
      "Garnish with crushed peanuts and lime"
    ],
    cookTime: "30",
    difficulty: "Medium",
    servings: 4,
    category: "Thai",
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Korean Bibimbap",
    description: "Korean rice bowl with mixed vegetables and meat",
    ingredients: ["Rice", "Ground Beef", "Spinach", "Carrots", "Bean Sprouts", "Eggs", "Gochujang", "Sesame Oil", "Garlic"],
    instructions: [
      "Cook rice according to package instructions",
      "Prepare and season all vegetables separately",
      "Cook ground beef with seasonings",
      "Assemble bowl with rice, vegetables, and meat"
    ],
    cookTime: "40",
    difficulty: "Medium",
    servings: 4,
    category: "Korean",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Vietnamese Pho",
    description: "Traditional Vietnamese noodle soup",
    ingredients: ["Rice Noodles", "Beef", "Onion", "Ginger", "Star Anise", "Cinnamon", "Cardamom", "Bean Sprouts", "Thai Basil", "Lime"],
    instructions: [
      "Make aromatic broth with spices",
      "Cook rice noodles until tender",
      "Slice beef very thinly",
      "Assemble bowl with noodles, beef, and toppings"
    ],
    cookTime: "90",
    difficulty: "Hard",
    servings: 4,
    category: "Vietnamese",
    image: "https://images.unsplash.com/photo-1555126634-323283e090fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Chinese Dumplings",
    description: "Homemade pork and vegetable dumplings",
    ingredients: ["Dumpling Wrappers", "Ground Pork", "Cabbage", "Ginger", "Garlic", "Soy Sauce", "Sesame Oil", "Green Onions"],
    instructions: [
      "Mix filling ingredients thoroughly",
      "Fill and fold dumpling wrappers",
      "Steam or pan-fry until cooked",
      "Serve with dipping sauce"
    ],
    cookTime: "60",
    difficulty: "Medium",
    servings: 6,
    category: "Chinese",
    image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },

  // Mexican Cuisine
  {
    name: "Beef Tacos",
    description: "Mexican-style beef tacos with fresh toppings",
    ingredients: ["Ground Beef", "Taco Seasoning", "Tortillas", "Lettuce", "Tomatoes", "Onions", "Cilantro", "Lime", "Sour Cream", "Cheese"],
    instructions: [
      "Brown ground beef in a skillet",
      "Add taco seasoning and water, simmer",
      "Warm tortillas in a dry pan",
      "Assemble tacos with meat and toppings"
    ],
    cookTime: "25",
    difficulty: "Easy",
    servings: 4,
    category: "Mexican",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Enchiladas",
    description: "Corn tortillas filled with meat and cheese, topped with sauce",
    ingredients: ["Corn Tortillas", "Chicken", "Cheese", "Enchilada Sauce", "Onion", "Garlic", "Cumin", "Chili Powder"],
    instructions: [
      "Cook and shred chicken with seasonings",
      "Dip tortillas in sauce and fill with chicken",
      "Roll up and place in baking dish",
      "Top with sauce and cheese, bake until bubbly"
    ],
    cookTime: "45",
    difficulty: "Medium",
    servings: 6,
    category: "Mexican",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Guacamole",
    description: "Fresh avocado dip with lime and cilantro",
    ingredients: ["Avocado", "Lime", "Cilantro", "Onion", "Tomato", "Garlic", "Salt", "Cayenne"],
    instructions: [
      "Mash ripe avocados in a bowl",
      "Mix in chopped vegetables and herbs",
      "Season with lime juice and spices",
      "Chill for 30 minutes before serving"
    ],
    cookTime: "15",
    difficulty: "Easy",
    servings: 4,
    category: "Mexican",
    image: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Chiles en Nogada",
    description: "Stuffed poblano peppers with walnut sauce",
    ingredients: ["Poblano Peppers", "Ground Pork", "Apple", "Pear", "Raisins", "Walnuts", "Cream", "Pomegranate Seeds", "Parsley"],
    instructions: [
      "Roast and peel poblano peppers",
      "Prepare meat and fruit filling",
      "Stuff peppers and cover with walnut sauce",
      "Garnish with pomegranate seeds and parsley"
    ],
    cookTime: "75",
    difficulty: "Hard",
    servings: 6,
    category: "Mexican",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Pozole",
    description: "Traditional Mexican hominy soup",
    ingredients: ["Pork", "Hominy", "Dried Chiles", "Garlic", "Onion", "Cabbage", "Radishes", "Lime", "Oregano"],
    instructions: [
      "Cook pork until tender in seasoned broth",
      "Add hominy and continue cooking",
      "Prepare fresh toppings and garnishes",
      "Serve hot with lime and toppings"
    ],
    cookTime: "120",
    difficulty: "Medium",
    servings: 8,
    category: "Mexican",
    image: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },

  // Mediterranean Cuisine
  {
    name: "Greek Salad",
    description: "Fresh and healthy Greek salad with feta cheese",
    ingredients: ["Cucumber", "Tomatoes", "Red Onion", "Olives", "Feta", "Olive Oil", "Oregano", "Lettuce"],
    instructions: [
      "Chop vegetables into similar sizes",
      "Combine all ingredients in a large bowl",
      "Dress with olive oil and oregano",
      "Top with crumbled feta cheese"
    ],
    cookTime: "15",
    difficulty: "Easy",
    servings: 4,
    category: "Mediterranean",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Hummus",
    description: "Creamy chickpea dip with tahini and garlic",
    ingredients: ["Chickpeas", "Tahini", "Garlic", "Lemon", "Olive Oil", "Cumin", "Salt", "Paprika"],
    instructions: [
      "Process chickpeas until smooth",
      "Add tahini and seasonings",
      "Blend in olive oil and lemon juice",
      "Garnish with paprika and olive oil"
    ],
    cookTime: "15",
    difficulty: "Easy",
    servings: 4,
    category: "Mediterranean",
    image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Falafel",
    description: "Crispy chickpea patties with herbs and spices",
    ingredients: ["Chickpeas", "Parsley", "Cilantro", "Onion", "Garlic", "Cumin", "Coriander", "Baking Soda"],
    instructions: [
      "Process all ingredients until well combined",
      "Form mixture into small patties",
      "Fry until golden and crispy",
      "Serve with tahini sauce"
    ],
    cookTime: "30",
    difficulty: "Medium",
    servings: 4,
    category: "Mediterranean",
    image: "https://images.unsplash.com/photo-1593001874117-c7c8c1f5c1c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Paella",
    description: "Spanish rice dish with seafood",
    ingredients: ["Rice", "Shrimp", "Mussels", "Chicken", "Bell Peppers", "Tomatoes", "Saffron", "Olive Oil", "Garlic", "Onion"],
    instructions: [
      "Cook chicken and vegetables in paella pan",
      "Add rice and saffron-infused stock",
      "Add seafood when rice is almost done",
      "Cook until rice is tender and socarrat forms"
    ],
    cookTime: "45",
    difficulty: "Medium",
    servings: 6,
    category: "Spanish",
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Moussaka",
    description: "Greek eggplant casserole",
    ingredients: ["Eggplant", "Ground Lamb", "Onion", "Garlic", "Tomato Sauce", "Cinnamon", "Bechamel Sauce", "Parmesan"],
    instructions: [
      "Fry eggplant slices until golden",
      "Prepare spiced meat sauce",
      "Make bechamel sauce",
      "Layer ingredients and bake until bubbly"
    ],
    cookTime: "90",
    difficulty: "Hard",
    servings: 8,
    category: "Greek",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },

  // Japanese Cuisine
  {
    name: "Sushi Roll",
    description: "Fresh salmon and avocado roll",
    ingredients: ["Sushi Rice", "Nori", "Salmon", "Avocado", "Cucumber", "Wasabi", "Soy Sauce", "Rice Vinegar"],
    instructions: [
      "Prepare sushi rice with vinegar",
      "Place nori on bamboo mat",
      "Add rice and fillings",
      "Roll tightly and slice"
    ],
    cookTime: "45",
    difficulty: "Medium",
    servings: 4,
    category: "Japanese",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Miso Soup",
    description: "Traditional Japanese soup with tofu",
    ingredients: ["Miso Paste", "Dashi", "Tofu", "Green Onions", "Seaweed"],
    instructions: [
      "Prepare dashi stock",
      "Add miso paste and dissolve",
      "Add tofu and seaweed",
      "Garnish with green onions"
    ],
    cookTime: "20",
    difficulty: "Easy",
    servings: 4,
    category: "Japanese",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Tempura",
    description: "Crispy battered vegetables and seafood",
    ingredients: ["Shrimp", "Vegetables", "Flour", "Egg", "Ice Water", "Oil", "Tempura Sauce"],
    instructions: [
      "Prepare ice-cold batter",
      "Coat ingredients in batter",
      "Fry until golden and crispy",
      "Serve with tempura sauce"
    ],
    cookTime: "30",
    difficulty: "Medium",
    servings: 4,
    category: "Japanese",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Ramen",
    description: "Japanese noodle soup with rich broth",
    ingredients: ["Ramen Noodles", "Pork", "Egg", "Green Onions", "Corn", "Seaweed", "Ramen Broth"],
    instructions: [
      "Prepare ramen broth",
      "Cook noodles separately",
      "Add toppings to bowl",
      "Pour hot broth over noodles"
    ],
    cookTime: "60",
    difficulty: "Medium",
    servings: 4,
    category: "Japanese",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Okonomiyaki",
    description: "Japanese savory pancake",
    ingredients: ["Cabbage", "Flour", "Egg", "Pork", "Green Onions", "Okonomiyaki Sauce", "Mayonnaise", "Bonito Flakes"],
    instructions: [
      "Mix batter with shredded cabbage",
      "Cook pancake on griddle",
      "Add toppings and flip",
      "Drizzle with sauce and garnish"
    ],
    cookTime: "30",
    difficulty: "Medium",
    servings: 4,
    category: "Japanese",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },

  // Indian Cuisine
  {
    name: "Butter Chicken",
    description: "Creamy tomato-based curry with tender chicken",
    ingredients: ["Chicken", "Tomatoes", "Butter", "Cream", "Garam Masala", "Ginger", "Garlic", "Yogurt"],
    instructions: [
      "Marinate chicken in spiced yogurt",
      "Cook chicken until tender",
      "Prepare tomato-based sauce",
      "Combine and finish with cream"
    ],
    cookTime: "60",
    difficulty: "Medium",
    servings: 4,
    category: "Indian",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Vegetable Curry",
    description: "Spiced vegetable medley in curry sauce",
    ingredients: ["Mixed Vegetables", "Onion", "Tomatoes", "Coconut Milk", "Curry Powder", "Turmeric", "Cumin", "Coriander"],
    instructions: [
      "Sauté onions and spices",
      "Add vegetables and cook",
      "Simmer in coconut milk",
      "Garnish with fresh herbs"
    ],
    cookTime: "40",
    difficulty: "Easy",
    servings: 4,
    category: "Indian",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Naan Bread",
    description: "Soft and fluffy Indian flatbread",
    ingredients: ["Flour", "Yogurt", "Yeast", "Sugar", "Salt", "Butter", "Garlic"],
    instructions: [
      "Prepare and proof yeast dough",
      "Divide and shape into rounds",
      "Cook on hot griddle",
      "Brush with garlic butter"
    ],
    cookTime: "30",
    difficulty: "Medium",
    servings: 6,
    category: "Indian",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Tikka Masala",
    description: "Grilled chicken in spiced tomato sauce",
    ingredients: ["Chicken", "Yogurt", "Tomatoes", "Cream", "Garam Masala", "Paprika", "Ginger", "Garlic"],
    instructions: [
      "Marinate chicken in spiced yogurt",
      "Grill chicken pieces",
      "Prepare rich tomato sauce",
      "Combine and finish with cream"
    ],
    cookTime: "50",
    difficulty: "Medium",
    servings: 4,
    category: "Indian",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Samosa",
    description: "Crispy pastry filled with spiced potatoes",
    ingredients: ["Flour", "Potatoes", "Peas", "Spices", "Oil", "Onion", "Ginger", "Cilantro"],
    instructions: [
      "Prepare spiced potato filling",
      "Make and roll pastry",
      "Fill and shape samosas",
      "Fry until golden and crispy"
    ],
    cookTime: "45",
    difficulty: "Medium",
    servings: 6,
    category: "Indian",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },

  // American Cuisine
  {
    name: "Classic Burger",
    description: "Juicy beef patty with fresh toppings",
    ingredients: ["Ground Beef", "Buns", "Lettuce", "Tomato", "Onion", "Cheese", "Pickles", "Ketchup", "Mustard"],
    instructions: [
      "Form beef into patties",
      "Season and grill to desired doneness",
      "Toast buns and melt cheese",
      "Assemble with fresh toppings"
    ],
    cookTime: "25",
    difficulty: "Easy",
    servings: 4,
    category: "American",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Mac and Cheese",
    description: "Creamy pasta with cheese sauce",
    ingredients: ["Macaroni", "Cheddar", "Milk", "Butter", "Flour", "Breadcrumbs", "Salt", "Pepper"],
    instructions: [
      "Cook pasta until al dente",
      "Make cheese sauce with roux",
      "Combine pasta and sauce",
      "Top with breadcrumbs and bake"
    ],
    cookTime: "35",
    difficulty: "Easy",
    servings: 6,
    category: "American",
    image: "https://images.unsplash.com/photo-1543339494-b4cd453f5a9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Apple Pie",
    description: "Classic American apple pie with cinnamon",
    ingredients: ["Apples", "Pie Crust", "Sugar", "Cinnamon", "Butter", "Flour", "Lemon", "Egg"],
    instructions: [
      "Prepare spiced apple filling",
      "Roll out pie crust",
      "Assemble pie with filling",
      "Bake until golden and bubbling"
    ],
    cookTime: "60",
    difficulty: "Medium",
    servings: 8,
    category: "American",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "BBQ Ribs",
    description: "Slow-cooked barbecue ribs",
    ingredients: ["Pork Ribs", "BBQ Sauce", "Brown Sugar", "Garlic Powder", "Onion Powder", "Paprika", "Salt", "Pepper"],
    instructions: [
      "Season ribs with dry rub",
      "Slow cook until tender",
      "Add BBQ sauce",
      "Grill until sauce is caramelized"
    ],
    cookTime: "180",
    difficulty: "Hard",
    servings: 6,
    category: "American",
    image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Clam Chowder",
    description: "Creamy New England clam chowder",
    ingredients: ["Clams", "Potatoes", "Onion", "Celery", "Bacon", "Cream", "Butter", "Flour", "Thyme"],
    instructions: [
      "Cook bacon until crispy",
      "Make base with vegetables and flour",
      "Add clams and their juice",
      "Finish with cream and seasonings"
    ],
    cookTime: "45",
    difficulty: "Medium",
    servings: 6,
    category: "American",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },

  // Desserts
  {
    name: "Chocolate Cake",
    description: "Rich and moist chocolate cake with ganache frosting",
    ingredients: ["Flour", "Cocoa Powder", "Sugar", "Eggs", "Milk", "Butter", "Vanilla Extract", "Baking Powder", "Baking Soda", "Salt", "Chocolate", "Heavy Cream"],
    instructions: [
      "Mix dry ingredients",
      "Add wet ingredients",
      "Bake",
      "Make ganache"
    ],
    cookTime: "45",
    difficulty: "Medium",
    servings: 8,
    category: "Dessert",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Tiramisu",
    description: "Classic Italian coffee-flavored dessert",
    ingredients: ["Ladyfingers", "Coffee", "Mascarpone", "Eggs", "Sugar", "Cocoa Powder", "Vanilla Extract"],
    instructions: [
      "Soak ladyfingers",
      "Make cream",
      "Layer dessert",
      "Chill overnight"
    ],
    cookTime: "30",
    difficulty: "Medium",
    servings: 8,
    category: "Dessert",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Ice Cream Sundae",
    description: "Classic ice cream dessert with toppings",
    ingredients: ["Vanilla Ice Cream", "Chocolate Sauce", "Whipped Cream", "Cherries", "Nuts", "Sprinkles"],
    instructions: [
      "Scoop ice cream",
      "Add sauce",
      "Top with cream",
      "Add garnishes"
    ],
    cookTime: "10",
    difficulty: "Easy",
    servings: 4,
    category: "Dessert",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },

  // Vegetarian & Vegan
  {
    name: "Vegan Buddha Bowl",
    description: "Healthy grain bowl with vegetables",
    ingredients: ["Quinoa", "Chickpeas", "Kale", "Sweet Potato", "Avocado", "Tahini Sauce", "Lemon", "Garlic", "Cumin"],
    instructions: [
      "Cook quinoa",
      "Roast vegetables",
      "Make sauce",
      "Assemble bowl"
    ],
    cookTime: "35",
    difficulty: "Easy",
    servings: 4,
    category: "Vegan",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Vegetable Lasagna",
    description: "Layered pasta with vegetables and cheese",
    ingredients: ["Lasagna Noodles", "Ricotta", "Mozzarella", "Spinach", "Mushrooms", "Zucchini", "Tomato Sauce", "Garlic", "Onion"],
    instructions: [
      "Cook noodles",
      "Prepare vegetables",
      "Mix cheeses",
      "Layer and bake"
    ],
    cookTime: "60",
    difficulty: "Medium",
    servings: 8,
    category: "Vegetarian",
    image: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },

  // Quick & Easy Recipes
  {
    name: "5-Minute Microwave Mug Cake",
    description: "Quick chocolate cake in a mug",
    ingredients: ["Flour", "Sugar", "Cocoa Powder", "Egg", "Milk", "Oil", "Vanilla Extract", "Chocolate Chips"],
    instructions: [
      "Mix ingredients",
      "Microwave",
      "Let cool",
      "Enjoy"
    ],
    cookTime: "5",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "15-Minute Pasta",
    description: "Quick pasta with fresh ingredients",
    ingredients: ["Pasta", "Cherry Tomatoes", "Spinach", "Garlic", "Olive Oil", "Parmesan", "Red Pepper Flakes", "Basil"],
    instructions: [
      "Cook pasta",
      "Sauté vegetables",
      "Combine",
      "Add cheese"
    ],
    cookTime: "15",
    difficulty: "Easy",
    servings: 4,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "10-Minute Quesadillas",
    description: "Quick Mexican-style quesadillas",
    ingredients: ["Tortillas", "Cheese", "Chicken", "Bell Peppers", "Onion", "Salsa", "Sour Cream"],
    instructions: [
      "Fill tortillas",
      "Cook in pan",
      "Cut",
      "Serve with toppings"
    ],
    cookTime: "10",
    difficulty: "Easy",
    servings: 4,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "20-Minute Stir Fry",
    description: "Quick Asian-style stir fry",
    ingredients: ["Rice", "Mixed Vegetables", "Soy Sauce", "Ginger", "Garlic", "Sesame Oil", "Green Onions"],
    instructions: [
      "Cook rice",
      "Stir fry vegetables",
      "Add sauce",
      "Serve together"
    ],
    cookTime: "20",
    difficulty: "Easy",
    servings: 4,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "15-Minute Salmon",
    description: "Quick baked salmon with vegetables",
    ingredients: ["Salmon", "Broccoli", "Lemon", "Garlic", "Butter", "Herbs", "Salt", "Pepper"],
    instructions: [
      "Season salmon",
      "Add vegetables",
      "Bake",
      "Serve with lemon"
    ],
    cookTime: "15",
    difficulty: "Easy",
    servings: 4,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },

  // Real Recipes from Reputable Sources
  {
    name: "Classic Margherita Pizza",
    description: "Traditional Neapolitan pizza with fresh ingredients",
    ingredients: ["Pizza Dough", "San Marzano Tomatoes", "Fresh Mozzarella", "Fresh Basil", "Olive Oil", "Salt"],
    instructions: [
      "Stretch dough into a thin round",
      "Top with crushed tomatoes",
      "Add torn mozzarella pieces",
      "Bake at high heat until crust is charred",
      "Finish with fresh basil and olive oil"
    ],
    cookTime: "20",
    difficulty: "Medium",
    servings: 2,
    category: "Italian",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Authentic Pad Thai",
    description: "Classic Thai stir-fried rice noodles",
    ingredients: ["Rice Noodles", "Tofu", "Shrimp", "Bean Sprouts", "Peanuts", "Tamarind Paste", "Fish Sauce", "Palm Sugar"],
    instructions: [
      "Soak noodles until pliable",
      "Stir-fry tofu and shrimp",
      "Add noodles and sauce",
      "Toss with bean sprouts and peanuts",
      "Serve with lime wedges"
    ],
    cookTime: "30",
    difficulty: "Medium",
    servings: 4,
    category: "Thai",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Traditional Ramen",
    description: "Japanese noodle soup with rich pork broth",
    ingredients: ["Ramen Noodles", "Pork Bones", "Soy Sauce", "Mirin", "Chashu Pork", "Soft-boiled Eggs", "Nori", "Green Onions"],
    instructions: [
      "Simmer pork bones for rich broth",
      "Prepare toppings and eggs",
      "Cook noodles separately",
      "Assemble bowls with hot broth",
      "Add toppings and serve"
    ],
    cookTime: "480",
    difficulty: "Hard",
    servings: 6,
    category: "Japanese",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Authentic Tacos al Pastor",
    description: "Mexican street-style marinated pork tacos",
    ingredients: ["Pork Shoulder", "Achiote Paste", "Pineapple", "Corn Tortillas", "Onion", "Cilantro", "Lime", "Chiles"],
    instructions: [
      "Marinate pork with achiote and spices",
      "Stack and roast on vertical spit",
      "Slice meat directly onto tortillas",
      "Top with pineapple and onion",
      "Serve with lime and salsa"
    ],
    cookTime: "240",
    difficulty: "Hard",
    servings: 8,
    category: "Mexican",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Classic French Onion Soup",
    description: "Rich beef broth with caramelized onions and cheese",
    ingredients: ["Onions", "Beef Stock", "Butter", "Baguette", "Gruyere Cheese", "White Wine", "Thyme", "Bay Leaves"],
    instructions: [
      "Slowly caramelize onions",
      "Deglaze with wine",
      "Add stock and simmer",
      "Top with bread and cheese",
      "Broil until golden and bubbly"
    ],
    cookTime: "90",
    difficulty: "Medium",
    servings: 6,
    category: "French",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Authentic Butter Chicken",
    description: "Creamy Indian curry with tender chicken",
    ingredients: [
      "Chicken thighs",
      "Yogurt",
      "Garam masala",
      "Ginger",
      "Garlic",
      "Tomato puree",
      "Heavy cream",
      "Butter",
      "Cumin",
      "Coriander",
      "Turmeric",
      "Rice",
      "Naan"
    ],
    instructions: [
      "Marinate chicken in yogurt and spices for 4 hours",
      "Prepare tomato-based sauce with aromatics",
      "Add cooked chicken to sauce",
      "Finish with cream and butter",
      "Serve with rice and naan bread"
    ],
    cookTime: "60",
    difficulty: "Medium",
    servings: 4,
    category: "Indian",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    source: "https://www.recipetineats.com/butter-chicken/"
  },
  {
    name: "Traditional Paella",
    description: "Spanish rice dish with seafood and saffron",
    ingredients: [
      "Bomba rice",
      "Saffron",
      "Chicken",
      "Shrimp",
      "Mussels",
      "Bell peppers",
      "Tomatoes",
      "Garlic",
      "Onion",
      "Olive oil",
      "Smoked paprika",
      "Chicken stock",
      "Lemon wedges"
    ],
    instructions: [
      "Prepare sofrito with vegetables and spices",
      "Add rice and saffron-infused stock",
      "Cook without stirring until rice is almost done",
      "Add seafood and continue cooking",
      "Let socarrat form on bottom before serving"
    ],
    cookTime: "45",
    difficulty: "Hard",
    servings: 6,
    category: "Spanish",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    source: "https://www.seriouseats.com/paella-recipe"
  },
  {
    name: "Classic New York Cheesecake",
    description: "Creamy, dense New York-style cheesecake",
    ingredients: [
      "Cream cheese",
      "Sugar",
      "Eggs",
      "Heavy cream",
      "Vanilla extract",
      "Graham crackers",
      "Butter",
      "Sour cream",
      "Lemon juice",
      "Salt"
    ],
    instructions: [
      "Make graham cracker crust and press into pan",
      "Prepare cream cheese filling with eggs and sugar",
      "Bake in water bath until set",
      "Cool slowly in oven",
      "Chill overnight before serving"
    ],
    cookTime: "90",
    difficulty: "Medium",
    servings: 12,
    category: "Dessert",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    source: "https://www.foodnetwork.com/recipes/tyler-florence/new-york-cheesecake-recipe-1945049"
  },

  // Simple Recipes
  {
    name: "Perfect Boiled Eggs",
    description: "Classic boiled eggs with customizable cooking time for desired doneness",
    ingredients: ["Eggs", "Water", "Salt", "Ice"],
    instructions: [
      "Bring a pot of water to a boil",
      "Gently add eggs to boiling water",
      "Cook for 6-7 minutes for soft-boiled or 9-12 minutes for hard-boiled",
      "Transfer eggs to ice water to stop cooking",
      "Peel and serve"
    ],
    cookTime: "12",
    difficulty: "Easy",
    servings: 2,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1551185618-5d8656fd00b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Classic Toast",
    description: "Simple and delicious toast with butter",
    ingredients: ["Bread", "Butter", "Salt"],
    instructions: [
      "Toast bread in toaster until golden brown",
      "Spread butter while still warm",
      "Add a pinch of salt if desired",
      "Serve immediately"
    ],
    cookTime: "5",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
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
  {
    name: "Simple Grilled Cheese",
    description: "Classic grilled cheese sandwich with crispy golden bread",
    ingredients: ["Bread", "Butter", "Cheese slices", "Salt"],
    instructions: [
      "Butter one side of each bread slice",
      "Place cheese between bread slices, buttered sides out",
      "Heat pan over medium heat",
      "Cook until golden brown on both sides",
      "Cut diagonally and serve hot"
    ],
    cookTime: "10",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Instant Ramen Upgrade",
    description: "Elevated instant ramen with added vegetables and protein",
    ingredients: ["Instant ramen", "Egg", "Green onions", "Corn", "Soy sauce", "Sesame oil"],
    instructions: [
      "Cook ramen according to package instructions",
      "Add egg during last minute of cooking",
      "Top with corn, green onions, and a drizzle of sesame oil",
      "Add soy sauce to taste"
    ],
    cookTime: "5",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },

  // More Simple Recipes
  {
    name: "Scrambled Eggs",
    description: "Fluffy scrambled eggs for a quick breakfast",
    ingredients: ["Eggs", "Butter", "Salt", "Pepper", "Optional: milk or cream"],
    instructions: [
      "Crack eggs into a bowl and whisk",
      "Heat butter in pan over medium heat",
      "Pour in eggs and stir gently until set but still creamy",
      "Season with salt and pepper"
    ],
    cookTime: "5",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1551185618-5d8656fd00b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Peanut Butter and Jelly Sandwich",
    description: "Classic PB&J sandwich",
    ingredients: ["Bread", "Peanut butter", "Jelly or jam", "Optional: butter"],
    instructions: [
      "Spread peanut butter on one slice of bread",
      "Spread jelly on the other slice",
      "Put the slices together",
      "Optional: cut diagonally"
    ],
    cookTime: "2",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Microwave Nachos",
    description: "Quick and easy nachos",
    ingredients: ["Tortilla chips", "Shredded cheese", "Optional: jalapeños, salsa, sour cream"],
    instructions: [
      "Arrange chips on microwave-safe plate",
      "Sprinkle cheese over chips",
      "Microwave for 30-60 seconds until cheese melts",
      "Add optional toppings and serve"
    ],
    cookTime: "2",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Instant Oatmeal Plus",
    description: "Upgraded instant oatmeal with toppings",
    ingredients: ["Instant oatmeal", "Milk or water", "Banana", "Honey", "Optional: nuts, berries"],
    instructions: [
      "Prepare oatmeal according to package instructions",
      "Slice banana",
      "Top with banana, drizzle with honey",
      "Add optional toppings"
    ],
    cookTime: "3",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Tuna Mayo Sandwich",
    description: "Simple tuna sandwich with mayo",
    ingredients: ["Canned tuna", "Mayonnaise", "Bread", "Salt", "Pepper", "Optional: celery, onion"],
    instructions: [
      "Drain tuna and mix with mayo",
      "Season with salt and pepper",
      "Add optional chopped celery or onion",
      "Spread on bread"
    ],
    cookTime: "5",
    difficulty: "Easy",
    servings: 2,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1550507992-eb63ffee0847?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Microwave Quesadilla",
    description: "Quick cheese quesadilla",
    ingredients: ["Tortillas", "Shredded cheese", "Optional: salsa, sour cream"],
    instructions: [
      "Place cheese between two tortillas",
      "Microwave 30-45 seconds until cheese melts",
      "Cut into wedges",
      "Serve with optional toppings"
    ],
    cookTime: "2",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Yogurt Parfait",
    description: "Simple layered yogurt parfait",
    ingredients: ["Yogurt", "Granola", "Honey", "Berries or fruit"],
    instructions: [
      "Layer yogurt in a glass or bowl",
      "Add a layer of granola",
      "Add berries or fruit",
      "Drizzle with honey"
    ],
    cookTime: "3",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Microwave Sweet Potato",
    description: "Quick sweet potato cooked in the microwave",
    ingredients: ["Sweet potato", "Butter", "Salt", "Optional: brown sugar, cinnamon"],
    instructions: [
      "Wash sweet potato and prick with fork",
      "Microwave for 5 minutes, turn over",
      "Continue microwaving 2-3 minutes until soft",
      "Top with butter and optional ingredients"
    ],
    cookTime: "8",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Banana and Peanut Butter Toast",
    description: "Healthy toast topped with banana and peanut butter",
    ingredients: ["Bread", "Peanut butter", "Banana", "Optional: honey, cinnamon"],
    instructions: [
      "Toast bread until golden",
      "Spread with peanut butter",
      "Top with sliced banana",
      "Optional: drizzle with honey and sprinkle cinnamon"
    ],
    cookTime: "5",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Microwave Rice",
    description: "Simple microwave rice with minimal cleanup",
    ingredients: ["Rice", "Water", "Salt", "Optional: butter"],
    instructions: [
      "Rinse rice and add to microwave-safe bowl",
      "Add water (2:1 ratio water to rice)",
      "Microwave on high for 10 minutes",
      "Let stand 5 minutes, then fluff with fork"
    ],
    cookTime: "15",
    difficulty: "Easy",
    servings: 2,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Cucumber Sandwich",
    description: "Light and refreshing cucumber sandwich",
    ingredients: ["Bread", "Cucumber", "Butter", "Salt", "Optional: cream cheese"],
    instructions: [
      "Butter the bread slices",
      "Slice cucumber very thin",
      "Layer cucumber on bread",
      "Season with salt and serve"
    ],
    cookTime: "5",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Microwave Scrambled Eggs",
    description: "Quick scrambled eggs in the microwave",
    ingredients: ["Eggs", "Milk", "Salt", "Pepper", "Optional: cheese"],
    instructions: [
      "Beat eggs with milk in microwave-safe bowl",
      "Microwave 30 seconds, stir",
      "Repeat until eggs are set",
      "Season and serve"
    ],
    cookTime: "2",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1551185618-5d8656fd00b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Apple and Cheese Plate",
    description: "Simple snack plate with apple and cheese",
    ingredients: ["Apple", "Cheese", "Optional: crackers, nuts"],
    instructions: [
      "Slice apple into wedges",
      "Cut cheese into small pieces",
      "Arrange on plate",
      "Add optional crackers or nuts"
    ],
    cookTime: "5",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1543528176-61b239494933?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Cinnamon Toast",
    description: "Sweet and simple cinnamon sugar toast",
    ingredients: ["Bread", "Butter", "Sugar", "Cinnamon"],
    instructions: [
      "Toast bread until golden",
      "Spread with butter while hot",
      "Mix sugar and cinnamon, sprinkle on top",
      "Optional: broil briefly for caramelization"
    ],
    cookTime: "5",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Microwave Corn on the Cob",
    description: "Quick steamed corn on the cob",
    ingredients: ["Corn on the cob", "Water", "Salt", "Butter"],
    instructions: [
      "Place corn in microwave-safe dish",
      "Add 2 tablespoons water",
      "Cover and microwave 3-4 minutes",
      "Add butter and salt"
    ],
    cookTime: "5",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "No-Cook Overnight Oats",
    description: "Prepare-ahead breakfast oats",
    ingredients: ["Oats", "Milk", "Yogurt", "Honey", "Optional: fruit, nuts"],
    instructions: [
      "Mix oats, milk, and yogurt in a jar",
      "Add honey to taste",
      "Refrigerate overnight",
      "Top with optional ingredients before eating"
    ],
    cookTime: "5",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Microwave Steamed Vegetables",
    description: "Quick steamed vegetables in the microwave",
    ingredients: ["Mixed vegetables", "Water", "Salt", "Optional: butter"],
    instructions: [
      "Place vegetables in microwave-safe bowl",
      "Add 2-3 tablespoons water",
      "Cover and microwave 2-3 minutes",
      "Season and serve"
    ],
    cookTime: "3",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1478144592103-25e218a04891?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Quick Fruit Smoothie",
    description: "Basic fruit smoothie with yogurt",
    ingredients: ["Banana", "Frozen berries", "Yogurt", "Milk", "Optional: honey"],
    instructions: [
      "Add all ingredients to blender",
      "Blend until smooth",
      "Add more milk if too thick",
      "Pour and serve immediately"
    ],
    cookTime: "5",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Cheese and Crackers",
    description: "Simple cheese and crackers snack plate",
    ingredients: ["Crackers", "Cheese slices", "Optional: grapes, nuts"],
    instructions: [
      "Arrange crackers on plate",
      "Add cheese slices",
      "Add optional garnishes",
      "Serve immediately"
    ],
    cookTime: "2",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1543528176-61b239494933?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Microwave Hot Dog",
    description: "Quick hot dog in the microwave",
    ingredients: ["Hot dog", "Hot dog bun", "Optional: ketchup, mustard"],
    instructions: [
      "Wrap hot dog in paper towel",
      "Microwave for 30-45 seconds",
      "Heat bun for 10 seconds",
      "Add condiments and serve"
    ],
    cookTime: "1",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1541214113241-21578d3d6764?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Instant Coffee",
    description: "Basic instant coffee drink",
    ingredients: ["Instant coffee", "Hot water", "Optional: milk, sugar"],
    instructions: [
      "Boil water",
      "Add instant coffee to mug",
      "Pour hot water and stir",
      "Add milk and sugar if desired"
    ],
    cookTime: "2",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Microwave Popcorn",
    description: "Classic microwave popcorn",
    ingredients: ["Popcorn kernels", "Salt", "Optional: butter"],
    instructions: [
      "Place kernels in microwave-safe bowl",
      "Cover with microwave-safe plate",
      "Microwave until popping slows",
      "Season and serve"
    ],
    cookTime: "3",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1575224526797-5730d09d781d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Microwave Mug Brownie",
    description: "Quick chocolate brownie in a mug",
    ingredients: ["Flour", "Sugar", "Cocoa powder", "Egg", "Milk", "Oil"],
    instructions: [
      "Mix all ingredients in a mug",
      "Microwave for 1-2 minutes",
      "Let cool slightly",
      "Enjoy straight from the mug"
    ],
    cookTime: "2",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Microwave Mac and Cheese",
    description: "Quick and easy mac and cheese",
    ingredients: ["Macaroni", "Milk", "Butter", "Cheese", "Salt and pepper"],
    instructions: [
      "Cook macaroni in microwave with water",
      "Drain and add milk, butter, cheese",
      "Microwave until cheese melts",
      "Stir and season to taste"
    ],
    cookTime: "10",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1543339494-b4cd453f5a9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Microwave Baked Apple",
    description: "Warm baked apple with cinnamon",
    ingredients: ["Apple", "Cinnamon", "Honey", "Optional: nuts, raisins"],
    instructions: [
      "Core apple and place in microwave-safe dish",
      "Add cinnamon and honey",
      "Microwave 2-3 minutes until tender",
      "Top with optional ingredients"
    ],
    cookTime: "5",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Microwave Chocolate Mug Cake",
    description: "Quick chocolate cake in a mug",
    ingredients: ["Flour", "Sugar", "Cocoa powder", "Egg", "Milk", "Oil"],
    instructions: [
      "Mix all ingredients in a mug",
      "Microwave for 1-2 minutes",
      "Let cool slightly",
      "Enjoy straight from the mug"
    ],
    cookTime: "2",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Microwave Rice Bowl",
    description: "Quick rice bowl with toppings",
    ingredients: ["Rice", "Water", "Soy sauce", "Optional: vegetables, protein"],
    instructions: [
      "Cook rice in microwave",
      "Add toppings of choice",
      "Drizzle with soy sauce",
      "Serve hot"
    ],
    cookTime: "15",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Microwave Nachos",
    description: "Quick nachos with melted cheese",
    ingredients: ["Tortilla chips", "Shredded cheese", "Optional: salsa, jalapeños"],
    instructions: [
      "Layer chips on microwave-safe plate",
      "Add cheese and toppings",
      "Microwave until cheese melts",
      "Serve immediately"
    ],
    cookTime: "2",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Microwave Baked Apple",
    description: "Warm baked apple with cinnamon",
    ingredients: ["Apple", "Cinnamon", "Honey", "Optional: nuts, raisins"],
    instructions: [
      "Core apple and place in microwave-safe dish",
      "Add cinnamon and honey",
      "Microwave 2-3 minutes until tender",
      "Top with optional ingredients"
    ],
    cookTime: "5",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Microwave Chocolate Mug Cake",
    description: "Quick chocolate cake in a mug",
    ingredients: ["Flour", "Sugar", "Cocoa powder", "Egg", "Milk", "Oil"],
    instructions: [
      "Mix all ingredients in a mug",
      "Microwave for 1-2 minutes",
      "Let cool slightly",
      "Enjoy straight from the mug"
    ],
    cookTime: "2",
    difficulty: "Easy",
    servings: 1,
    category: "Quick",
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clear existing recipes
    await Recipe.deleteMany({});
    console.log('Cleared existing recipes');

    // Create default user
    const defaultUser = await createDefaultUser();
    console.log('Created default user');

    // Add author to each recipe
    const recipesWithAuthor = sampleRecipes.map(recipe => ({
      ...recipe,
      author: defaultUser._id
    }));

    // Insert recipes
    await Recipe.insertMany(recipesWithAuthor);
    console.log('Database seeded successfully');

    await mongoose.disconnect();
  } catch (error) {
    console.warn('Error seeding database:', error);
  }
};

seedDatabase(); 