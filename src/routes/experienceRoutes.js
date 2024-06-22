import express from 'express';
import * as experienceController from '../controllers/experienceController.js';
const router = express.Router();

// Routes CRUD pour Experience
router.post('/', experienceController.createExperience);
router.get('/', experienceController.getAllExperiences);
router.get('/:id', experienceController.getExperienceById);
router.put('/:id', experienceController.updateExperience);
router.delete('/:id', experienceController.deleteExperience);

export default router;