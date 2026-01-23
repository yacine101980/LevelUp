const router = require('express').Router()
const auth = require('../middleware/auth.middleware')

const xpController = require('../controllers/xp.controller')

router.post('/', auth, xpController.getMyXp)

module.exports = router
