const pool_local = require('../db/db');
const { findTrendyDisease, findMostTrendyDisease } = require('../utils/trendyDiseaseInLastWeek');


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

const getMonthlyCaseStats = async (req, res) => {
    try {
        // Step 1: Get the most trendy disease
        const topDisease = await findMostTrendyDisease();
        if (!topDisease) {
            return res.status(404).json({ message: 'No trendy disease found.' });
        }

        const diseaseName = topDisease.disease_name;

        // Step 2: Query PostgreSQL for patients with the trendy disease in the last 4 weeks
        const query = `
            SELECT 
                EXTRACT(WEEK FROM timestamp) - EXTRACT(WEEK FROM NOW()) + 4 AS week_number, 
                case_status,
                COUNT(*) AS case_count
            FROM tbl_patient
            WHERE case_name = $1 AND timestamp >= NOW() - INTERVAL '4 weeks'
            GROUP BY week_number, case_status
            ORDER BY week_number;
        `;

        const result = await pool_local.query(query, [diseaseName]);

        // Step 3: Initialize the weekly counts
        const weeklyCounts = {
            week1: { admitted: 0, discharged: 0, emergency: 0 },
            week2: { admitted: 0, discharged: 0, emergency: 0 },
            week3: { admitted: 0, discharged: 0, emergency: 0 },
            week4: { admitted: 0, discharged: 0, emergency: 0 }
        };

        // Step 4: Map query results to weeklyCounts
        result.rows.forEach(row => {
            const weekNumber = `week${Math.ceil(row.week_number)}`;
            const caseStatus = row.case_status.toLowerCase(); // Convert case status to lowercase
            const caseCount = parseInt(row.case_count, 10);

            if (weeklyCounts[weekNumber]) {
                if (caseStatus === 'admitted') {
                    weeklyCounts[weekNumber].admitted += caseCount;
                } else if (caseStatus === 'discharged') {
                    weeklyCounts[weekNumber].discharged += caseCount;
                } else if (caseStatus === 'emergency') {
                    weeklyCounts[weekNumber].emergency += caseCount;
                }
            }
        });

        // Step 5: Return the structured response
        const response = {
            disease_name: diseaseName,
            weekly_counts: weeklyCounts
        };

        return res.status(200).json(response);

    } catch (err) {
        console.error('Error getting recent weekly disease case stats:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

module.exports = {
    getMonthlyCase,
    getMonthlyCaseStats,
};
