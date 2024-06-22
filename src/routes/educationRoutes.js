// routes/education.js
import express from 'express';
import { createEducation, getAllEducations, getEducationById, updateEducation, deleteEducation } from '../controllers/educationController.js';

const router = express.Router();

// Route pour créer une nouvelle éducation
router.post('/', createEducation);

// Route pour récupérer toutes les éducations
router.get('/', getAllEducations);

// Route pour récupérer une éducation par son ID
router.get('/:id', getEducationById);

// Route pour mettre à jour une éducation
router.put('/:id', updateEducation);

// Route pour supprimer une éducation
router.delete('/:id', deleteEducation);

export default router;
