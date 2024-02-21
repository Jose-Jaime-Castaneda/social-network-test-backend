const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { uploads } = require('../middlewares/multer');

// Importar controladores
const userController = require('../controllers/user');

// Rutas GET
router.get('/prueba', auth.auth, userController.rutaPrueba);
router.get('/profile/:id', auth.auth, userController.getUserInfo);
router.get('/users/:page?', auth.auth, userController.getUserList);
router.get('/profileImg/:file', userController.getImgProfile);
// Rutas POST
router.post('/create', userController.createUser);
router.post('/login', userController.login);
router.post('/logout', auth.auth, userController.logout);
router.post('/upload-image', [auth.auth, uploads.single("file0")], userController.uploadImg);
// Rutas PUT
router.put('/update', auth.auth, userController.updateUser);
// Rutas DELETE
router.delete('/delete', auth.auth, userController.deleteUser);

module.exports = router;