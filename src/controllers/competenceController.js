import { Router } from 'express';
import Competence from '../models/Competence.js'; 
import Experience from '../models/Experience.js'; 
import User from '../models/User.js'; 

const router = Router();
//create Competence
const createCompetence = async (req, res) => {
  try {
    const { userId, ...competenceData } = req.body;
    const competence = new Competence({ ...competenceData, user: userId }); 
    await competence.save();
    res.status(201).json(competence);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//get All Competences
const getAllCompetences = async (req, res) => {
  try {
    const competences = await Competence.find();
    res.status(200).json(competences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//get Competence By Id
const getCompetenceById = async (req, res) => {
  try {
    const competence = await Competence.findById(req.params.id);
    res.status(200).json(competence);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//update Competence
const updateCompetence = async (req, res) => {
  try {
    const updatedCompetence = await Competence.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedCompetence);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//delete Competence
const deleteCompetence = async (req, res) => {
  try {
    await Competence.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//get Competences And Experiences By UserId
async function getCompetencesAndExperiencesByUserId(userId) {
  try {
    const user = await User.findById(userId).populate(
      'competences experiences'
    );

    if (!user) {
      throw new Error('User not found');
    }

    const competences = await Competence.find({ user: userId });
    const experiences = await Experience.find({ user: userId });

    return {
      competences: competences,
      experiences: experiences,
    };
  } catch (error) {
    throw new Error(
      `Error getting competences and experiences: ${error.message}`
    );
  }
}
//get Competences And Experiences
async function getCompetencesAndExperiences(req, res) {
  const userId = req.params.userId;

  try {
    const data = await userService.getCompetencesAndExperiencesByUserId(userId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export {
  deleteCompetence,
  updateCompetence,
  getCompetenceById,
  getAllCompetences,
  createCompetence,
  getCompetencesAndExperiencesByUserId,
  getCompetencesAndExperiences,
};
export default router;
