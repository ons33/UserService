import { Router } from 'express';
import Competence from '../models/Competence.js'; // Remove the curly braces
import Experience from '../models/Experience.js'; // Remove the curly braces
import User from '../models/User.js'; // Remove the curly braces

const router = Router();


 const createCompetence = async (req, res) => {
  try {
      const { userId, ...competenceData } = req.body; // Extract userId from req.body
      const competence = new Competence({ ...competenceData, user: userId }); // Include user's ID in the competence document
      await competence.save();
      res.status(201).json(competence);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const getAllCompetences = async (req, res) => {
    try {
        const competences = await Competence.find();
        res.status(200).json(competences);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCompetenceById = async (req, res) => {
    try {
        const competence = await Competence.findById(req.params.id);
        res.status(200).json(competence);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCompetence = async (req, res) => {
    try {
        const updatedCompetence = await Competence.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedCompetence);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteCompetence = async (req, res) => {
    try {
        await Competence.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



async function getCompetencesAndExperiencesByUserId(userId) {
    try {
      const user = await User.findById(userId).populate('competences experiences');
      
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
      throw new Error(`Error getting competences and experiences: ${error.message}`);
    }
  };
  async function getCompetencesAndExperiences(req, res) {
    const userId = req.params.userId;
  
    try {
      const data = await userService.getCompetencesAndExperiencesByUserId(userId);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

export { deleteCompetence, updateCompetence, getCompetenceById, getAllCompetences, createCompetence,getCompetencesAndExperiencesByUserId ,getCompetencesAndExperiences};
export default router;
