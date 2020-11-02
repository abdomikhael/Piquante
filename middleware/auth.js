 
const jwt = require('jsonwebtoken');
// fonctionnalités d'authorization de manipulez les data si on a le bon userId et password

module.exports = (req, res, next) => {
  try {
    // la constant jwt de la TOKEN
    const token = req.headers.authorization.split(' ')[1];
    // constant pour utiliser la fonction verify pour décoder le token extrayer l'ID
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //extrayer l'ID utilisateur  token 
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
