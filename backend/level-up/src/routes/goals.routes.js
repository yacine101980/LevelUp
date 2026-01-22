const router = require('express').Router()
const ctrl = require('../controllers/goals.controller')
const auth = require('../middleware/auth.middleware')

router.use(auth)

router.post('/', ctrl.create)
router.get('/', ctrl.list)
router.get('/:id', ctrl.getOne)
router.put('/:id', ctrl.update)
router.patch('/:id/complete', ctrl.complete)
router.patch('/:id/abandon', ctrl.abandon)
router.delete('/:id', ctrl.remove)

module.exports = router
