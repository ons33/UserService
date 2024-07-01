const mongoose = require('mongoose');

const OffreDemploiSchema = new mongoose.Schema({
  offreId: Number,
  intitule: String,
  typeOffre: String,
  description: String,
  lieu: String,
  entrepriseNom: String,
  salaire: Number,
  photo: String,
});

const OffreDemploi = mongoose.model('OffreDemploi', OffreDemploiSchema);

module.exports = OffreDemploi;
