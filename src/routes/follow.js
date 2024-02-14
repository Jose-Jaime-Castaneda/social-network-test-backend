const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

// Importar controladores
const followController = require('../controllers/follow');

// Rutas GET ALL
router.get('/followsList/:id?/:page?', auth.auth, followController.followsList);
router.get('/followersList/:id?/:page?', auth.auth, followController.followersList);
// Rutas POST
router.post('/follow', auth.auth, followController.follow);
// Rutas PUT

// Rutas DELETE
router.delete('/unfollow/:id', auth.auth, followController.unfollow);

module.exports = router;