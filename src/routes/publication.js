const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

// Importar controladores
const publicationController = require('../controllers/publication');

// Rutas GET ALL
router.get('/detail/:id', auth.auth, publicationController.detail);
// Rutas POST
router.post('/create', auth.auth, publicationController.createPublication);
// Rutas PUT

// Rutas DELETE
router.delete('/remove/:id', auth.auth, publicationController.remove);

module.exports = router;