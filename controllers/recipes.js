const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

// Small helper to standardize error logging and responses
const handleControllerError = (res, action, err) => {
  console.error(`Error ${action}:`, err);
  return res.status(500).json({
    error: `Failed to ${action}`,
    message: `An unexpected error occurred while ${action}`
  });
};

// GET all recipes
const getAllRecipes = async (req, res) => {
  try {
    const collection = getDb().collection('Recipes');
    const recipes = await collection.find().toArray();
    res.status(200).json(recipes);
  } catch (err) {
    return handleControllerError(res, 'fetching recipes', err);
  }
};

// GET a single recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const collection = getDb().collection('Recipes');
    const recipe = await collection.findOne({ _id: new ObjectId(req.params.id) });
    if (!recipe) {
      return res.status(404).json({ 
        error: 'Recipe not found',
        message: 'No recipe found with the provided ID'
      });
    }
    res.status(200).json(recipe);
  } catch (err) {
    return handleControllerError(res, 'fetching the recipe', err);
  }
};

// POST a new recipe
const createRecipe = async (req, res) => {
  try {
    const collection = getDb().collection('Recipes');
    const result = await collection.insertOne(req.body);
    const newRecipe = await collection.findOne({ _id: result.insertedId });
    res.status(201).json(newRecipe);
  } catch (err) {
    return handleControllerError(res, 'creating the recipe', err);
  }
};

// PUT (update) a recipe by ID
const updateRecipe = async (req, res) => {
  try {
    const collection = getDb().collection('Recipes');
    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        error: 'Recipe not found',
        message: 'No recipe found with the provided ID'
      });
    }
    res.status(204).send();
  } catch (err) {
    return handleControllerError(res, 'updating the recipe', err);
  }
};

// DELETE a recipe by ID
const deleteRecipe = async (req, res) => {
  try {
    const collection = getDb().collection('Recipes');
    const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        error: 'Recipe not found',
        message: 'No recipe found with the provided ID'
      });
    }
    res.status(204).send();
  } catch (err) {
    return handleControllerError(res, 'deleting the recipe', err);
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
