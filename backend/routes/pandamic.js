const router = require('express').Router()
const { pandamic } = require('../controllers/pandamic')

router.get('/', pandamic)

module.exports = router