import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.models.js'; 


// Opciones de configuración
const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies?.jwt]),
  secretOrKey: process.env.JWT_SECRET, //contraseña que esta guardada en .env
};
//Aquí defino current
passport.use('current', new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id); 
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

export default passport;
