import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; 
import { userModel } from '../models/user.modeles.js';
import { sendPasswordResetEmail } from '../services/email.service.js';
import { createHash } from '../utils/bcrypt.js'; // Asegúrate de tener esta función en tu archivo bcrypt.js

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        // Crear un nuevo usuario y guardar en la base de datos
        const user = new userModel(req.body);
        user.password = createHash(user.password); // Asegurarse de que la contraseña esté hasheada
        await user.save();
        res.status(200).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        // Buscar usuario por correo electrónico
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send('No user found.');
        }

        // Comprobar si la contraseña es válida
        const passwordIsValid = await user.comparePassword(req.body.password);
        if (!passwordIsValid) {
            return res.status(401).send({ message: 'Invalid password.' });
        }

        // Crear y enviar token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.status(200).send({ auth: true, token });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        // Buscar usuario por correo electrónico
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).send('No user found with that email.');
        }

        // Generar y guardar token de restablecimiento de contraseña
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora

        await user.save();

        // Enviar correo electrónico con enlace para restablecer contraseña
        await sendPasswordResetEmail(user.email, `http://${req.headers.host}/reset-password/${resetToken}`);

        res.status(200).send({ message: 'An e-mail has been sent with further instructions.' });
    } catch (error) {
        res.status(500).send(error);
    }
});
// Restablecer la contraseña
router.get('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        };
        // Renderizar contraseña
        res.render('reset-password', { token });
    } catch (error) {
        res.status(500).send(error);
    };
});

// Guardar la nueva contraseña
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send('Este ha expirado.');
        }

        if (await user.comparePassword(password)) {
            return res.status(400).send('La nueva contraseña tiene que ser diferentea a la anterior');
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).send({ message: 'Su contraseña se ha actualizado' });
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;