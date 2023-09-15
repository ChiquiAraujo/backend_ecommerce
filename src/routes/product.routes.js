import express, { Router } from 'express';
import { productModel } from '../models/products.models.js';

const productRouter = Router()

productRouter.get('/', async(req, res)=>{
  const { page = 1, limit = 10 } = req.query;
  try {
      const options = {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10)
      };
      const products = await productModel.paginate({}, options);
      res.status(200).send({respuesta: 'OK', mensaje: products});
  } catch (error) {
      res.status(400).send({respuesta:'ERROR al consultar productos', mensaje: error});
  }
});

productRouter.get('/:id', async(req, res)=>{
    const { id } = req.params;
    try {
        const prod = await productModel.findById(id)
        if(prod){
            res.status(200).send({respuesta: 'OK', mensaje: prod})
        }else{
            res.status(404).send({respuesta: 'Error al consultar producto', mensaje: "Not found"});
        }        
      } catch (error) {
        res.status(400).send({respuesta:'ERROR al consultar productos', mensaje: error});
      }
});

productRouter.post('/', async(req, res) => {
  const { title, description, category, code, price, stock, thumbnail = [] } = req.body;
  try {
    const prod = await productModel.create({ title, description, category, code, price, stock, thumbnail });
    res.status(200).send({ respuesta: 'OK', mensaje: prod });
  } catch (error) {
    if (error.code === 11000) {  // Código de error para duplicación en MongoDB
      res.status(400).send({ respuesta: 'ERROR', mensaje: 'El código de producto ya existe.' });
    } else {
      res.status(400).send({ respuesta: 'ERROR al crear productos', mensaje: error });
    }
  }
});

productRouter.put('/:id', async(req, res)=>{
    const { id } = req.params;
    const {title, description, code, price, stock, thumbnail =[]} = req.body;
    try {
        const prod = await productModel.findByIdAndUpdate(id, {title, description, category, code, price, stock, thumbnail})
        if(prod){
            res.status(200).send({respuesta: 'OK', mensaje: "Producto actualizado"})
        }else{
            res.status(404).send({respuesta: 'Error al actualizar el producto', mensaje: "Not found"});
        }        
      } catch (error) {
        res.status(400).send({respuesta:'ERROR al actualizar productos', mensaje: error});
      }
});

productRouter.delete('/:id', async(req, res)=>{
    const { id } = req.params;
    try {
        const prod = await productModel.findByIdAndDelete(id);
        if(prod){
            res.status(200).send({respuesta: 'OK', mensaje: "Producto eliminado"})
        }else{
            res.status(404).send({respuesta: 'Error al eliminar el producto', mensaje: "Not found"});
        }        
      } catch (error) {
        res.status(400).send({respuesta:'ERROR al eliminar productos', mensaje: error});
      }
});

export default productRouter
