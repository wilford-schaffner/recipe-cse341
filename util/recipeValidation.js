const Joi = require('joi');

// Ingredient schema for validation
const ingredientSchema = Joi.object({
  item: Joi.string().required().min(1).max(100).messages({
    'string.empty': 'Ingredient item is required',
    'string.min': 'Ingredient item must be at least 1 character',
    'string.max': 'Ingredient item must not exceed 100 characters',
    'any.required': 'Ingredient item is required'
  }),
  quantity: Joi.string().required().min(1).max(50).custom((value, helpers) => {
    // Check if quantity is only whitespace
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return helpers.error('quantity.whitespace');
    }
    
    // Reject if starts with negative sign
    if (trimmed.startsWith('-')) {
      return helpers.error('quantity.negative');
    }
    
    // Reject if it's just "0" or "0.0" etc.
    if (/^0+(\.0+)?\s*$/.test(trimmed)) {
      return helpers.error('quantity.zero');
    }
    
    // Reject if it starts with "0 " (like "0 cups")
    if (/^0\s/.test(trimmed)) {
      return helpers.error('quantity.zero');
    }
    
    return value;
  }).messages({
    'string.empty': 'Ingredient quantity is required',
    'string.min': 'Ingredient quantity must be at least 1 character',
    'string.max': 'Ingredient quantity must not exceed 50 characters',
    'quantity.whitespace': 'Ingredient quantity cannot be only whitespace',
    'quantity.negative': 'Ingredient quantity cannot be negative',
    'quantity.zero': 'Ingredient quantity must be greater than zero',
    'any.required': 'Ingredient quantity is required'
  }),
  notes: Joi.string().optional().allow('').max(200).messages({
    'string.max': 'Ingredient notes must not exceed 200 characters'
  }),
  optional: Joi.boolean().optional()
});

// Main recipe schema for validation
const recipeSchema = Joi.object({
  name: Joi.string().required().min(3).max(200).custom((value, helpers) => {
    // Check if name is only whitespace
    if (value.trim().length === 0) {
      return helpers.error('name.whitespace');
    }
    return value;
  }).messages({
    'string.empty': 'Recipe name is required',
    'string.min': 'Recipe name must be at least 3 characters',
    'string.max': 'Recipe name must not exceed 200 characters',
    'name.whitespace': 'Recipe name cannot be only whitespace',
    'any.required': 'Recipe name is required'
  }),
  servings: Joi.number().required().integer().min(1).max(100).messages({
    'number.base': 'Servings must be a number',
    'number.integer': 'Servings must be a whole number',
    'number.min': 'Servings must be at least 1',
    'number.max': 'Servings must not exceed 100',
    'any.required': 'Number of servings is required'
  }),
  prepMinutes: Joi.number().required().integer().min(0).max(1440).messages({
    'number.base': 'Preparation time must be a number',
    'number.integer': 'Preparation time must be a whole number',
    'number.min': 'Preparation time must be at least 0 minutes',
    'number.max': 'Preparation time must not exceed 1440 minutes (24 hours)',
    'any.required': 'Preparation time is required'
  }),
  cookMinutes: Joi.number().optional().integer().min(0).max(1440).messages({
    'number.base': 'Cooking time must be a number',
    'number.integer': 'Cooking time must be a whole number',
    'number.min': 'Cooking time must be at least 0 minutes',
    'number.max': 'Cooking time must not exceed 1440 minutes (24 hours)'
  }),
  ingredients: Joi.array().required().min(1).items(ingredientSchema).messages({
    'array.min': 'At least one ingredient is required',
    'any.required': 'Ingredients list is required'
  }),
  steps: Joi.array().required().min(1).items(
    Joi.string().min(3).max(1000).custom((value, helpers) => {
      // Check if step is only whitespace
      if (value.trim().length === 0) {
        return helpers.error('step.whitespace');
      }
      return value;
    }).messages({
      'string.min': 'Each step must be at least 3 characters',
      'string.max': 'Each step must not exceed 1000 characters',
      'step.whitespace': 'Each step cannot be only whitespace'
    })
  ).messages({
    'array.min': 'At least one cooking step is required',
    'any.required': 'Cooking steps are required'
  })
});

// Validation middleware function
const validateRecipe = (req, res, next) => {
  const { error, value } = recipeSchema.validate(req.body, { 
    abortEarly: false,
    stripUnknown: true 
  });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).json({
      error: 'Validation failed',
      details: errorMessages
    });
  }
  
  // Clean up empty notes fields
  if (value.ingredients && Array.isArray(value.ingredients)) {
    value.ingredients = value.ingredients.map(ingredient => {
      if (ingredient.notes === '') {
        delete ingredient.notes;
      }
      return ingredient;
    });
  }
  
  // Replace req.body with validated and sanitized data
  req.body = value;
  next();
};

// MongoDB ObjectId validation
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  
  // Check if id is a valid MongoDB ObjectId format (24 hex characters)
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({
      error: 'Invalid recipe ID format',
      message: 'Recipe ID must be a valid MongoDB ObjectId'
    });
  }
  
  next();
};

module.exports = {
  validateRecipe,
  validateObjectId,
  recipeSchema
};
