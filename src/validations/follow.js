const Follow = require('../models/Follow');

const validateExistingFollow = async (user, followed) => {
    if (!user || !followed) return { status: 'error', message: 'Manda los parámetros pai' };

    try {
        const followers = await Follow.find({
            "user": user,
            "followed": followed
        });
        if (followers.length === 0) return { status: 'error', message: 'Ni se seguian' };

        return {
            status: 'success',
            message: 'Seguimiento encontrado',
        }

    } catch (error) {
        return {
            status: 'Critical error',
            message: error.message,
        }
    }
}

module.exports = {
    validateExistingFollow,
}