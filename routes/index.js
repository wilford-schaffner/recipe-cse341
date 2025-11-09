const express = require('express');
const router = express.Router();
const recipesRoutes = require('./recipes');
const authRoutes = require('./auth');
const premiumRecipesRoutes = require('./premiumRecipes');

// Root route - welcome message
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Recipe Manager API!',
    version: '1.0.0',
    endpoints: {
      recipes: '/recipes',
      premiumRecipes: '/premium-recipes',
      auth: '/auth/google',
      logout: '/logout',
      documentation: '/api-docs'
    },
    usage: 'Visit /api-docs for interactive API documentation'
  });
});

// Mount recipe routes at /recipes
router.use('/recipes', recipesRoutes);

// Mount authentication routes at /auth
router.use('/auth', authRoutes);

// Mount premium recipes routes at /premium-recipes
router.use('/premium-recipes', premiumRecipesRoutes);

module.exports = router;
