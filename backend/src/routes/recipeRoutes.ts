import express from 'express';
import Recipe from '../models/Recipe';

const router = express.Router();

// Get all recipes
router.get('/', (req, res) => {
  Recipe.find()
    .then(recipes => res.json(recipes))
    .catch(error => res.status(500).json({ message: 'Error fetching recipes' }));
});

// Get recipe by ID
router.get('/:id', (req, res) => {
  Recipe.findById(req.params.id)
    .then(recipe => {
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
      res.json(recipe);
    })
    .catch(error => res.status(500).json({ message: 'Error fetching recipe' }));
});

// Search recipes by ingredients
router.post('/search', (req, res) => {
  const { ingredients, filters } = req.body;
  const query: any = {};
  
  if (ingredients?.length > 0) {
    // Instead of using regex, we'll fetch all recipes and filter them in memory
    // This gives us more control over the matching logic
    Recipe.find({})
      .then(allRecipes => {
        // Filter recipes based on ingredients
        const filteredRecipes = allRecipes.filter(recipe => {
          // Check if any of the selected ingredients is a main ingredient in the recipe
          return ingredients.some((selectedIngredient: string) => {
            // Convert to lowercase for case-insensitive comparison
            const selectedIngredientLower = selectedIngredient.toLowerCase();
            
            // Special case for "fish" - exclude recipes with "fish sauce"
            if (selectedIngredientLower === 'fish') {
              // Check if any ingredient contains "fish sauce" - if so, exclude this recipe
              const hasFishSauce = recipe.ingredients.some(ingredient => 
                ingredient.toLowerCase().includes('fish sauce')
              );
              
              if (hasFishSauce) {
                return false;
              }
            }
            
            // Check if any ingredient in the recipe contains the selected ingredient as a whole word
            return recipe.ingredients.some(recipeIngredient => {
              const recipeIngredientLower = recipeIngredient.toLowerCase();
              
              // Check if the ingredient is a main ingredient (not just a component)
              // This is a simple heuristic: if the ingredient appears at the beginning of the string
              // or after a measurement, it's likely a main ingredient
              const isMainIngredient = 
                recipeIngredientLower.startsWith(selectedIngredientLower) || 
                recipeIngredientLower.includes(` ${selectedIngredientLower} `) ||
                recipeIngredientLower.endsWith(` ${selectedIngredientLower}`);
              
              return isMainIngredient;
            });
          });
        });
        
        // Apply additional filters
        let resultRecipes = filteredRecipes;
        if (filters) {
          if (filters.difficulty) {
            resultRecipes = resultRecipes.filter(recipe => recipe.difficulty === filters.difficulty);
          }
          if (filters.category) {
            resultRecipes = resultRecipes.filter(recipe => recipe.category === filters.category);
          }
          if (filters.maxCookTime) {
            resultRecipes = resultRecipes.filter(recipe => parseInt(recipe.cookTime) <= filters.maxCookTime);
          }
        }
        
        console.log(`Found ${resultRecipes.length} recipes after filtering`);
        if (resultRecipes.length > 0) {
          console.log('Sample recipe:', {
            name: resultRecipes[0].name,
            ingredients: resultRecipes[0].ingredients
          });
        }
        
        res.json(resultRecipes);
      })
      .catch(error => {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Error searching recipes' });
      });
    
    return; // Return early since we're handling the response in the promise
  }
  
  // If no ingredients are selected, apply filters directly to the query
  if (filters) {
    if (filters.difficulty) query.difficulty = filters.difficulty;
    if (filters.category) query.category = filters.category;
    if (filters.maxCookTime) query.cookTime = { $lte: filters.maxCookTime };
  }

  Recipe.find(query)
    .then(recipes => {
      console.log(`Found ${recipes.length} recipes`);
      if (recipes.length > 0) {
        console.log('Sample recipe:', {
          name: recipes[0].name,
          ingredients: recipes[0].ingredients
        });
      }
      res.json(recipes);
    })
    .catch(error => {
      console.error('Search error:', error);
      res.status(500).json({ message: 'Error searching recipes' });
    });
});

// Create new recipe
router.post('/', (req, res) => {
  const recipe = new Recipe(req.body);
  recipe.save()
    .then(savedRecipe => res.status(201).json(savedRecipe))
    .catch(error => res.status(400).json({ message: 'Error creating recipe' }));
});

// Update recipe
router.put('/:id', (req, res) => {
  Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(recipe => {
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
      res.json(recipe);
    })
    .catch(error => res.status(400).json({ message: 'Error updating recipe' }));
});

// Delete recipe
router.delete('/:id', (req, res) => {
  Recipe.findByIdAndDelete(req.params.id)
    .then(recipe => {
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
      res.json({ message: 'Recipe deleted successfully' });
    })
    .catch(error => res.status(500).json({ message: 'Error deleting recipe' }));
});

export default router; 