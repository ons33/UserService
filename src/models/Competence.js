// models/Competence.js
import mongoose from "mongoose";

const competenceSchema = new mongoose.Schema({
  nomCompetence: { type: String, required: true },
  niveauMaitrise: { type: String, required: true },

  user: { type: String, required: true },
});

const Competence = mongoose.model('Competence', competenceSchema);

export default Competence;
