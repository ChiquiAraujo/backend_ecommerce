import express from "express";
import cartsRouter from './routes/carts.routes.js'; // Importa el router de carritos
import productsRouter from './routes/products.routes.js'; // Importa el router de productos
import { ExpressHandlebars } from "express-handlebars";
import { fileURLToPath } from 'url';
import path from 'path'
import { title } from "process";


const PORT = 4000;
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hbs = new ExpressHandlebars();

app.use(express.json());
// Middleware para registrar las solicitudes
app.use((req, res, next) => {
    const date = new Date();
    console.log(`[${date.toISOString()}] ${req.method} ${req.url}`);
    next();
});
// Defino el motor de plantillas Handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');  //Settimg de la app Handlebars
app.set('views', path.resolve('./src/views')); // Ruta de las vistas, resuelve rutas relativas

// Usamos los routers importados con el prefijo /api para manejar las rutas relacionadas con carritos y productos
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/static', express.static(path.join(__dirname, '/public')));

// Esta ruta sigue siendo válida ya que es una simple respuesta para el path raíz del servidor
//Pendiente editar para el desafío
app.get('/static', (req, res) => {
    res.render('products', {
        nombre: "Chiqui",
        css: 'products.css',
        title: 'Productos'
    });
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
