import express from 'express';
const router = express.Router();

// Exemple de route test
router.get('/', (req, res) => {
  res.json({ message: 'Liste des composants à venir...' });
});

export default router;