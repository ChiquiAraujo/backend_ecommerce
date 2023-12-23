/**
 * Middleware que verifica si el JWT está presente y es válido.
 *
 * @param {object} req - El objeto de solicitud de Express.js.
 * @param {object} res - El objeto de respuesta de Express.js.
 * @param {function} next - La siguiente función de middleware en la pila.
 * @returns {Response|void} - Devuelve una respuesta si hay un error, de lo contrario llama al siguiente middleware.
 */
export const checkJwt = (req, res, next) => {
    // Extrae el token del encabezado 'x-access-token'
    const token = req.headers['x-access-token'];

    // Si no se proporciona un token, devuelve un error
    if (!token) {
        return res.status(403).send({ auth: false, message: 'No se proporcionó token.' });
    }
    
    // Verifica el token usando la clave secreta
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        // Si el token no es válido, devuelve un error
        if (err) {
            return res.status(500).send({ auth: false, message: 'Error al autenticar el token.' });
        }
        
        // Si el token es válido, adjunta el ID de usuario decodificado al objeto de solicitud
        req.userId = decoded.id;
        // Llama al siguiente middleware
        next();
    });
};
