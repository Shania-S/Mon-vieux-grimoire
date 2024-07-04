const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = (req, res, next) => {
  // hasher le mdp avec le hash crée par bcrypt
  // hash : fonction pour hasher et crypter un mdp
  // salt : combien de fois on execute l'algo de hashage, 10 est
  // suffisant pour créer un mdp sécurisé
  // plus on fait pls de tours, plus ça prend du temps
  // methode asynchrone
  console.log('got here');
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ messages: 'Utilisateur créé' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        res
          .status(401)
          .json({ message: 'Paire identifiant/mot de passe incorrecte' });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              // erreur d'authentification
              res
                .status(401)
                .json({ message: 'Paire identifiant/mot de passe incorrecte' });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                  // Nous utilisons la fonction sign de jsonwebtoken pour chiffrer un nouveau token.
                  {
                    userId: user._id,
                  },
                  'RANDOM_TOKEN_SECRET',
                  { expiresIn: '24h' }
                ), // s'assurer que cette requete correspond à ce user id
              });
            }
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
