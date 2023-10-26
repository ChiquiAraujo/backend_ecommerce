import 'dotenv/config.js'
import express from "express";
import cartRouter from './routes/cart.routes.js';
import productsRouter from './routes/products.routes.js';
import { productModel } from './models/products.models.js';
import { ExpressHandlebars } from "express-handlebars";
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import path from 'path';
import userRouter from "./routes/user.routes.js";
import mongoose from 'mongoose'
import { userModel } from "./models/user.modeles.js";
import productRouter from "./routes/product.routes.js";
import Message from './models/messages.models.js'; 
import bodyParser from 'body-parser';
import { cartModel } from "./models/carts.models.js";
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo'
import sessionRouter from "./routes/session.routes.js";
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';

const PORT = 4000;
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hbs = new ExpressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});

// Middleware para registrar las solicitudes
app.use(express.json());
app.use((req, res, next) => {
    const date = new Date();
    console.log(`[${date.toISOString()}] ${req.method} ${req.url}`);
    next();
});
    //cookie
app.use(cookieParser(process.env.SIGNED_COOKIE)) //--
//M de session
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology : true
        },  
        ttl: 60,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized : false
}))
// Inicializa el servidor
const serverExpress = app.listen(PORT, () => {  
    console.log(`Servidor en el puerto ${PORT}`)
    });
//Conexión BBDD
mongoose.connect(process.env.MONGO_URL)
.then(async () => {
    console.log('BBDD is connected')
    const resultados = await cartModel.findOne({_id: '650416c697049c277246dcb5'});//indicar donde existe la ref.
    await userModel.ensureIndexes(); 
    //console.log(JSON.stringify(resultados));
    //Paginación
    const resultado = await userModel.paginate({edad:38}, {limit: 20, page: 2, sort: {dad:'asc'}});
    //console.log(resultado);
    const resultadoProductos = await productModel.paginate({}, { limit: 10, page: 1 });
    //console.log(resultadoProductos);

})
.catch((error) => {
    console.log('Error connecting to DDBB:', error.message);
    console.error(error);
})
//verifico si el usuario es admin o no
const auth = (req, res, next) => {
    if(req.session.email == "admin@admin.com" && req.session.password ==  "1234"){
        return next() //Continua con la sig ejecución
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
    console.log("Servidor Socket.io conectado");
    
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
            console.error("Error al obtener productos:", error);
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
app.use('/api/sessions', sessionRouter );

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
    console.error(err.stack);
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