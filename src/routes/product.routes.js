import express, { Router } from 'express';
import { productModel } from '../models/products.models.js';
import { isAdmin, isOwnerOrAdmin } from '../middleware/auth.middleware.js';

const productRouter = Router();

// Ruta para obtener todos los productos con paginación
productRouter.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };
    const products = await productModel.paginate({}, options);
    res.status(200).send({ respuesta: 'OK', mensaje: products });
  } catch (error) {
    res.status(400).send({ respuesta: 'ERROR al consultar productos', mensaje: error });
  }
});

// Ruta para obtener un producto específico por ID
productRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findById(id);
    if (product) {
      res.status(200).send({ respuesta: 'OK', mensaje: product });
    } else {
      res.status(404).send({ respuesta: 'Error al consultar producto', mensaje: 'Not found' });
    }
  } catch (error) {
    res.status(400).send({ respuesta: 'ERROR al consultar productos', mensaje: error });
  }
});

// Ruta para crear un nuevo producto (solo admin)
productRouter.post('/', isAdmin, async (req, res) => {
  const { title, description, category, code, price, stock, thumbnail = [], owner } = req.body;
  try {
    const product = await productModel.create({ title, description, category, code, price, stock, thumbnail, owner });
    res.status(200).send({ respuesta: 'OK', mensaje: product });
  } catch (error) {
    if (error.code === 11000) { // Código de error para duplicación en MongoDB
      res.status(400).send({ respuesta: 'ERROR', mensaje: 'El código de producto ya existe.' });
    } else {
      res.status(400).send({ respuesta: 'ERROR al crear productos', mensaje: error });
    }
  }
});
// Ruta para actualizar un producto (propietario o admin)
productRouter.put('/:id', isOwnerOrAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description, category, code, price, stock, thumbnail = [] } = req.body;
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(id, { title, description, category, code, price, stock, thumbnail }, { new: true });
    res.status(200).send({ respuesta: 'OK', mensaje: updatedProduct });
  } catch (error) {
    res.status(400).send({ respuesta: 'ERROR al actualizar productos', mensaje: error });
  }
});

// Ruta para eliminar un producto (propietario o admin)
productRouter.delete('/:id', isOwnerOrAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await productModel.findByIdAndDelete(id);
    res.status(200).send({ respuesta: 'OK', mensaje: 'Producto eliminado' });
  } catch (error) {
    res.status(400).send({ respuesta: 'ERROR al eliminar productos', mensaje: error });
  }
});

export default productRouter;