const router = require('express').Router()

const hiRouter = require('./hospitalIntegration')
const trendRouter = require('./trend')
const hmRouter = require('./hospitalMapping')

/* MIDDLEWARES */

/* SPECIFIC ROUTES */

/* ROUTES */
router.use('/hi', hiRouter)
router.use('/trend', trendRouter)
router.use('/hm', hmRouter)


module.exports = router