import Education from '../models/Education.js';

// Créer une nouvelle éducation
const createEducation = async (req, res) => {
    try {
        const education = new Education(req.body);
        await education.save();
        res.status(201).json(education);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer toutes les éducations
const getAllEducations = async (req, res) => {
    try {
        const educations = await Education.find();
        res.status(200).json(educations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer une éducation par son ID
const getEducationById = async (req, res) => {
    try {
        const education = await Education.findById(req.params.id);
        if (!education) {
            res.status(404).json({ message: "Éducation introuvable" });
            return;
        }
        res.status(200).json(education);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour une éducation
const updateEducation = async (req, res) => {
    try {
        const updatedEducation = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedEducation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer une éducation
const deleteEducation = async (req, res) => {
    try {
        await Education.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { createEducation, getAllEducations, getEducationById, updateEducation, deleteEducation };
