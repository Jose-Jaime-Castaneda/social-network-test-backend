const jwt = require('jwt-simple');
const moment = require('moment');
require('dotenv').config({ path: '.env' });

// Clave secreta
const secret = process.env.SECRET;

exports.auth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({
            status: 'error',
            message: 'La petición no tiene la cabecera',
        });
    }

    let token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        let payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(403).json({
                status: 'error',
                message: 'Token expirado',
            });
        }

        req.user = payload;

    } catch (error) {
        return res.status(404).json({
            status: 'error',
            message: 'Error al enviar el token',
            error: error.message
        })
    }

    next();
}