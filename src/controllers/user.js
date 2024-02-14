const bcrypt = require('bcrypt');
const pagination = require('mongoose-pagination');
const fs = require('fs');
const path = require('path');
const jwt = require('../services/jwt');
const User = require('../models/User');
const ValidateUser = require('../validations/user');

const rutaPrueba = async (req, res) => {
    try {
        res.status(200).json({
            status: 'success',
            message: 'Hola',
            user: req.user,
        })
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: 'Adios',
            error: error.message,
        })
    }
}

const createUser = async (req, res) => {
    try {
        const params = req.body;
        let validationStatus = ValidateUser.validateRequiredFields(params);
        if (validationStatus.status === 'error') throw new Error(validationStatus.message);


        validationStatus = await ValidateUser.validateExistingUser(params.nick, params.email);
        if (validationStatus.status === 'error') throw new Error(validationStatus.message);


        params.password = await bcrypt.hash(params.password, 10);

        const user_to_save = User(params);
        user_to_save.save();

        res.status(200).json({
            status: 'success',
            message: validationStatus.message,
            user: user_to_save
        })

    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: 'Ocurrió un error al intentar guardar el usuario',
            error: error.message
        })
    }
}

const login = async (req, res) => {
    try {
        const params = req.body;
        let validateUser = await ValidateUser.validateLogin(params.email, params.password);
        if (validateUser.status === 'error') throw new Error(validateUser.message);


        const token = jwt.createToken(validateUser.user);

        res.status(200).json({
            satus: 'success',
            message: validateUser.message,
            token: token
        })

    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: 'Hubo un error al iniciar sesión',
            error: error.message
        })
    }
}

const getUserInfo = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) throw new Error('Debes ingresar un ID válido');


        const user_to_get = await User.findById(id).select('name lastname nick image');

        if (!user_to_get) throw new Error('No se ha encontrado ningun usuario con ese ID');


        res.status(200).json({
            status: 'success',
            message: 'Usuario obtenido correctamente',
            user: user_to_get,
        })

    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: 'Hubo un error obteniendo la información del perfil',
            error: error.message,
        })
    }
}

const getUserList = async (req, res) => {
    try {
        let page = 1;
        let itemsPerPage = 4;

        if (req.params.page) page = req.params.page;
        page = parseInt(page);

        const totalUsers = await User.countDocuments();
        const usersToShow = await User.find().sort({ date: -1 }).paginate(page, itemsPerPage);
        if (!usersToShow) throw new Error('No jaló el endpoint para obtener a los usuarios');


        res.status(200).json({
            status: 'success',
            message: 'Usuarios obtenidos correctamente',
            users: usersToShow,
            pagination: {
                totalUsers: totalUsers,
                usersPerPage: itemsPerPage,
                currentPage: page,
                totalPages: Math.ceil(totalUsers / itemsPerPage),
            }
        });

    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: 'Hubo un error al intentar obtener los usuarios',
            error: error.message,
        })
    }
}

const updateUser = async (req, res) => {
    try {
        let currentUser = req.user;
        const userToUpdate = req.body;
        let validationStatus = await ValidateUser.validateExistingUser(userToUpdate.nick, userToUpdate.email);

        if (validationStatus.status === 'error') {
            const userConflict = validationStatus.user && validationStatus.user.toString() !== currentUser.id;
            if (userConflict) throw new Error('La información que intentas actualizar ya está en uso');
        }

        const newUser = await User.findByIdAndUpdate(currentUser.id, userToUpdate, { new: true });

        res.status(200).json({
            status: 'success',
            message: 'Usuario actualizado correctamente',
            user: newUser,
        })

    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: 'Hubo un error al intentar actualizar el usuario',
            error: error.message,
        })
    }
}

const deleteUser = async (req, res) => {
    try {

    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: 'Hubo un error al intentar borrar la cuenta.',
            error: error.message,
        })
    }
}

const uploadImg = async (req, res) => {
    try {
        if (!req.file) throw new Error('No se detecto ninguna imagen');

        let extension = req.file.mimetype.split("/")[1];

        let validationStatus = await ValidateUser.validateImgExtension(extension);
        if (validationStatus.status === 'error') throw new Error(validationStatus.message);

        const uploadImage = await User.findOneAndUpdate(
            { _id: req.user.id },
            { image: req.file.filename },
            { new: true }
        );
        if (!uploadImage) throw new Error('No se pudo subir la imagen, valió');

        res.status(200).json({
            status: 'success',
            message: 'Imagen de usuario subida correctamente',
            user: uploadImage,
        })

    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: 'Hubo un error al subir la imagen de usuario',
            error: error.message,
        })
    }
}

const getImgProfile = async (req, res) => {
    try {
        const file = req.params.file;
        if (!file) throw new Error('No se detecto un nombre de imagen');

        const filePath = path.join(__dirname, "../uploads/avatars/" + file);
        const exists = await fs.promises.stat(filePath);
        if (!exists) throw new Error('Archivo no encontrado');

        res.sendFile(path.resolve(filePath));
        
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: 'Hubo un error al obtener la imagen de perfil',
            error: error.message,
        })
    }
}

module.exports = {
    createUser,
    login,
    rutaPrueba,
    getUserInfo,
    getUserList,
    updateUser,
    deleteUser,
    uploadImg,
    getImgProfile,
}