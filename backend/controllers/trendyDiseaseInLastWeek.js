const { findTrendyDisease, getWeeklyCaseCount } = require('../utils/trendyDiseaseInLastWeek');

const getWeeklyCase = async (req, res) => {
    try {
        res.status(200).json(await getWeeklyCaseCount());
    } catch (err) {
        res.status(500).json({ error: err.message }); 
    }
}

module.exports = { 
    getWeeklyCase
};