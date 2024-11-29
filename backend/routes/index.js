const router = require('express').Router()

const hiRouter = require('./hospitalIntegration')

/* MIDDLEWARES */

/* SPECIFIC ROUTES */

/* ROUTES */
router.use('/hi', hiRouter)


module.exports = router