const Publication = require('../models/Publication');
const mongoosePagiante = require('mongoose-pagination');
const ValidateImg = require('../validations/user');
const fs = require('fs');

const createPublication = async (req, res) => {
    try {
        const userID = req.user.id;
        if (!userID) throw new Error('No se detecto usuario autenticado');

        const info = req.body;
        if (!info || Object.keys(info).length === 0) throw new Error('No se mandaron los datos necesarios');

        let newPublication = new Publication(info);
        newPublication.user = userID;

        const response = await newPublication.save();
        if (!response) throw new Error('No se pudo guardar la publicación');

        res.status(201).json({
            status: 'success',
            message: 'Publicacion creada correctamente',
            publication: response,
        })

    } catch (error) {
        res.status(402).json({
            status: 'error',
            message: 'Ocurrió un error al intentar crear la publicacion',
            error: error.message
        })
    }
}

const detail = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) throw new Error('No se detecto un ID de publicación');

        const publication = await Publication.findOne({ _id: id });
        if (!publication) throw new Error('No se encontró una publicación con ese ID');

        res.status(200).json({
            status: 'success',
            message: 'Detalle obtenido correctamente',
            publication: publication,
        })

    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: 'Hubo un error al intentar obtener el detalle',
            error: error.message,
        })
    }
}

const remove = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) throw new Error('No se detecto un ID de publicación');

        const publication = await Publication.findOneAndDelete({ _id: id });
        if (!publication) throw new Error('No se encontró una publicación con ese ID');

        res.status(200).json({
            status: 'success',
            message: 'Publicación eliminada correctamente',
            publication: publication,
        })

    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: 'Hubo un error al intentar eliminar la publicación',
            error: error.message,
        })
    }
}

const getPublications = async (req, res) => {
    try {
        let currentUser = req.user.id;
        if (!currentUser && !req.params.id) {
            throw new Error('No se detecto ningún usuario autenticado o un ID de usuario');
        } else if (req.params.id) {
            currentUser = req.params.id;
        }

        let page = 1;
        if (req.params.page) page = req.params.page;
        const itemsPerPage = 4;
        const total = await Publication.countDocuments({ user: currentUser });

        const publications = await Publication.find({ user: currentUser })
            .sort('-create_at')
            .populate('user', '-_id -email -password -role -date -__v')
            .select('-__v')
            .paginate(page, itemsPerPage);
        if (!publications || Object.keys(publications).length === 0) throw new Error('No se encontraron publicaciones');


        res.status(200).json({
            status: 'success',
            message: 'Publicaciones obtenidas correctamente',
            publications: publications,
            page: page,
            totalItems: total,
            itemsPerPage: itemsPerPage,
            totalPages: Math.ceil(total / itemsPerPage),
        })

    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: 'Hubo un error al obtener las publicaciones',
            error: error.message,
        })
    }
}

const uploadImg = async (req, res) => {
    try {
        if (!req.file) throw new Error('No se detecto ninguna imagen');

        let extension = req.file.mimetype.split("/")[1];

        let validationStatus = await ValidateImg.validateImgExtension(extension);
        if (validationStatus.status === 'error') throw new Error(validationStatus.message);

        const uploadImage = await Publication.findOneAndUpdate(
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

        const filePath = path.join(__dirname, "../uploads/publications/" + file);
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
    createPublication,
    detail,
    remove,
    getPublications,
    uploadImg,
    getImgProfile,
}