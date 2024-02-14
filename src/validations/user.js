const bcrypt = require('bcrypt');
const fs = require('fs');
const User = require('../models/User');

const validateRequiredFields = (data) => {

    if (!data || !data.name || !data.nick || !data.email || !data.password) {
        return {
            status: 'error',
            message: 'Llene todos los campos requeridos'
        };
    } else {
        return {
            status: 'success',
            message: 'Datos validados correctamente',
        };
    }
}

const validateExistingUser = async (nick, email) => {
    const existingUser = await User.findOne({
        $or: [
            {
                email: email.toLowerCase()
            },
            {
                nick: nick.toLowerCase()
            },
        ]
    }).exec();

    if (existingUser) {
        return {
            status: 'error',
            message: 'Ya hay un usuario con ese email o nickname',
            user: existingUser._id
        };
    } else {
        return {
            status: 'success',
            message: 'No hay usuarios con ese email o nickname',
        };
    }
}

const validateLogin = async (email, pwd) => {
    const existingUser = await User.findOne({
        email: email.toLowerCase()
    }).exec();

    if (existingUser) {
        const existingPwd = await bcrypt.compare(pwd, existingUser.password);
        if (existingPwd) {
            return {
                status: 'success',
                message: 'Usuario validado correctamente',
                user: existingUser
            };
        } else {
            return {
                status: 'error',
                message: 'La contraseña no coincide',
            };
        }
    } else {
        return {
            status: 'error',
            message: 'No existen usuarios con ese email',
        };
    }
}

const validateImgExtension = async (extension) => {
    if (extension !== "png" && extension !== "jpg" && extension !== "jpeg") {

        const filePath = req.file.path;
        const fileDeleted = fs.unlink(filePath);
        return {
            status: 'error',
            message: 'El archivo no tiene ningúna extensión válida PNG, JPG, JPEG',
        }
    }

    return {
        status: 'success',
        message: 'La extensión del archivo es válida',
    }
}

module.exports = {
    validateRequiredFields,
    validateExistingUser,
    validateLogin,
    validateImgExtension,
}