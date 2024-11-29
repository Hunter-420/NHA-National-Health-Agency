const router = require('express').Router()
const { getWeeklyCase } = require('../controllers/trendyDiseaseInLastWeek')

router.get('/get-weekly-case', getWeeklyCase)

module.exports = router