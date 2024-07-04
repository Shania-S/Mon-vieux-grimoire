const express = require('express'); // framework qui repose sur node, facilite la création et la gestion des serveurs
const mongoose = require('mongoose');
const app = express(); // Crée une instance de l'application Express.
const path = require('path');

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

// Connecte l'application à la base de données MongoDB.
mongoose
  .connect(
    'mongodb+srv://shashaU:Shaniania2511@cluster0.afy1a8o.mongodb.net/Mon_vieux_grimoire?retryWrites=true&w=majority&appName=Cluster0',
    {}
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Ajoute un middleware global pour analyser les requêtes JSON.
app.use(express.json());

// Configure les en-têtes CORS pour permettre les requêtes provenant de n'importe quelle origine.
// Définit comment les serveurs et les navigateurs interagissent, en spécifiant quelles ressources peuvent être demandées de manière légitime
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // origin qui a le droit d'accéder à notre api est tout le monde
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  ); // on donne l'autorisation d'utiliser certains headers sur l'objet requête
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  ); // ainsi que certaines requêtes

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

//Enregistre les routes de l'application pour les livres et les utilisateurs.
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app; // pour l'utiliser partout
