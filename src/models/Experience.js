import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  nomEntreprise: { type: String, required: true },
  poste: { type: String, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  description: { type: String, required: false },

  user: { type: String, required: true },
});

const Experience = mongoose.model('Experience', experienceSchema);

export default Experience;
