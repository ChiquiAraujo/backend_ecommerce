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
import MongoStore from 'connect-mongo';
import sessionRouter from './routes/session.routes.js';
import authMiddleware from './middleware/auth.middleware.js';
import authRouter from './routes/auth.routes.js';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github';
import { userModel } from './models/user.models.js';


const PORT = 4000;
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hbs = new ExpressHandlebars();

// Middleware para registrar las solicitudes
app.use(express.json());
app.use(cookieParser(process.env.SIGNED_COOKIE));//la cookie esta firmanda
app.use((req, res, next) => {
    const date = new Date();
    console.log(`[${date.toISOString()}] ${req.method} ${req.url}`);
    next();
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/api/auth/github/callback"
}, async (token, tokenSecret, profile, done) => {
    try {
        let user = await userModel.findOne({ githubId: profile.id });
        if (!user) {
            user = new userModel({
                githubId: profile.id,
                name: profile.displayName,
            });
            await user.save();
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// ... (otro código)

app.use(session({
    store: MongoStore.create({
        mongoUrl : process.env.MONGO_URL,  
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 60
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false //fuerzo a guardar la session
}));
// Inicializa el servidor
const serverExpress = app.listen(PORT, () => {  
    console.log(`Servidor en el puerto ${PORT}`)
    });

//Conexión con la BBDD
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

// Defino el motor de plantillas Handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');  //Settimg de la app Handlebars
app.set('views', path.resolve('./src/views')); // Ruta de las vistas, resuelve rutas relativas

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
//Rutas
// Usamos los routers importados con el prefijo /api para manejar las rutas relacionadas con carritos y productos
app.use('/api/users', userRouter); //BBDD
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/api/session', sessionRouter);
//cookie
//--
app.use('/api/auth', authRouter);  // Usar las rutas de autenticación

app.get('/', authMiddleware.checkJwt, async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        if (user) {
            res.render('home', { user });  // Renderizar la página principal con los datos del usuario
        } else {
            res.redirect('/login');  // Redirigir a la página de login si el usuario no está autenticado
        }
    } catch (error) {
        res.status(500).send(error);
    }
});
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (!await user.comparePassword(password)) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

app.use(passport.initialize());
app.use(passport.session());

//--
// Esta ruta sigue siendo válida ya que es una simple respuesta para el path raíz del servidor
app.get('/produc', (req, res) => {
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