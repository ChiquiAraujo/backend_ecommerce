import { Router } from "express";
import { userModel } from "../models/user.modeles.js";
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const userRouter = Router();

// Configuración de Multer para cargar documentos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = `./uploads/${req.params.id}/`;
    fs.exists(dir, exist => {
      if (!exist) {
        return fs.mkdir(dir, { recursive: true }, error => cb(error, dir));
      }
      return cb(null, dir);
    });
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
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

// Cambiar el rol de un usuario a premium y guardar documentos
userRouter.post('/:id/premium', upload.array('documents'), async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).send
            res.status(404).send({ respuesta: 'Error', mensaje: 'Usuario no encontrado' });
        }
        // Verificar y guardar los documentos subidos
        if (req.files && req.files.length > 0) {
            
            let documents = req.files.map(file => ({
                name: file.originalname,
                reference: file.path 
            }));

            user.documents = documents;
            user.rol = 'premium';

            await user.save();
            res.status(200).send({ respuesta: 'OK', mensaje: `Usuario actualizado a premium con documentos`, documentos: user.documents });
        } else {
            res.status(400).send({ respuesta: 'Error', mensaje: 'No se subieron documentos' });
        }
    } catch (error) {
        res.status(500).send({ respuesta: 'ERROR al actualizar el rol del usuario', mensaje: error });
    }
});

export default userRouter;
