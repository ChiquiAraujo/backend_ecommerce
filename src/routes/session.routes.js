import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.modeles.js';

const sessionRouter = express.Router();

// Login existente con tu lógica de autenticación
sessionRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (req.session.login) {
            res.status(200).send({ resultado: 'Login ya existente' });
        }
        const user = await userModel.findOne({ email: email });
        if (user) {
            if (user.password == password) {
                // Genera y envía un JWT en una cookie al cliente
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.cookie('jwt', token, { httpOnly: true, secure: true });

                req.session.login = true;
                res.status(200).send({ resultado: 'Login válido', message: user });
                res.redirect('rutaProductos', 200, { 'info': 'user' });
            } else {
                res.status(401).send({ resultado: 'Contraseña no válida', message: password });
            }
        } else {
            res.status(400).send({ resultado: 'Not found', message: user });
        }
    } catch (error) {
        res.status(400).send({ error: `Error en el Login ${error}` });
    }
});

// Logout existente
sessionRouter.get('/logout', (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect('rutaLogin', 200, { resultado: 'Usuario deslogueado' });
});

// Ruta de perfil utilizando JWT y Passport
sessionRouter.get('/profile', passport.authenticate('current', { session: false, failureRedirect: '/login' }), (req, res) => {
    res.status(200).json({
        message: 'This is the profile page',
        user: req.user,
    });
});

export default sessionRouter;
