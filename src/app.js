import express from "express";
import cartsRouter from './routes/carts.routes.js'; // Importa el router de carritos
import productsRouter from './routes/products.routes.js'; // Importa el router de productos

const PORT = 4000;
const app = express();

app.use(express.json());

// Middleware para registrar las solicitudes
app.use((req, res, next) => {
    const date = new Date();
    console.log(`[${date.toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Usamos los routers importados con el prefijo /api para manejar las rutas relacionadas con carritos y productos
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);

// Esta ruta sigue siendo válida ya que es una simple respuesta para el path raíz del servidor
app.get('/', (req, res) => {
    res.send("Hola Server");
});

// Middleware para manejo de errores 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
});
// Inicializa el servidor
app.listen(PORT, () => {
    console.log(`Servidor en el puerto ${PORT}`);
});
