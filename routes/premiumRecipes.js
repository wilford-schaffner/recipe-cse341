const express = require('express');
const router = express.Router();
const premiumRecipesController = require('../controllers/premiumRecipes');
const { validateRecipe, validateObjectId } = require('../util/recipeValidation');
const { ensureAuthenticated } = require('../middleware/auth');

// All premium recipe routes require authentication
router.get('/', ensureAuthenticated, premiumRecipesController.getAllPremiumRecipes);

router.get('/:id', ensureAuthenticated, validateObjectId, premiumRecipesController.getPremiumRecipeById);

router.post('/', ensureAuthenticated, validateRecipe, premiumRecipesController.createPremiumRecipe);

router.put('/:id', ensureAuthenticated, validateObjectId, validateRecipe, premiumRecipesController.updatePremiumRecipe);

router.delete('/:id', ensureAuthenticated, validateObjectId, premiumRecipesController.deletePremiumRecipe);

module.exports = router;

