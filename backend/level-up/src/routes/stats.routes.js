const router = require('express').Router()
const authMiddleware = require('../middleware/auth.middleware')
const statsController = require('../controllers/stats.controller')
const dashboardController = require('../controllers/dashboard.controller')

router.get('/', authMiddleware, statsController.getStats)
router.get('/goals', authMiddleware, statsController.getGoalStats)
router.get('/habits', authMiddleware, statsController.getHabitStats)

module.exports = router