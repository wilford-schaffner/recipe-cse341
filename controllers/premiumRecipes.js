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

// GET all premium recipes
const getAllPremiumRecipes = async (req, res) => {
  try {
    const collection = getDb().collection('Premium-Recipes');
    const recipes = await collection.find().toArray();
    res.status(200).json(recipes);
  } catch (err) {
    return handleControllerError(res, 'fetching premium recipes', err);
  }
};

// GET a single premium recipe by ID
const getPremiumRecipeById = async (req, res) => {
  try {
    const collection = getDb().collection('Premium-Recipes');
    const recipe = await collection.findOne({ _id: new ObjectId(req.params.id) });
    if (!recipe) {
      return res.status(404).json({ 
        error: 'Premium recipe not found',
        message: 'No premium recipe found with the provided ID'
      });
    }
    res.status(200).json(recipe);
  } catch (err) {
    return handleControllerError(res, 'fetching the premium recipe', err);
  }
};

// POST a new premium recipe
const createPremiumRecipe = async (req, res) => {
  try {
    const collection = getDb().collection('Premium-Recipes');
    const result = await collection.insertOne(req.body);
    const newRecipe = await collection.findOne({ _id: result.insertedId });
    res.status(201).json(newRecipe);
  } catch (err) {
    return handleControllerError(res, 'creating the premium recipe', err);
  }
};

// PUT (update) a premium recipe by ID
const updatePremiumRecipe = async (req, res) => {
  try {
    const collection = getDb().collection('Premium-Recipes');
    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        error: 'Premium recipe not found',
        message: 'No premium recipe found with the provided ID'
      });
    }
    res.status(204).send();
  } catch (err) {
    return handleControllerError(res, 'updating the premium recipe', err);
  }
};

// DELETE a premium recipe by ID
const deletePremiumRecipe = async (req, res) => {
  try {
    const collection = getDb().collection('Premium-Recipes');
    const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        error: 'Premium recipe not found',
        message: 'No premium recipe found with the provided ID'
      });
    }
    res.status(204).send();
  } catch (err) {
    return handleControllerError(res, 'deleting the premium recipe', err);
  }
};

module.exports = {
  getAllPremiumRecipes,
  getPremiumRecipeById,
  createPremiumRecipe,
  updatePremiumRecipe,
  deletePremiumRecipe,
};

