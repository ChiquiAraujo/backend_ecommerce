import { Router } from "express";
import { userModel } from "../models/user.modeles.js"

const sessionRouter = Router();

sessionRouter.post('/login', async (req, res) => {
console.log("Solicitud de inicio de sesión recibida.");
console.log("Cuerpo de la solicitud:", req.body); 
// 
const { email, password } = req.body;
console.log("Correo electrónico proporcionado:", email);


    console.log("Solicitud de inicio de sesión recibida.");
    console.log("Correo electrónico proporcionado:", email);

    try {
        if (req.session.login) {
            console.log("Usuario ya ha iniciado sesión previamente.");
            return res.status(200).send({ resultado: 'Login ya existente' });
        }

        const user = await userModel.findOne({ email: email });

        if (user) {
            if (user.password == password) {
                console.log("Inicio de sesión válido. Usuario encontrado:", user);
                req.session.login = true;
                return res.status(200).send({ resultado: 'Login valido', message: user });

            } else {
                console.log("Contraseña incorrecta. Contraseña proporcionada:", password);
                return res.status(401).send({ resultado: 'Contraseña incorrecta', message: 'Password incorrecta' });
            }
        } else {
            console.log("Usuario no encontrado en la base de datos.");
            return res.status(404).send({ resultado: 'Not Found', message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error("Error en Login:", error);
        return res.status(400).send({ error: `Error en Login: ${error}` });
    }
});

sessionRouter.get('/logout', (req, res) =>{
    if(req.session.login){
        req.session.destroy();
        console.log("Usuario deslogueado.");
        return res.status(200).send({ resultado: 'Usuario deslogueado' });
    } else {
        console.log("Ningún usuario ha iniciado sesión previamente.");
        return res.status(200).send({ resultado: 'Usuario no ha iniciado sesión previamente' });
    }
});

export default sessionRouter;
