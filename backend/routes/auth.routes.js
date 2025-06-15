import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();
const router = express.Router();

// Créer un token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Inscription
router.post('/register', async (req, res) => {
    try {
      const { email, password } = req.body;  
  
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: 'Email déjà utilisé' });
  
      const user = new User({ email, password });  
      await user.save();
  
      const token = generateToken(user);
      res.status(201).json({ token, user: { id: user._id, email } });
    } catch (err) {
      console.error(err);  
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const token = generateToken(user);
    res.status(200).json({ token, user: { id: user._id, username: user.username, email } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;