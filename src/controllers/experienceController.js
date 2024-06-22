// controllers/experienceController.js

import Experience from '../models/Experience.js';

export const createExperience = async (req, res) => {
    try {
        console.log('hhhh',req.body)
      const { userId, ...experienceData } = req.body; // Extract userId from req.body
      const experience = new Experience({ ...experienceData, user: userId }); // Include user's ID in the experience document
      await experience.save();
      res.status(201).json(experience);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

export const getAllExperiences = async (req, res) => {
    try {
        const experiences = await Experience.find();
        res.status(200).json(experiences);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getExperienceById = async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id);
        res.status(200).json(experience);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateExperience = async (req, res) => {
    try {
        const updatedExperience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedExperience);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteExperience = async (req, res) => {
    try {
        await Experience.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
