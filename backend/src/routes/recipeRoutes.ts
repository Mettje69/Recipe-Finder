import express from 'express';
import multer from 'multer';
import path from 'path';
import Recipe from '../models/Recipe';
import { auth } from '../middleware/auth';

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Create a new recipe
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { 
      name, 
      description, 
      ingredients, 
      instructions,
      cookTime,
      difficulty,
      servings,
      category
    } = req.body;
    
    // Parse and clean ingredients
    const parsedIngredients = JSON.parse(ingredients).map((ing: string) => 
      ing.trim().toLowerCase()
    );

    // Parse and clean instructions
    const parsedInstructions = JSON.parse(instructions).map((inst: string) => 
      inst.trim()
    );

    const recipe = new Recipe({
      name: name.trim(),
      description: description.trim(),
      ingredients: parsedIngredients,
      instructions: parsedInstructions,
      cookTime: parseInt(cookTime),
      difficulty,
      servings: parseInt(servings),
      category: category.trim(),
      image: req.file ? `/uploads/${req.file.filename}` : '',
      author: req.user._id
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// Get a single recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'username');
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

// Search recipes by ingredients
router.post('/search', async (req, res) => {
  try {
    const { ingredients, filters } = req.body;
    
    // Build query based on filters
    let query: any = {};
    
    if (ingredients?.length > 0) {
      query.ingredients = { $in: ingredients.map((i: string) => new RegExp(i, 'i')) };
    }
    
    if (filters) {
      if (filters.difficulty) {
        query.difficulty = filters.difficulty;
      }
      if (filters.category) {
        query.category = filters.category;
      }
      if (filters.maxCookTime) {
        query.cookTime = { $lte: filters.maxCookTime };
      }
    }
    
    const recipes = await Recipe.find(query);
    console.log(`Found ${recipes.length} recipes after filtering`);
    res.json(recipes);
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({ message: 'Error searching recipes' });
  }
});

// Search recipes
router.get('/search', async (req, res) => {
  try {
    const query = req.query.query as string;
    
    if (!query) {
      return res.json([]);
    }

    const recipes = await Recipe.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .populate('author', 'username');

    res.json(recipes);
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({ error: 'Failed to search recipes' });
  }
});

// Update recipe
router.put('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ message: 'Error updating recipe' });
  }
});

// Delete recipe
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ message: 'Error deleting recipe' });
  }
});

export default router; 