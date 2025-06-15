import express from 'express';
import Component from '../models/Component.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET all components 
router.get('/', async (req, res) => {
  try {
    const components = await Component.find().populate('offers.partner');
    res.status(200).json(components);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET un seul component
router.get('/:id', async (req, res) => {
  try {
    const component = await Component.findById(req.params.id).populate('offers.partner');
    if (!component) return res.status(404).json({ message: 'Composant non trouvé' });
    res.status(200).json(component);
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

// Ajouter une offre à un composant
router.patch('/:id/offers', verifyToken, isAdmin, async (req, res) => {
  const { partnerId, price, url } = req.body;

  try {
    const component = await Component.findById(req.params.id);
    if (!component) return res.status(404).json({ message: 'Composant non trouvé' });

    component.offers.push({ partner: partnerId, price, url });
    await component.save();

    res.status(200).json({ message: 'Offre ajoutée', offers: component.offers });
  } catch (err) {
    res.status(400).json({ message: 'Erreur ajout offre', error: err.message });
  }
});


// PUT - Mettre à jour une offre d’un composant
router.put('/:componentId/offers/:offerId', verifyToken, isAdmin, async (req, res) => {
  try {
    const { price, url } = req.body;

    const component = await Component.findById(req.params.componentId);
    if (!component) return res.status(404).json({ message: 'Composant non trouvé' });

    const offer = component.offers.id(req.params.offerId);
    if (!offer) return res.status(404).json({ message: 'Offre non trouvée' });

    if (price !== undefined) offer.price = price;
    if (url !== undefined) offer.url = url;

    await component.save();
    res.status(200).json(component);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l’offre', error: err.message });
  }
});

// DELETE - Supprimer une offre d’un composant
router.delete('/:componentId/offers/:offerId', verifyToken, isAdmin, async (req, res) => {
  try {
    const component = await Component.findById(req.params.componentId);
    if (!component) return res.status(404).json({ message: 'Composant non trouvé' });

    const offer = component.offers.id(req.params.offerId);
    if (!offer) return res.status(404).json({ message: 'Offre non trouvée' });

    offer.remove(); 
    await component.save();

    res.status(200).json({ message: 'Offre supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l’offre', error: err.message });
  }
});


export default router;