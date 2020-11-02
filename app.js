// utiliser les méthodes express de node
const express = require('express');
// parser 
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const mongoMask = require('mongo-mask');



const userRoutes = require('./routes/user');
// enregistrer le nouveau routeur dans l'application
const saucesRoutes = require('./routes/sauces');
const path = require('path');
// Connectez l’API au cluster MongoDB avec le userName et le password 


mongoose.connect('mongodb+srv://abdo_20:4welGMViepAEHLu4@cluster0.ll4ox.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();
// ajouter les headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use(bodyParser.json());
//gérer la ressource images de manière statique (un sous-répertoire de notre répertoire de base, __dirname ) 

app.use('/images', express.static(path.join(__dirname, 'images')));
// les middleware pour préciser le URI dans le siteweb

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;