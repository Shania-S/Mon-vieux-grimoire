const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // créer un index unique sur ce champ
  password: { type: String, required: true },
});

// pour éviter d'avoir plusieurs utilisateurs avec la même mail
userSchema.plugin(uniqueValidator); //ajoute une validation de l'unicité à Mongoose avant d'enregistrer un document, capture cette erreur d'unicité au niveau de Mongoose et de renvoyer un message d'erreur plus convivial

module.exports = mongoose.model('User', userSchema);
