import { Router } from "express";
import { cartModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";
import { userModel } from "../models/user.modeles.js"; 

const cartRouter = Router();

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Retrieve a list of all carts
 *     responses:
 *       200:
 *         description: List of carts.
 */
cartRouter.get('/', async (req, res) => {
    // existing code
});

/**
 * @swagger
 * /api/carts/{id}:
 *   get:
 *     summary: Retrieve a specific cart by ID
 *     responses:
 *       200:
 *         description: A single cart.
 *       404:
 *         description: Cart not found.
 */
cartRouter.get('/:id', async(req, res)=>{
    // existing code
});

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Create a new cart
 *     responses:
 *       200:
 *         description: Cart created successfully.
 *       400:
 *         description: Error creating cart.
 */
cartRouter.post('/', async(req, res) => {
    // existing code
});

/**
 * @swagger
 * /api/carts/{cid}/products/{pid}:
 *   put:
 *     summary: Add a product to a cart or update its quantity
 *     responses:
 *       200:
 *         description: Product added to cart.
 *       403:
 *         description: Forbidden to add own product for premium users.
 *       404:
 *         description: Cart or product not found.
 *       500:
 *         description: Server error.
 */
cartRouter.put('/:cid/products/:pid', async(req, res) => {
    // existing code
});

/**
 * @swagger
 * /api/carts/{cid}/products/{pid}:
 *   delete:
 *     summary: Remove a product from a cart
 *     responses:
 *       200:
 *         description: Product removed from cart.
 *       404:
 *         description: Cart or product not found in cart.
 *       500:
 *         description: Server error.
 */
cartRouter.delete('/:cid/products/:pid', async(req, res) => {
    // existing code
});

/**
 * @swagger
 * /api/carts/{id}:
 *   delete:
 *     summary: Delete a cart
 *     responses:
 *       200:
 *         description: Cart deleted successfully.
 *       404:
 *         description: Cart not found.
 *       500:
 *         description: Server error.
 */
cartRouter.delete('/:id', async(req, res) => {
    // existing code
});

export default cartRouter;
