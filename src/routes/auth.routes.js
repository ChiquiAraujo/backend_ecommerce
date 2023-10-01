import express from 'express';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.models.js';
import passport from 'passport';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const user = new userModel(req.body);
        await user.save();
        res.status(200).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) return res.status(404).send('No user found.');
        
        const passwordIsValid = await user.comparePassword(req.body.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 60 // expires in 1 minute
        });
        
        res.status(200).send({ auth: true, token });
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;
