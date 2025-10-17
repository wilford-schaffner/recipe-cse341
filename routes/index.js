const express = require('express');
const router = express.Router();
const recipesRoutes = require('./recipes');

// Mount recipe routes at /recipes
router.use('/recipes', recipesRoutes);

module.exports = router;
