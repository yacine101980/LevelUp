const router = require('express').Router()

const htrl = require('../controllers/habits.controller')
const auth = require('../middleware/auth.middleware')

router.use(auth)

router.post('/', htrl.create)
router.get('/', htrl.list)
router.put('/:id', htrl.update)
router.delete('/:id', htrl.archive)


module.exports = router