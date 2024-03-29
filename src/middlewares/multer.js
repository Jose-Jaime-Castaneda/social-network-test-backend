const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destinationPath = path.join(__dirname, "../uploads/avatars/");
        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        cb(null, "avatar-" + Date.now() + "-" + file.originalname);
    }
});
const uploads = multer({ storage });

const storagePublication = multer.diskStorage({
    destination: (req, file, cb) => {
        const destinationPath = path.join(__dirname, "../uploads/publications/");
        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        cb(null, "publication-" + Date.now() + "-" + file.originalname);
    }
});
const uploadPublications = multer({ storage: storagePublication });

module.exports = {
    uploads,
    uploadPublications,
};