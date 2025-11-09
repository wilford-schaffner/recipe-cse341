const express = require('express');
const router = express.Router();
const premiumRecipesController = require('../controllers/premiumRecipes');
const { validateObjectId } = require('../util/recipeValidation');
const { ensureAuthenticated } = require('../middleware/auth');

// All premium recipe routes require authentication
// Only GET endpoints are available for premium recipes
router.get('/', ensureAuthenticated, premiumRecipesController.getAllPremiumRecipes);

router.get('/:id', ensureAuthenticated, validateObjectId, premiumRecipesController.getPremiumRecipeById);

module.exports = router;

