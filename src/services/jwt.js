const jwt = require('jwt-simple');
const moment = require('moment');
require('dotenv').config({ path: '.env' });

// Clave secreta
const secret = process.env.SECRET;

exports.createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix(),
    }

    return jwt.encode(payload, secret);
}