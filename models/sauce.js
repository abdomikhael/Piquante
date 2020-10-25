const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const sauceSchema = mongoose.Schema ({
    userId: { type: String },
    name: { type: String},
    manufacturer: { type: String},
    description: { type: String },
    mainPepper: { type: String },
    imageUrl: { type: String },
    heat: { type: Number },
    likes: { type: Number  },
    dislikes: { type: Number},
    usersLiked: { type: Array },
    usersDisliked: { type: Array }
});

sauceSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Sauce', sauceSchema);
