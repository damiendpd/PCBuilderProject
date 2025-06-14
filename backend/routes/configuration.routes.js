import express from 'express';
const router = express.Router();
router.post('/total-cost', async (req, res) => {
    const { componentIds } = req.body;
  
    if (!Array.isArray(componentIds) || componentIds.length === 0) {
      return res.status(400).json({ message: "Liste de composants invalide ou vide." });
    }
  
    try {
      const components = await Component.find({
        _id: { $in: componentIds },
      }).populate('offers.partner');
  
      let totalCost = 0;
      const details = [];
  
      for (const component of components) {
        if (!component.offers || component.offers.length === 0) {
          details.push({
            component: component._id,
            name: component.name,
            price: null,
            message: "Aucune offre disponible",
          });
          continue;
        }
  
        // Trouver l'offre la moins chère
        const bestOffer = component.offers.reduce((min, current) => {
          return current.price < min.price ? current : min;
        });
  
        totalCost += bestOffer.price;
  
        details.push({
          component: component._id,
          name: component.name,
          price: bestOffer.price,
          partner: bestOffer.partner.name,
          url: bestOffer.url,
        });
      }
  
      res.status(200).json({ totalCost, details });
    } catch (err) {
      res.status(500).json({ message: "Erreur lors du calcul", error: err.message });
    }
  });
export default router;