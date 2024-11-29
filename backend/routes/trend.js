const router = require('express').Router()
const { getWeeklyCase, getWeeklyDiseaseCaseStats, getDiseaseDetailProvience } = require('../controllers/trendyDiseaseInLastWeek')

router
    .get('/get-weekly-case', getWeeklyCase)
    .get('/get-weekly-top-disease-stats', getWeeklyDiseaseCaseStats)
    .get('/get-disease-detail-province/:disease', getDiseaseDetailProvience)

module.exports = router