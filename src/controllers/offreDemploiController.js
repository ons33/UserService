const OffreDemploi = require('../models/OffreDemploi.js');

// Create a new OffreDemploi
exports.createOffre = async (req, res) => {
    try {
        const offre = await OffreDemploi.create(req.body);
        res.status(201).json({ success: true, data: offre });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get all OffresDemploi
exports.getAllOffres = async (req, res) => {
    try {
        const offres = await OffreDemploi.find();
        res.status(200).json({ success: true, data: offres });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get a single OffreDemploi by ID
exports.getOffreById = async (req, res) => {
    try {
        const offre = await OffreDemploi.findById(req.params.id);
        if (!offre) {
            return res.status(404).json({ success: false, message: 'Offre not found' });
        }
        res.status(200).json({ success: true, data: offre });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update an OffreDemploi by ID
exports.updateOffre = async (req, res) => {
    try {
        const offre = await OffreDemploi.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!offre) {
            return res.status(404).json({ success: false, message: 'Offre not found' });
        }
        res.status(200).json({ success: true, data: offre });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Delete an OffreDemploi by ID
exports.deleteOffre = async (req, res) => {
    try {
        const offre = await OffreDemploi.findByIdAndDelete(req.params.id);
        if (!offre) {
            return res.status(404).json({ success: false, message: 'Offre not found' });
        }
        res.status(204).json({ success: true, data: null });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
