import { Router } from "express";
import { cartModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";
import { userModel } from "../models/user.models.js"; 

const cartRouter = Router();

cartRouter.get('/', async (req, res) => {
    try {
        const carts = await cartModel.find();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).send({ respuesta: 'ERROR al obtener los carritos', mensaje: error });
    }
});

cartRouter.get('/:id', async(req, res)=>{
    const { id } = req.params;
    try {
        const cart = await cartModel.findById(id)
        if(cart){
            res.status(200).send({respuesta: 'OK', mensaje: cart})
        }else{
            res.status(404).send({respuesta: 'Error al consultar carrito', mensaje: "Not found"});
        }        
    } catch (error) {
        res.status(400).send({respuesta:'ERROR al consultar carritos', mensaje: error});
    }
});

cartRouter.post('/', async(req, res) => {
    try {
        const cart = await cartModel.create({});
        res.status(200).send({ respuesta: 'OK', mensaje: cart });
    } catch (error) {
        res.status(400).send({ respuesta: 'ERROR al crear el carrito', mensaje: error });
    }
});

cartRouter.put('/:cid/products/:pid', async(req, res) => {
    const { cid, pid } = req.params; 
    const { quantity, userId } = req.body; 

    try {
        const cart = await cartModel.findById(cid);
        const user = await userModel.findById(userId); 
        if (!cart) {
            return res.status(404).send({ respuesta: 'Carrito no encontrado' });
        };
        const product = await productModel.findById(pid);
        if (!product) {
            return res.status(404).send({ respuesta: 'Producto no encontrado' });
        };
        // Restricción para usuarios premium
        if (user.rol === 'premium' && product.owner.toString() === user._id.toString()) {
            return res.status(403).send({ respuesta: 'No se puede agregar el propio producto al carrito.' });
        };
        // Actualiza la cantidad del producto en el carrito o lo agrega si no está presente
        const productIndex = cart.products.findIndex(p => p.id_prod.toString() === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
        } else {
            cart.products.push({ id_prod: pid, quantity: quantity });
        }
        await cart.save();
        res.status(200).send({ respuesta: 'Producto agregado al carrito', mensaje: cart });
        
    } catch (error) {
        res.status(500).send({ respuesta: 'Error al agregar producto al carrito', mensaje: error.message });
    }
});

cartRouter.delete('/:cid/products/:pid', async(req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await cartModel.findById(cid);
        if (cart) {
            const productIndex = cart.products.findIndex(p => p.id_prod.toString() === pid);
            if (productIndex !== -1) {
                cart.products.splice(productIndex, 1);
                await cart.save();
                res.status(200).send({ respuesta: 'Producto eliminado del carrito' });
            } else {
                res.status(404).send({ respuesta: 'Producto no encontrado en el carrito' });
            }
        } else {
            res.status(404).send({ respuesta: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ respuesta: 'Error al eliminar producto del carrito', mensaje: error });
    }
});

// Eliminar Carrito
cartRouter.delete('/:id', async(req, res) => {
    const { id } = req.params;
    try {
        const result = await cartModel.findByIdAndDelete(id);
        if (result) {
            res.status(200).send({ respuesta: 'Carrito eliminado' });
        } else {
            res.status(404).send({ respuesta: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ respuesta: 'Error al eliminar el carrito', mensaje: error });
    }
});

export default cartRouter;
