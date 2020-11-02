// contant mongoose pour utiliser la méthode schema
const mongoose = require('mongoose');
// le constant Sauce 
const sauceSchema = mongoose.Schema({
    userId: {type: String},
    name: {type: String},
    manufacturer: { type: String},
    description: {type: String},
    mainPepper: {type: String},
    imageUrl: {type: String},
    heat: { type: Number},
    likes: { type: Number},
    dislikes: { type: Number},
    usersLiked: { type: Array},
    usersDisliked: { type: Array}
});
//la méthode Schema mise à disposition par Mongoose. 
//exporter ce schéma en tant que modèle Mongoose appelé « Sauce », le rendant par là même disponible pour notre application Express. 

module.exports = mongoose.model('Sauce', sauceSchema);