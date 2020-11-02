// créer une constant Sauce pour utiliser le model SAuce
const Sauce = require('../models/sauce');
// la constant FS pour la fonction delete 
const fs = require('fs');
// la fonction GET pour afficher toutes les sauces 
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};


// la fonction GET pour afficher les information d'une sauce 
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(  
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
// la fonction post pour envoyer les valeurs des forumalires rempli par les utilisateurs  
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  // créer un nouveau objet avec les éléments du model sauce
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};
// la fonction PUT pour modifier les data saisies par le meme utilisateurs
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    if(!req.body.errorMessage) {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => {
            if(!req.file) {
                res.status(200).json({ message: "La sauce a bien été modifiée!"})
            } else {
                next();
            }
        })
        .catch(error => { 
            if(error.message.indexOf("duplicate key")>0) {
                req.body.errorMessage = "Le nom de cette sauce existe déjà!";
            }
            next();
        })
    } else {
        next();
    }
};
// la fonction delete pour supprimer la sauce ajoutée
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'La sauce a bien été supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
};
// la fonction post pour ajouter des likes et dislikes sur les sauces et pour les retires 
exports.likeSauce = (req, res, next) => {

  switch (req.body.like) {
     //Liker une sauce
     case 1:
          Sauce.updateOne({ _id: req.params.id }, {
                  $inc: { likes: 1 },
                  $push: { usersLiked: req.body.userId },
              })
              .then(() => { res.status(200).json({ message: 'Sauce likée' }) })
              .catch((error) => { res.status(400).json({ error: error }) });
          break;
    
      //Disliker une sauce
      case -1:
          Sauce.updateOne({ _id: req.params.id }, {
                  $inc: { dislikes: 1 },
                  $push: { usersDisliked: req.body.userId },
              })
              .then(() => { res.status(200).json({ message: 'Sauce Dislikée'}) })
              .catch((error) => { res.status(400).json({ error: error }) });
          break; 
       
      //Retirer like
      case 0:
          Sauce.findOne({ _id: req.params.id })
              .then((sauce) => {
                  if (sauce.usersLiked.find(user => user === req.body.userId)) {
                      Sauce.updateOne({ _id: req.params.id }, {
                              $inc: { likes: -1 },
                              $pull: { usersLiked: req.body.userId },
                          })
                          .then(() => { res.status(200).json({ message: 'Like retiré' }) })
                          .catch((error) => { res.status(400).json({ error: error }) })
                  }
              
     //Retirer Dislike
                  if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                      Sauce.updateOne({ _id: req.params.id }, {
                              $inc: { dislikes: -1 },
                              $pull: { usersDisliked: req.body.userId },
                          })
                          .then(() => { res.status(200).json({ message: 'Dislike retiré' }) })
                          .catch((error) => { res.status(400).json({ error: error }) })
                  }
              })
          break;
  }
}
    




