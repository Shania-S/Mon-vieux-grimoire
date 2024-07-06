// vérifie la validité du jeton JWT pour authentifier les users
// permet de protéger les routes sensibles en s'assurant que seules les requêtes authentifiés peuvent les atteindre
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // token extrait de l'en-tête d'autorisation de la requête.
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // décoder le token, vérifie et décode le token en utilisant une clé secrète.
    const userId = decodedToken.userId;
    // extrait l'ID utilisateur du token décodé et l'ajoute à l'objet req pour le rendre disponible dans les routes suivantes
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
