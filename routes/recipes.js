const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipes');
const { validateRecipe, validateObjectId } = require('../util/recipeValidation');


router.get('/', recipesController.getAllRecipes);

router.get('/:id', validateObjectId, recipesController.getRecipeById);

router.post('/', validateRecipe, recipesController.createRecipe);

router.put('/:id', validateObjectId, validateRecipe, recipesController.updateRecipe);

router.delete('/:id', validateObjectId, recipesController.deleteRecipe);

module.exports = router;