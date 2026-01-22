const express = require('express');
const badgeController = require('../controllers/badges.controller');
const router = express.Router();

// Route pour récupérer tous les badges disponibles
router.get('/', badgeController.getAllBadges);

// Route pour récupérer les badges d'un utilisateur
router.get('/users/me', badgeController.getUserBadges);

// Route pour récupérer les points XP et le niveau d'un utilisateur
router.get('/users/me/xp', badgeController.getUserXp);

module.exports = router;