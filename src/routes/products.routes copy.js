import express from 'express';
import { productManager } from '../models/productManager.js';
import { v4 as uuidv4 } from 'uuid';


const productsRouter = express.Router();

// Ruta para obtener todos los productos
productsRouter.get('/', async (req, res) => {
  const { limit } = req.query;

  try {
    const products = await productManager.getProducts();
    const limitedProducts = limit ? products.slice(0, limit) : products;
    res.status(200).json(limitedProducts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});


// Ruta para obtener un producto por su ID
productsRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productManager.getProductById(parseInt(id));
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// Ruta para agregar un nuevo producto
productsRouter.post('/', async (req, res) => {
  const { title, description, code, price, stock, category, thumbnail = [] } = req.body;

  const newProduct = {
      id: uuidv4(),
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnail
  };

  try {
    const savedProduct = await productManager.addProduct(newProduct);
    res.status(201).json(savedProduct);
} catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto' });
}
});

// Ruta para actualizar un producto por su ID
productsRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id);
  const updateData = req.body;

  try {
    const updatedProduct = await productManager.updateProduct(numericId, updateData);
      if (updatedProduct) {
          res.status(200).json(updatedProduct);
      } else {
          res.status(404).json({ error: 'Producto no encontrado' });
      }
  } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Ruta para eliminar un producto por su ID
productsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
      await productManager.deleteProduct(id);
      res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

export default productsRouter;