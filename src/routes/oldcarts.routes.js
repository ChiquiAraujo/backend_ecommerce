//ESte es el antiguo 
import express from 'express';
import { CartManager } from '../models/cartManager.js';
//
// Router de Express para manejar rutas del carrito
const router = express.Router(); 
// Instancia del manejador de carritos
const cartManager = new CartManager("../data/carrito.json"); 

// Ruta POST para crear un nuevo carrito
router.post('/', (req, res) => {
    cartManager.addCart();
    res.send("Carrito creado");
});

// Ruta GET para obtener los productos de un carrito específico
router.get('/:cid', (req, res) => {
    const cart = cartManager.getCartById(parseInt(req.params.cid));
    if (cart) {
        res.send(cart);
    } else {
        res.status(404).send({ error: 'Carrito no encontrado.' });
    }
});

// Ruta POST para agregar un producto a un carrito específico
router.post('/:cid/product/:pid', (req, res) => {
    cartManager.addProductToCart(parseInt(req.params.cid), req.params.pid);
    res.send("Producto añadido al carrito");
});

export default router;
