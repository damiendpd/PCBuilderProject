import express from 'express';
import SavedConfiguration from '../models/SavedConfiguration.js';
import Component from '../models/Component.js';
import { verifyToken } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

// Créer une configuration sauvegardée
router.post('/', verifyToken, async (req, res) => {
  const { name, components } = req.body;

  if (!name || !Array.isArray(components) || components.length === 0) {
    return res.status(400).json({ message: 'Nom et composants requis' });
  }

  try {
    const config = new SavedConfiguration({
      user: req.user.id,
      name,
      components
    });

    await config.save();
    res.status(201).json(config);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la sauvegarde', error: err.message });
  }
});

// Lister toutes les configurations d’un utilisateur
router.get('/', verifyToken, async (req, res) => {
  try {
    const configs = await SavedConfiguration.find({ user: req.user.id }).populate('components');
    res.status(200).json(configs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: err.message });
  }
});

// Obtenir une configuration spécifique avec le coût total
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const config = await SavedConfiguration.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate({
      path: 'components',
      populate: {
        path: 'offers.partner'
      }
    });

    if (!config) return res.status(404).json({ message: 'Configuration non trouvée' });

    let totalCost = 0;
    const componentsWithPrice = config.components.map(comp => {
      if (!comp.offers || comp.offers.length === 0) {
        return {
          id: comp._id,
          name: comp.name,
          bestPrice: null,
          partner: null,
          url: null
        };
      }

      const bestOffer = comp.offers.reduce((min, current) => {
        return current.price < min.price ? current : min;
      });

      totalCost += bestOffer.price;

      return {
        id: comp._id,
        name: comp.name,
        bestPrice: bestOffer.price,
        partner: bestOffer.partner?.name || 'Inconnu',
        url: bestOffer.url || null
      };
    });

    res.status(200).json({
      config: {
        id: config._id,
        name: config.name,
        createdAt: config.createdAt
      },
      components: componentsWithPrice,
      totalCost
    });

  } catch (err) {
    res.status(500).json({ message: 'Erreur', error: err.message });
  }
});


// Supprimer une configuration
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await SavedConfiguration.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!deleted) return res.status(404).json({ message: 'Configuration non trouvée' });

    res.status(200).json({ message: 'Configuration supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: err.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updatedConfig = await SavedConfiguration.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true }
    );

    if (!updatedConfig) return res.status(404).json({ message: 'Configuration non trouvée' });

    res.status(200).json(updatedConfig);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route admin pour voir les configs d'un utilisateur spécifique
router.get('/admin/:userId', verifyToken, isAdmin, async (req, res) => {
  try {
    const configs = await SavedConfiguration.find({ user: req.params.userId }).populate('components');
    res.status(200).json(configs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: err.message });
  }
});

export default router;
