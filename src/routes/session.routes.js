import { Router } from "express";
import passport from "passport";

const sessionRouter = Router();

sessionRouter.post('/login', passport.authenticate('login') , async (req, res) => {
    try{
        if(!req.user){
            return res.status(401).send({ mensaje: "Usuario Invalido"})
        }

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            rol: req.user.rol
        }

        res.status(200).send({ payload: req.user });
    } catch (error) {
        res.status(500).send({ mensaje: `Error al iniciar sesion ${error}`});
    }
});

sessionRouter.post('/register', passport.authenticate('register') , async (req, res) => {
    try{
        if(!req.user){
            return res.status(401).send({ mensaje: "Usuario ya existente"})
        }
        res.status(200).send({ mensaje: 'Usuario Creado' });
    } catch (error) {
        res.status(500).send({ mensaje: `Error al registrar usuario ${error}`});
    }
});

sessionRouter.get('/logout', (req, res) => {
    if (req.session.user) {  // verificar la existencia de 'user' y no 'login'
        req.logout(function(err) {  
            if (err) { return next(err); }
            req.session.destroy(() => {  // Destruye la sesión completamente
                res.clearCookie('connect.sid', { path: '/' });  // Borra la cookie de la sesión
                console.log("Usuario deslogueado.");
                return res.status(200).send({ resultado: 'Usuario deslogueado' });
            });
        });
    } else {
        console.log("Ningún usuario ha iniciado sesión previamente.");
        return res.status(200).send({ resultado: 'Usuario no ha iniciado sesión previamente' });
    }
});


export default sessionRouter;