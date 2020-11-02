// constant express pour utiliser l'application express 
const express = require('express');
// constant router pour utiliser la méthode router de epress
const router = express.Router();


const userCtrl = require('../controllers/user');
// la router signup pour sinscrire avec la fonctionne signup dans le dossier controllers
router.post('/signup', userCtrl.signup);
// la router login pour se connecter avec la fonctionne login dans le dossier controllers
router.post('/login', userCtrl.login);


module.exports = router;