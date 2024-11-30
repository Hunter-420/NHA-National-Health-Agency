const router = require('express').Router()
const { hospitalMapping, mapingForTopDisease } = require('../controllers/hospitalMapping')

router.post('/get-hospital-mapping', hospitalMapping)
router.get('/get-top-disease-mapping', mapingForTopDisease)

module.exports = router