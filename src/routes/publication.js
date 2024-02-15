const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { uploadPublications } = require('../middlewares/multer');

// Importar controladores
const publicationController = require('../controllers/publication');

// Rutas GET ALL
router.get('/detail/:id', auth.auth, publicationController.detail);
router.get('/publications/:id?/:page?', auth.auth, publicationController.getUserPublications);
router.get('/get-img/:file', auth.auth, publicationController.getImgPublication);
router.get('/all-publications/:page?', auth.auth, publicationController.getPublications);
// Rutas POST
router.post('/create', auth.auth, publicationController.createPublication);
router.post('/uploadImg/:id', [auth.auth, uploadPublications.single('file1')], publicationController.uploadImg);
// Rutas PUT

// Rutas DELETE
router.delete('/remove/:id', auth.auth, publicationController.remove);

module.exports = router;