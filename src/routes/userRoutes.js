import express from 'express';
import { initKeycloak } from '../config/keycloak-config.js';

import * as userController from "../controllers/userController.js";
import upload from '../config/Multer.js';

import { uplaodImage } from "../controllers/userController.js";
const router = express.Router();

router.get(
  '/:userId/competences-and-experiences',
  userController.getCompetencesAndExperiencesByUserId
);
router.get(
  '/:userId/compEduExp',
  userController.getCompetencesEducationAndExperiencesByUserId
);

router.get("/", userController.getAll);

router.post('/uplaodImage', upload.single('image'), uplaodImage);

export default router;
