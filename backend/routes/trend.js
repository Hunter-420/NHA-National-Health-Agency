const router = require('express').Router()
const { getWeeklyCase, getWeeklyDiseaseCaseStats } = require('../controllers/trendyDiseaseInLastWeek')

router
    .get('/get-weekly-case', getWeeklyCase)
    .get('/get-weekly-top-disease-stats', getWeeklyDiseaseCaseStats)

module.exports = router