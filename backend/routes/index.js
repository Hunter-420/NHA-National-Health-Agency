const router = require('express').Router()

const hiRouter = require('./hospitalIntegration')
const trendRouter = require('./trend')

/* MIDDLEWARES */

/* SPECIFIC ROUTES */

/* ROUTES */
router.use('/hi', hiRouter)
router.use('/trend', trendRouter)

module.exports = router