const Follow = require('../models/Follow');
const mongoosePagiante = require('mongoose-pagination');
const ValidateFollow = require('../validations/follow');

const follow = async (req, res) => {
    try {
        const userToFollow = req.body.follow;
        if (!userToFollow) throw new Error('No se ha indicado el usuario a seguir');

        const currentUser = req.user.id;
        if (!currentUser) throw new Error('No se ha detectado un usuario autenticado');

        let followUser = new Follow({
            user: currentUser,
            followed: userToFollow,
        });
        if (!followUser) throw new Error('Ocurrió un error al intentar seguir al usuario');

        const saveFollow = await followUser.save();
        if (!saveFollow) throw new Error('No se pudo guardar el Follow');

        res.status(201).json({
            status: 'success',
            message: 'Followed correctamente',
            follow: saveFollow,
        })

    } catch (error) {
        res.status(402).json({
            status: 'error',
            message: 'Ocurrió un error al intentar seguir al usuario',
            error: error.message
        })
    }
}

const unfollow = async (req, res) => {
    try {
        const userToUnfollow = req.params.id;
        if (!userToUnfollow) throw new Error('No se detectó un ID del usuario al dejar de seguir');

        const currentUser = req.user.id;
        if (!currentUser) throw new Error('No se detecto un usuario autenticado');

        const validateStatus = await ValidateFollow.validateExistingFollow(currentUser, userToUnfollow);
        if (validateStatus.status === 'error' || validateStatus.status === 'Critical error') throw new Error(validateStatus.message);

        const deletedFollow = await Follow.findOneAndDelete({
            user: currentUser,
            followed: userToUnfollow
        });
        if (!deletedFollow) throw new Error('No se pudo eliminar el seguimiento');

        res.status(200).json({
            status: 'success',
            message: 'Se dejó de seguir al usuario correctamente',
        })

    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: 'Hubo un error al intentar dejar de seguir al usuario',
            error: error.message,
        })
    }
}

const followsList = async (req, res) => {
    try {
        let currentUser = req.user.id;
        if (!currentUser && req.params.id) {
            throw new Error('No se detecto ningun ID de usuario');
        } else if (req.params.id) {
            currentUser = req.params.id
        }

        let page = 1;
        if (req.params.page) page = req.params.page;
        const itemsPerPage = 2;
        const total = await Follow.countDocuments({ user: currentUser });

        let follows = await Follow.find({
            "user": currentUser,
        }).populate('followed', '-email -role -__v -password -date')
            .paginate(page, itemsPerPage);
        if (follows.length === 0) throw new Error('Hubo un error obteniendo la lista de seguidos');

        res.status(200).json({
            status: 'success',
            message: 'Lista de usuario obtenida correctamente',
            follows: follows,
            total: total,
            pages: Math.ceil(total / itemsPerPage),
        })
    } catch (error) {
        res.status(200).json({
            status: 'error',
            message: 'Hubo un error al conseguir la lista se seguidos',
            error: error.message,
        })
    }
}

const followersList = async (req, res) => {
    try {
        let currentUser = req.user.id;
        if (!currentUser) {
            throw new Error('No se detecto un usuario autenticado');
        } else if (req.params.id) {
            currentUser = req.params.id
        }

        let page = 1;
        if (req.params.page) page = req.params.page;
        const itemsPerPage = 2;
        const total = await Follow.countDocuments({ followed: currentUser });

        let follows = await Follow.find({
            "followed": currentUser,
        }).populate('user', '-email -role -__v -password -date')
            .paginate(page, itemsPerPage);
        if (follows.length === 0) throw new Error('Hubo un error obteniendo la lista de seguidores');

        res.status(200).json({
            status: 'success',
            message: 'Lista de seguidores obtenida correctamente',
            follows: follows,
            total: total,
            pages: Math.ceil(total / itemsPerPage),
        })

    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: 'Hubo un error al obtener la lista de seguidores',
            error: error.message,
        })
    }
}

module.exports = {
    follow,
    unfollow,
    followsList,
    followersList,
}