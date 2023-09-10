import { Router } from "express";
import { cartModel } from "../models/carts.models"; 
import { productModel } from "../models/products.models";

const cartRouter = Router();

cartRouter.get('/', async(req, res)=>{
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
      const cart = await productModel.create();
      res.status(200).send({ respuesta: 'OK', mensaje: cart });
    } catch (error) {
      res.status(400).send({ respuesta: 'ERROR al crear el carrito', mensaje: error });
      }
  });
  
cartRouter.put('/:cid/products/:pid', async(req, res) => {
    const { cid, pid } = req.body;
    const { quantity } = req.body;
    
    try {
        const cart = await cartModel.findById(cid);
        if(cart){
            const prod = await productModel.findById(pid)
            //busco en la BBDD
            if(prod){
                const indice = cart.products.findIndex(prod => prod.id_prod === pid)
                if (indice != -1){ //si existe en el carrito, se modifica la cantidad
                    cart.products[indice].quantity = quantity;
                }else{
                    cart.products.push({id_prod: pid, quantity: quantity}) //si no existe se agrega al carrito
                }
                res.status(200).send({ respuesta: 'OK', mensaje: cart })               
            }else{            
                res.status(400).send({ respuesta: 'Error al agregar producto carrito', mensaje: 'Product Not found' });
            }

        }else{
            res.status(400).send({ respuesta: 'Error al agregar producto carrito', mensaje: 'Cart Not found' });
        }

    } catch (error) {
        res.status(400).send({ respuesta: 'Error al agregar producto carrito', mensaje: 'Not found' });
    }
});

export default cartRouter

