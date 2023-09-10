import { Router } from "express";
import { userModel } from "../models/user.modeles.js";

const userRouter = Router();

userRouter.get('/', async (req,res) => {
    try{
        const users = await userModel.find()
        res.status(200).send({respuesta: 'OK', mensaje: users});
    }catch(error) {
        res.status(400).send({respuesta:'ERROR al consultar usuario', mensaje: error});
    }
});

// Rutas de diagnóstico movidas antes de la ruta con parámetro
// ruta únicamente para diagnóstico
userRouter.get('/diagnose/null-emails', async (req, res) => {
    try {
        const nullEmailUsers = await userModel.find({ email: null });
        if (nullEmailUsers.length > 0) {
            return res.status(200).send({ respuesta: 'Usuarios con email nulo detectados', usuarios: nullEmailUsers });
        } else {
            return res.status(200).send({ respuesta: 'No se detectaron usuarios con email nulo' });
        }
    } catch (error) {
        return res.status(400).send({ respuesta: 'Error al realizar diagnóstico', mensaje: error });
    }
});

//Eliminar
userRouter.delete('/diagnose/delete-null-emails', async (req, res) => {
    try {
        const result = await userModel.deleteMany({ email: null });
        return res.status(200).send({ respuesta: 'Usuarios con email nulo eliminados', detalle: result });
    } catch (error) {
        return res.status(400).send({ respuesta: 'Error al eliminar usuarios con email nulo', mensaje: error });
    }
});

userRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.findById(id);
        if (user) {
            res.status(200).send({ respuesta: 'OK', mensaje: user });
        } else {
            res.status(404).send({ respuesta: 'Error', mensaje: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(400).send({ respuesta: 'ERROR al consultar usuarios', mensaje: error });
    }
});

userRouter.post('/', async (req,res) => {
    console.log(req.body);
    const { nombre, apellido, edad, email, password } = req.body;
    try {
        const respuesta = await userModel.create({ nombre, apellido, edad, email, password });
        res.status(200).send({respuesta: 'OK', mensaje: respuesta});        
    } catch(error) {
        res.status(400).send({respuesta: 'Error al crear usuario', mensaje: error});
    }
});

userRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, edad, email, password } = req.body;
    try {
        const user = await userModel.findByIdAndUpdate(id, { nombre, apellido, edad, email, password });
        if (user) {
            res.status(200).send({ respuesta: 'OK', mensaje: user });
        } else {
            res.status(404).send({ respuesta: 'Error al actualizar usuario', mensaje: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(400).send({ respuesta: 'ERROR', mensaje: error });
    }
});

userRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.findByIdAndDelete(id);
        if (user) {
            res.status(200).send({ respuesta: 'OK', mensaje: user });
        } else {
            res.status(404).send({ respuesta: 'Error al eliminar usuario', mensaje: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(400).send({ respuesta: 'ERROR al eliminar usuario', mensaje: error });
    }
});

export default userRouter;
