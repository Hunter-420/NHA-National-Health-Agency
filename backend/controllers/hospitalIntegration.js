const pool = require('../db/db_hib');

const queries = require('../queries/hospitalIntegration');

const getHibData = async(req, res) => {
    pool.query(queries.getAllData, (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

module.exports = {
    getHibData,
}