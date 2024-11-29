const router = require('express').Router()

const { getHibData } = require('../controllers/hospitalIntegration')

router.get('/get-hib-data', getHibData)

module.exports = router