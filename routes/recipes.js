const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipes');

/**
 * @swagger
 * /recipes/:
 *   get:
 *     summary: Get all recipes
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: List of all recipes
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Recipe'
 *       500:
 *         description: Internal Server Error
 */
router.get('/', recipesController.getAllRecipes);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Get a recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe not found
 */
router.get('/:id', recipesController.getRecipeById);

router.post('/', recipesController.createRecipe);
/* #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
        $ref: "#/definitions/Recipe"
    }
} */

router.put('/:id', recipesController.updateRecipe);
/* #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
        $ref: "#/definitions/Recipe"
    }
} */

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     summary: Delete a recipe
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe deleted successfully
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', recipesController.deleteRecipe);

module.exports = router;
