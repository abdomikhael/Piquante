const express = require('express');
const router = express.Router();
const Sauce = require('../models/sauce');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceCtrl = require('../controllers/sauces');
const likeCtrl = require('../middleware/like-config');
const sauceForm = require('../middleware/sauceform-check')
const pictureDelete = require('../middleware/formPicture-delete')
const pictureUpdate = require('../middleware/pictureUpdate')


router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce, pictureDelete);
router.put('/:id', auth, multer, pictureUpdate, sauceCtrl.modifySauce, pictureDelete);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, likeCtrl, sauceCtrl.likeSauce)


module.exports = router;