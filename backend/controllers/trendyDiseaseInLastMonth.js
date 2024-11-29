const pool_local = require('../db/db');
const { findTrendyDisease } = require('../utils/trendyDiseaseInLastWeek');

const getMonthlyCase = async (req, res) => {
    try {
        // Step 1: Get trendy diseases
        const trendyDiseasesData = await findTrendyDisease();

        if (!trendyDiseasesData || trendyDiseasesData.length === 0) {
            return res.status(404).json({ message: 'No trendy diseases found' });
        }

        // Extract just the disease names from the data
        const trendyDiseases = trendyDiseasesData.map(d => d.disease_name);

        // Step 2: Prepare query to fetch counts for the last 4 weeks
        const diseaseCountsQuery = `
            SELECT 
                case_name, 
                COUNT(*) FILTER (WHERE timestamp >= NOW() - INTERVAL '1 week' AND timestamp < NOW()) AS week1,
                COUNT(*) FILTER (WHERE timestamp >= NOW() - INTERVAL '2 weeks' AND timestamp < NOW() - INTERVAL '1 week') AS week2,
                COUNT(*) FILTER (WHERE timestamp >= NOW() - INTERVAL '3 weeks' AND timestamp < NOW() - INTERVAL '2 weeks') AS week3,
                COUNT(*) FILTER (WHERE timestamp >= NOW() - INTERVAL '4 weeks' AND timestamp < NOW() - INTERVAL '3 weeks') AS week4
            FROM 
                tbl_patient
            WHERE 
                case_name = ANY($1)
            GROUP BY 
                case_name;
        `;

        // Step 3: Execute the query
        const { rows } = await pool_local.query(diseaseCountsQuery, [trendyDiseases]);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'No data found for trendy diseases' });
        }

        // Step 4: Format the results
        const response = rows.map(row => ({
            disease_name: row.case_name,
            weekly_counts: {
                week1: row.week1 || 0,
                week2: row.week2 || 0,
                week3: row.week3 || 0,
                week4: row.week4 || 0,
            }
        }));

        // Step 5: Send the response
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getMonthlyCase,
};
