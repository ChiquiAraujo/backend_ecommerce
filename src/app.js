import express from "express";
import cartsRouter from './routes/carts.routes.js'; 
import productsRouter from './routes/products.routes.js';
import { productManager } from './models/productManager.js';
import { ExpressHandlebars } from "express-handlebars";
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import path from 'path';

const PORT = 4000;
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hbs = new ExpressHandlebars();
// Inicializa el servidor
const serverExpress = app.listen(PORT, () => {  
    console.log(`Servidor en el puerto ${PORT}`)
    });


// Middleware para registrar las solicitudes
app.use(express.json());
app.use((req, res, next) => {
    const date = new Date();
    console.log(`[${date.toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Defino el motor de plantillas Handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');  //Settimg de la app Handlebars
app.set('views', path.resolve('./src/views')); // Ruta de las vistas, resuelve rutas relativas

//Server de Socket.io
const io = new Server(serverExpress); 
const prods = [];

io.on('connection', (socket) => {
    console.log("Servidor Socket.io conectado");
    
    socket.on('nuevoProducto', (nuevoProd) => {
        productManager.addProduct(nuevoProd);
    });

    socket.on('getProds', () => {
        const productos = productManager.getProducts();
        socket.emit('prods', productos);
    });
});

// Usamos los routers importados con el prefijo /api para manejar las rutas relacionadas con carritos y productos
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/static', express.static(path.join(__dirname, 'public')));


// Esta ruta sigue siendo válida ya que es una simple respuesta para el path raíz del servidor
//Pendiente editar para el desafío
app.get('/static', (req, res) => {
    res.render('realTimeProducts', {
        css: 'products.css',
        title: 'Productos',
        js: 'realTimeProducts.js'
    });
});

// Middleware para manejo de errores 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
});

