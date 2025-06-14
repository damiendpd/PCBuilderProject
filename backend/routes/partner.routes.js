// routes/partner.routes.js
import express from 'express';
import Partner from '../models/Partner.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET all partners
router.get('/', async (req, res) => {
  try {
    const partners = await Partner.find();
    res.status(200).json(partners);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST new partner (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const newPartner = new Partner(req.body);
    const saved = await newPartner.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Erreur création partenaire' });
  }
});

// PUT update partner
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const updated = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Erreur mise à jour' });
  }
});

// DELETE partner
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await Partner.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Partenaire supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur suppression' });
  }
});

export default router;
