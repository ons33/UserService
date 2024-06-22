import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({


  ecole: {
    type: String,
    required: true
  },
  diplome: {
    type: String,
    required: true
  },
  domaineEtude: {
    type: String,
    required: true
  }, 
  dateDebut: {
    type: Date,
    required: true
  },
  dateFin: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  user: { type: String, required: true },
});

const Education = mongoose.model('Education', educationSchema);

export default Education;
