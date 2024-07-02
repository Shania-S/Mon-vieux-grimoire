const express = require('express');
const mongoose = require('mongoose');
const app = express(); // créer une app express
const path = require('path');

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

mongoose
  .connect(
    'mongodb+srv://shashaU:Shaniania2511@cluster0.afy1a8o.mongodb.net/Mon_vieux_grimoire?retryWrites=true&w=majority&appName=Cluster0',
    {}
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());
console.log('here');

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

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app; // pour l'utiliser partout
