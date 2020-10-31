const Sauce = require('../models/sauce');
const fs = require('fs');

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
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

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
    




