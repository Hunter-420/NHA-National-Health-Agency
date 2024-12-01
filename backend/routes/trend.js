const router = require('express').Router()
const { getWeeklyCase, getWeeklyDiseaseCaseStats, getDiseaseDetailProvience } = require('../controllers/trendyDiseaseInLastWeek')
const { getMonthlyCase, getMonthlyCaseStats } = require('../controllers/trendyDiseaseInLastMonth')

router
    .get('/get-weekly-case', getWeeklyCase)
    .get('/get-weekly-top-disease-stats', getWeeklyDiseaseCaseStats)
    .get('/get-disease-detail-province/:disease', getDiseaseDetailProvience)

    .get('/get-monthly-case', getMonthlyCase)
    .get('/get-monthly-top-disease-stats', getMonthlyCaseStats)

module.exports = router