const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Get all recipes
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('createdBy', 'username');
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get recipe by ID
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'username');
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new recipe
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        console.log('Received recipe data:', {
            body: req.body,
            file: req.file,
            user: req.user
        });

        // Validate required fields
        const requiredFields = ['title', 'description', 'cuisine', 'prepTime', 'cookTime', 'servings'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            console.log('Missing required fields:', missingFields);
            return res.status(400).json({ 
                message: `Missing required fields: ${missingFields.join(', ')}` 
            });
        }

        // Parse numeric fields
        const prepTime = parseInt(req.body.prepTime);
        const cookTime = parseInt(req.body.cookTime);
        const servings = parseInt(req.body.servings);

        if (isNaN(prepTime) || isNaN(cookTime) || isNaN(servings)) {
            console.log('Invalid numeric fields:', {
                prepTime: req.body.prepTime,
                cookTime: req.body.cookTime,
                servings: req.body.servings
            });
            return res.status(400).json({ 
                message: 'Prep time, cook time, and servings must be numbers' 
            });
        }

        // Parse ingredients and instructions if they exist
        let ingredients = [];
        let instructions = [];

        try {
            if (req.body.ingredients) {
                ingredients = JSON.parse(req.body.ingredients);
                if (!Array.isArray(ingredients)) {
                    throw new Error('Ingredients must be an array');
                }
            }
            if (req.body.instructions) {
                instructions = JSON.parse(req.body.instructions);
                if (!Array.isArray(instructions)) {
                    throw new Error('Instructions must be an array');
                }
            }
        } catch (error) {
            console.error('Error parsing ingredients or instructions:', error);
            return res.status(400).json({ 
                message: 'Invalid format for ingredients or instructions: ' + error.message 
            });
        }

        if (ingredients.length === 0) {
            return res.status(400).json({ 
                message: 'At least one ingredient is required' 
            });
        }

        if (instructions.length === 0) {
            return res.status(400).json({ 
                message: 'At least one instruction is required' 
            });
        }

        const recipe = new Recipe({
            title: req.body.title,
            description: req.body.description,
            cuisine: req.body.cuisine,
            prepTime: prepTime,
            cookTime: cookTime,
            servings: servings,
            ingredients: ingredients,
            instructions: instructions,
            image: req.file ? req.file.filename : 'default.jpg',
            createdBy: req.user._id
        });

        const newRecipe = await recipe.save();
        console.log('Recipe created successfully:', newRecipe);
        res.status(201).json(newRecipe);
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(400).json({ 
            message: error.message || 'Error creating recipe',
            details: error.stack
        });
    }
});

// Update recipe
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Check if user is the creator of the recipe
        if (recipe.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this recipe' });
        }

        // Parse ingredients and instructions if they exist
        let ingredients = [];
        let instructions = [];

        try {
            if (req.body.ingredients) {
                ingredients = JSON.parse(req.body.ingredients);
                if (!Array.isArray(ingredients)) {
                    throw new Error('Ingredients must be an array');
                }
            }
            if (req.body.instructions) {
                instructions = JSON.parse(req.body.instructions);
                if (!Array.isArray(instructions)) {
                    throw new Error('Instructions must be an array');
                }
            }
        } catch (error) {
            console.error('Error parsing ingredients or instructions:', error);
            return res.status(400).json({ 
                message: 'Invalid format for ingredients or instructions: ' + error.message 
            });
        }

        // Update recipe fields
        recipe.title = req.body.title;
        recipe.description = req.body.description;
        recipe.cuisine = req.body.cuisine;
        recipe.prepTime = parseInt(req.body.prepTime);
        recipe.cookTime = parseInt(req.body.cookTime);
        recipe.servings = parseInt(req.body.servings);
        recipe.ingredients = ingredients;
        recipe.instructions = instructions;

        if (req.file) {
            recipe.image = req.file.filename;
        }

        const updatedRecipe = await recipe.save();
        res.json(updatedRecipe);
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(400).json({ message: error.message });
    }
});

// Delete recipe
router.delete('/:id', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Check if user is the creator of the recipe
        if (recipe.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this recipe' });
        }

        await recipe.remove();
        res.json({ message: 'Recipe deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 