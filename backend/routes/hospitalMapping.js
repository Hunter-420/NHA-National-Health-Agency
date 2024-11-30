const router = require('express').Router()
const { hospitalMapping } = require('../controllers/hospitalMapping')

router.post('/get-hospital-mapping', hospitalMapping)


module.exports = router