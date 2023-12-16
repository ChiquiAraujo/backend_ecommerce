import express, { Router } from 'express';
import { productModel } from '../models/products.models.js';
import { isAdmin, isOwnerOrAdmin } from '../middleware/auth.middleware.js';

const productRouter = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve a list of products with pagination
 *     responses:
 *       200:
 *         description: A list of products.
 */
productRouter.get('/', async (req, res) => {
  // existing code
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Retrieve a specific product by ID
 *     responses:
 *       200:
 *         description: A single product.
 *       404:
 *         description: Product not found.
 */
productRouter.get('/:id', async (req, res) => {
  // existing code
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (admin only)
 *     responses:
 *       200:
 *         description: Product created successfully.
 *       400:
 *         description: Error creating product.
 */
productRouter.post('/', isAdmin, async (req, res) => {
  // existing code
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product (owner or admin)
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *       400:
 *         description: Error updating product.
 */
productRouter.put('/:id', isOwnerOrAdmin, async (req, res) => {
  // existing code
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product (owner or admin)
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       400:
 *         description: Error deleting product.
 */
productRouter.delete('/:id', isOwnerOrAdmin, async (req, res) => {
  // existing code
});

export default productRouter;
