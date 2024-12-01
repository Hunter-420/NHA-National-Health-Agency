const Pool = require('pg').Pool

const pool = new Pool({
    user: process.env.NHA_DB_USER,
    host: process.env.NHA_DB_HOST,
    database: process.env.NHA_DB_NAME,
    password: process.env.NHA_DB_PASSWORD,
    port: process.env.NHA_DB_PORT,
})

module.exports = pool