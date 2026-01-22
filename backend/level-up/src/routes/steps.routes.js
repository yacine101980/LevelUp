const router = require('express').Router()

const strl = require('../controllers/steps.controller')
const auth = require('../middleware/auth.middleware')

router.use(auth)

router.post('/:id', strl.create)
router.put('/:id', strl.update)
router.patch('/:id/complete', strl.complete)
router.delete('/:id', strl.remove)


module.exports = router