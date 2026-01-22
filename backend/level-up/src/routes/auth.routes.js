const router = require('express').Router()
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', authMiddleware, authController.logout)
router.get('/me', authMiddleware, authController.me)
router.put('/me', authMiddleware, authController.updateProfile)

module.exports = router
