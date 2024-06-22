// routes/competenceRoutes.js
import * as competenceController from '../controllers/competenceController.js';
import express from 'express';

const router = express.Router();

// Routes CRUD pour Competence
router.post('/', competenceController.createCompetence);
router.get('/', competenceController.getAllCompetences);
router.get('/:id', competenceController.getCompetenceById);
router.put('/:id', competenceController.updateCompetence);
router.delete('/:id', competenceController.deleteCompetence);

export default router;
