import express from "express";
import { ProductManager } from "./productManager.js";

const PORT = 4000;
const app = express();

// Instancia de la clase ProductManager
const productManager = new ProductManager("./productos.json");

app.get('/', (req, res) => {
    res.send("Hola Server");
});

app.get('/products', async (req, res) => {
    try {
        const { limit } = req.query;
        let products = productManager.getProducts();

        // Si se recibe un límite, se devuelven solo los productos solicitados
        if (limit) {
            products = products.slice(0, parseInt(limit));
        }

        res.send({ products });
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener los productos.' });
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = productManager.getProductById(parseInt(pid));

        if (!product) {
            return res.status(404).send({ error: `No se encontró el producto con id ${pid}` });
        }

        res.send({ product });
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener el producto.' });
    }
});

// Inicializa el servidor
app.listen(PORT, () => {
    console.log(`Servidor en el puerto ${PORT}`);
});
