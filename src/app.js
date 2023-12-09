// Módulos de Node.js
import 'dotenv/config.js';
import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { Server } from 'socket.io';
// Middleware y utilidades de terceros
import MongoStore from 'connect-mongo';
import { ExpressHandlebars } from "express-handlebars";
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import passport from 'passport';
// Configuración de Passport
import initializePassport from './config/passport.js';
// Rutas y modelos
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from './routes/cart.routes.js';
import sessionRouter from "./routes/session.routes.js";
import mockingRoutes from './routes/mocking.routes.js';
import { userModel } from "./models/user.modeles.js";
import { productModel } from './models/products.models.js';
import { cartModel } from "./models/carts.models.js";
import Message from './models/messages.models.js'; 
// Utilidades propias
import logger from './utils/logger.js';
import { handleErrors } from './utils/errorHandler.js';
import { createMockProducts } from './utils/mocking.js';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;
const app = express();
const hbs = new ExpressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});

// Configuración de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SIGNED_COOKIE));

app.use((req, res, next) => {
    const date = new Date();
    console.log(`[${date.toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Configuración de la sesión
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 60 * 60 // 1 hora
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
// Inicialización de Passport
initializePassport();
app.use(passport.initialize()); 
app.use(passport.session());

// Inicializa el servidor
const serverExpress = app.listen(PORT, () => {  
    logger.info(`Servidor en el puerto ${PORT}`);
    });
//Conexión BBDD
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(async () => {
    logger.info('BBDD conectada correctamente');
    const resultados = await cartModel.findOne({_id: '650416c697049c277246dcb5'});
    await userModel.ensureIndexes();
    const resultado = await userModel.paginate({edad:38}, {limit: 20, page: 2, sort: {edad:'asc'}});
    const resultadoProductos = await productModel.paginate({}, { limit: 10, page: 1 });
})
.catch((error) => {
    logger.error('Error conectando a la BBDD:', error.message);
});
//verifico si el usuario es admin o no
const auth = (req, res, next) => {
    if(req.session.email == "admin@admin.com" && req.session.password ==  "1234"){
        return next() 
    }
    return res.send("No tenes acceso a esta ruta")
}
//Motor de plantillas Handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');  //Settimg de la app Handlebars
app.set('views', path.resolve('./src/views')); // Ruta de las vistas, 

app.use(bodyParser.json());

//Server de Socket.io
const io = new Server(serverExpress); 
const prods = [];

io.on('connection', (socket) => {
    logger.debug("Servidor Socket.io conectado");
    
    socket.on('nuevoProducto', async (nuevoProd) => {
        try {
            await productModel.create(nuevoProd);
        } catch (error) {
            console.error("Error al agregar producto:", error);
        }
    });    
    socket.on('getProds', async () => {
        try {
            const productos = await productModel.find();
            socket.emit('prods', productos);
        } catch (error) {
            logger.error("Error al agregar producto:", error);
        }
    });

    socket.on('chatMessage', async (data) => {
        console.log("Datos recibidos:", data); // Registro de datos recibidos.
        try {
            const newMessage = new Message({
                email: data.email,
                message: data.message        
            });
            await newMessage.save();
            console.log("Message saved successfully"); // Registro de éxito
            io.emit('chatMessage', data);
        } catch (error) {
            console.error("Error saving message:", error); // Registro de error
        }
    });
});
// Routes
app.use('/api/users', userRouter); //BBDD
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/api/sessions', sessionRouter);
app.use(handleErrors); 
app.use('/api', mockingRoutes);

app.get('/api/mockingproducts', (req, res, next) => {
    try {
      const mockProducts = createMockProducts();
      res.json(mockProducts);
    } catch (error) {
      next(error); // Pasamos el error al middleware de manejo de errores
    }
  });
// Esta ruta sigue siendo válida ya que es una simple respuesta para el path raíz del servidor
app.get('/produc', (req, res) => {
    res.render('realTimeProducts', {
        css: 'products.css',
        title: 'Productos',
        js: 'realTimeProducts.js'
    });
});
//vista productos
app.get('/productos', async (req, res) => {
    try {
        const productos = await productModel.find();
        res.render('products', { productos });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});
// Middleware para manejo de errores 
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
});
//Chat
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find().limit(50);  // Obtener los últimos 50 mensajes
        res.json(messages);
    } catch (error) {
        res.status(500).send('Error fetching messages');
    }
});
app.get('/chat', (req, res) => {
    res.render('chat');
});