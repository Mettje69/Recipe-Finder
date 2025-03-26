import React, { useState } from "react";

export default function App() {
  // State for selected ingredients
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [ingredientSearch, setIngredientSearch] = useState("");
  
  // Sample ingredient categories and ingredients
  const ingredientCategories = [
    {
      name: "Dairy",
      ingredients: ["Milk", "Butter", "Cheese", "Yogurt", "Cream", "Sour cream"]
    },
    {
      name: "Protein",
      ingredients: ["Chicken", "Beef", "Pork", "Fish", "Eggs", "Tofu", "Beans"]
    },
    {
      name: "Vegetables",
      ingredients: ["Onion", "Garlic", "Tomato", "Potato", "Carrot", "Spinach", "Broccoli", "Bell pepper"]
    },
    {
      name: "Fruits",
      ingredients: ["Apple", "Banana", "Orange", "Lemon", "Lime", "Berries"]
    },
    {
      name: "Grains",
      ingredients: ["Rice", "Pasta", "Bread", "Flour", "Oats"]
    },
    {
      name: "Pantry",
      ingredients: ["Salt", "Pepper", "Sugar", "Oil", "Vinegar", "Soy sauce"]
    }
  ];
  
  // Sample recipes data
  const sampleRecipes = [
    {
      name: "Scrambled Eggs",
      ingredients: ["Eggs", "Milk", "Salt", "Pepper", "Butter"],
      missingIngredients: 0
    },
    {
      name: "Pasta with Tomato Sauce",
      ingredients: ["Pasta", "Tomato", "Garlic", "Onion", "Oil", "Salt"],
      missingIngredients: 1
    },
    {
      name: "Vegetable Stir Fry",
      ingredients: ["Bell pepper", "Broccoli", "Carrot", "Garlic", "Soy sauce", "Oil"],
      missingIngredients: 2
    }
  ];
  
  // Filter ingredients based on search
  const filterIngredients = (category: typeof ingredientCategories[0]) => {
    if (!ingredientSearch) return category.ingredients;
    return category.ingredients.filter(ingredient => 
      ingredient.toLowerCase().includes(ingredientSearch.toLowerCase())
    );
  };
  
  // Toggle ingredient selection
  const toggleIngredient = (ingredient: string) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };
  
  // Count how many selected ingredients are in a recipe
  const countMatchingIngredients = (recipe: typeof sampleRecipes[0]) => {
    return recipe.ingredients.filter(ingredient => 
      selectedIngredients.includes(ingredient)
    ).length;
  };
  
  // Filter recipes based on selected ingredients
  const filteredRecipes = selectedIngredients.length > 0 
    ? sampleRecipes
        .map(recipe => ({
          ...recipe,
          matchingIngredients: countMatchingIngredients(recipe),
          missingIngredients: recipe.ingredients.length - countMatchingIngredients(recipe)
        }))
        .sort((a, b) => a.missingIngredients - b.missingIngredients)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600">PantryChef</h1>
          <div className="flex space-x-4">
            <button className="text-gray-600 hover:text-gray-800">Sign In</button>
            <button className="text-gray-600 hover:text-gray-800">Save</button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Ingredients Selection Section */}
        <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">I have these ingredients:</h2>
            <p className="text-gray-600 mb-4">Select all the ingredients you have on hand</p>
            
            {/* Search bar */}
            <div className="relative mb-6">
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Search ingredients..."
                value={ingredientSearch}
                onChange={(e) => setIngredientSearch(e.target.value)}
              />
              <button className="absolute right-2 top-2 text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            
            {/* Selected ingredients */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Ingredients ({selectedIngredients.length})</h3>
              <div className="flex flex-wrap gap-2">
                {selectedIngredients.map((ingredient) => (
                  <span 
                    key={ingredient}
                    className="bg-orange-100 text-orange-800 rounded-full px-3 py-1 text-sm font-medium flex items-center"
                  >
                    {ingredient}
                    <button 
                      onClick={() => toggleIngredient(ingredient)}
                      className="ml-1.5 text-orange-600 hover:text-orange-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                {selectedIngredients.length === 0 && (
                  <span className="text-gray-500 text-sm">No ingredients selected yet</span>
                )}
              </div>
            </div>
            
            {/* Find Recipes Button */}
            <button 
              className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${selectedIngredients.length > 0 ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-400 cursor-not-allowed'}`}
              disabled={selectedIngredients.length === 0}
            >
              Find Recipes
            </button>
          </div>
          
          {/* Ingredient categories */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ingredients by Category</h3>
            <div className="space-y-6">
              {ingredientCategories.map((category) => {
                const filteredCategoryIngredients = filterIngredients(category);
                if (filteredCategoryIngredients.length === 0) return null;
                
                return (
                  <div key={category.name}>
                    <h4 className="text-md font-medium text-gray-700 mb-2">{category.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {filteredCategoryIngredients.map((ingredient) => (
                        <button
                          key={ingredient}
                          onClick={() => toggleIngredient(ingredient)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedIngredients.includes(ingredient) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                        >
                          {ingredient}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recipes Results Section */}
        <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-sm h-fit sticky top-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Recipes You Can Make</h2>
          
          {selectedIngredients.length === 0 ? (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-600">Select ingredients to see available recipes</p>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600">No recipes found with your selected ingredients</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecipes.map((recipe, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-lg mb-2">{recipe.name}</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">{recipe.matchingIngredients} ingredients match</span>
                    {recipe.missingIngredients > 0 ? (
                      <span className="text-orange-600">Missing {recipe.missingIngredients}</span>
                    ) : (
                      <span className="text-green-600">Make now!</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {selectedIngredients.length > 0 && filteredRecipes.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="w-full py-2 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                See All Recipes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
