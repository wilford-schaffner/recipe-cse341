const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

// GET all recipes
const getAllRecipes = async (req, res) => {
  try {
    const db = getDb();
    const recipes = await db.collection('Recipes').find().toArray();
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};

// GET a single recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const db = getDb();
    const recipe = await db.collection('Recipes').findOne({ _id: new ObjectId(req.params.id) });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
};

// POST a new recipe
const createRecipe = async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('Recipes').insertOne(req.body);
    const newRecipe = await db.collection('Recipes').findOne({ _id: result.insertedId });
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create recipe' });
  }
};

// PUT (update) a recipe by ID
const updateRecipe = async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('Recipes').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    const updatedRecipe = await db.collection('Recipes').findOne({ _id: new ObjectId(req.params.id) });
    res.status(200).json(updatedRecipe);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update recipe' });
  }
};

// DELETE a recipe by ID
const deleteRecipe = async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('Recipes').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
