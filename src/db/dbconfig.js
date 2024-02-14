const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.dbURI);
        console.log('Base de datos conectada');
    } catch (error) {
        throw new Error('No se pudo conectar a la BD');
    }
}

module.exports = {
    dbConnection,
}