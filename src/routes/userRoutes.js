

import express from 'express';
import { initKeycloak } from '../config/keycloak-config.js';

import * as userController from "../controllers/userController.js";
import upload from '../config/Multer.js'; 

import {



 uplaodImage

} from "../controllers/userController.js";
const router=express.Router();



router.get('/:userId/competences-and-experiences', userController.getCompetencesAndExperiencesByUserId);
router.get('/:userId/compEduExp', userController.  getCompetencesEducationAndExperiencesByUserId,
);

router.get("/", userController.getAll);


//router.put('/editProfile/:id',updateUser);
// router.get('/getUserFromKeycloak/:id',getUserFromKeycloak);
// router.post('/verifUnicEmail',verifUnicEmail )

// router.post('/verifUnicMobile',verifUnicMobile )

router.post('/uplaodImage',upload.single('image'),uplaodImage )

//router.post('/verifUnicUsername',verifUnicUsername )
//router.put('/updateImage/:idUser',updateImage )
//router.post('/assignDefaultRole/:userId', assignDefaultRole);

export default router;
