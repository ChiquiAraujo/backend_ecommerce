import { Router } from "express";
import { userModel } from "../models/user.models.js";

const userRouter = Router();

// Obtener todos los usuarios
userRouter.get('/', async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).send({ respuesta: 'OK', mensaje: users });
    } catch (error) {
        res.status(400).send({ respuesta: 'ERROR al consultar usuarios', mensaje: error });
    }
});
// Obtener un usuario por ID
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
        res.status(400).send({ respuesta: 'ERROR al consultar usuario', mensaje: error });
    }
});

// Actualizar un usuario
userRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, age, email, password } = req.body;
    try {
        const user = await userModel.findByIdAndUpdate(id, { first_name, last_name, age, email, password }, { new: true });
        if (user) {
            res.status(200).send({ respuesta: 'OK', mensaje: 'Usuario actualizado' });
        } else {
            res.status(404).send({ respuesta: 'Error', mensaje: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(400).send({ respuesta: 'ERROR al actualizar usuario', mensaje: error });
    }
});

// Eliminar un usuario
userRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.findByIdAndDelete(id);
        if (user) {
            res.status(200).send({ respuesta: 'OK', mensaje: 'Usuario eliminado' });
        } else {
            res.status(404).send({ respuesta: 'Error', mensaje: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(400).send({ respuesta: 'ERROR al eliminar usuario', mensaje: error });
    }
});

// Cambiar el rol de un usuario
userRouter.post('/:id/premium', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).send({ respuesta: 'Error', mensaje: 'Usuario no encontrado' });
        }

        // Cambiar el rol del usuario
        user.rol = user.rol === 'premium' ? 'user' : 'premium';
        await user.save();

        res.status(200).send({ respuesta: 'OK', mensaje: `Rol actualizado a ${user.rol}` });
    } catch (error) {
        res.status(500).send({ respuesta: 'ERROR al actualizar el rol del usuario', mensaje: error });
    }
});

export default userRouter;