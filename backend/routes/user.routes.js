import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route accessible uniquement aux admins
router.get('/admin-only', verifyToken, isAdmin, async (req, res) => {
    res.status(200).json({ message: 'Accès réservé aux administrateurs' });
  });
export default router;
