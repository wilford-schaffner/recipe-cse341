const express = require('express');
const router = express.Router();
const recipesRoutes = require('./recipes');

// Root route - welcome message
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Recipe Manager API!',
    version: '1.0.0',
    endpoints: {
      recipes: '/recipes',
      documentation: '/api-docs'
    },
    usage: 'Visit /api-docs for interactive API documentation'
  });
});

// Mount recipe routes at /recipes
router.use('/recipes', recipesRoutes);

module.exports = router;
