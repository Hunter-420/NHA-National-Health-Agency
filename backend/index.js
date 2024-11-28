require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./routes')

/* EXPRESS SERVER  */
const server = express()

/* BODY PARSERS */
server.use(express.json())

/* MIDDLEWARES */
server.use(cors())

/* ROUTES */
// server.use('/api', (req, res) => {
//   res.send('Server API is responding - Happy Hacking!')
// })

server.use('/api', router)

/* SERVER LISTEN */
server.listen(process.env.PORT, () => {
  console.log(`Server Started on port: ${ process.env.PORT }`)
})