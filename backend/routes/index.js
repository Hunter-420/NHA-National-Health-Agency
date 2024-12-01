const router = require('express').Router()

const hiRouter = require('./hospitalIntegration')
const trendRouter = require('./trend')
const hmRouter = require('./hospitalMapping')
const panRouter = require('./pandamic')

/* MIDDLEWARES */

/* SPECIFIC ROUTES */

/* ROUTES */
router.use('/hi', hiRouter)
router.use('/trend', trendRouter)
router.use('/hm', hmRouter)
router.use('/pan', panRouter)


module.exports = router