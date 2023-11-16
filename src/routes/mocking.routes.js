const express = require('express');
const router = express.Router();
const { createError } = require('../utils/errorHandler');
const { createMockProducts } = require('../utils/mocking');

// Endpoint 
router.get('/mockingproducts', (req, res, next) => {
  try {
    const mockProducts = createMockProducts();
    res.json(mockProducts);
  } catch (error) {

    next(createError('Error al generar productos ficticios', 500));
  }
});

module.exports = router;
