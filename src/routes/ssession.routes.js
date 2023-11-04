import { Router } from "express";
import passport from "passport";

const sessionRouter = Router();

sessionRouter.post('/login', passport.authenticate('login'), async (req, res) => {
    try{
        if(!req.user){
            return res.status(401).send({mensaje: "Invalidate User"})
        }

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
        }

        res.status(200).send({ payload: req.user })

    } catch (error){
        res.status(500).send({mensaje: `Erro al iniciar sesión ${error}`})
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
