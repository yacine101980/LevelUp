const router = require('express').Router()
const auth = require('../middleware/auth.middleware')
const habitLogCtrl = require('../controllers/habitLog.controller')

router.post('/:id/log', auth, habitLogCtrl.logToday)
router.get('/:id/logs', auth, habitLogCtrl.getLogs)
router.delete('/:id/log/:date', auth, habitLogCtrl.deleteLog)

module.exports = router
