import express from 'express';
import Component from '../models/Component.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET components
router.get('/', async (req, res) => {
  try {
    const { type, brand, minPrice, maxPrice, name, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (type) filter.type = type;
    if (brand) filter.brand = brand;
    if (name) filter.name = new RegExp(name, 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (page - 1) * limit;

    const total = await Component.countDocuments(filter);
    const components = await Component.find(filter).skip(skip).limit(Number(limit));

    res.status(200).json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      results: components
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST create a new component (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const newComponent = new Component(req.body);
    const saved = await newComponent.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de la création', error: err.message });
  }
});

// PUT update a component (admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const updated = await Component.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Composant non trouvé' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour' });
  }
});

// DELETE a component (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await Component.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Composant non trouvé' });
    res.status(200).json({ message: 'Composant supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});

export default router;