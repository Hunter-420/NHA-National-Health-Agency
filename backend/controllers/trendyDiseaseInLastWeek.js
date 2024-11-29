const pool_local = require('../db/db');

const { getStartOfWeek } = require('../utils/dateUtils');

const { findTrendyDisease, getWeeklyCaseCount, findMostTrendyDisease } = require('../utils/trendyDiseaseInLastWeek');
// const { findProvinceByDistrict } = require('../utils/findProvinceByDistrict');


const getDiseaseDetailProvience = async (req, res) => {
    const disease = req.params.disease;

    // Get the start and end of the current week
    const now = new Date();
    const startOfWeek = getStartOfWeek(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    try {
        const result = await pool_local.query(
        `SELECT hos_province, COUNT(*) as count
        FROM tbl_patient
        WHERE case_name = $1 AND timestamp >= $2 AND timestamp < $3
        GROUP BY hos_province`,
        [disease, startOfWeek, endOfWeek]
        );

        const response = {
        disease_name: disease,
        weekly_counts: result.rows.reduce((acc, row) => {
            acc[row.hos_province] = parseInt(row.count, 10);
            return acc;
        }, {}),
        };

        res.json(response);
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getWeeklyCase = async (req, res) => {
    try {
        res.status(200).json(await getWeeklyCaseCount());
    } catch (err) {
        res.status(500).json({ error: err.message }); 
    }
}

const getWeeklyDiseaseCaseStats = async (req, res) => {
    try {
        // Step 1: Get the most trendy disease
        const topDisease = await findMostTrendyDisease();
        if (!topDisease) {
            return res.status(404).json({ message: 'No trendy disease found.' });
        }

        const diseaseName = topDisease.disease_name;

        // Step 2: Query PostgreSQL for patients with the trendy disease
        const query = `
            SELECT 
                EXTRACT(DOW FROM timestamp) AS day_of_week, 
                case_status,
                COUNT(*) AS case_count
            FROM tbl_patient
            WHERE case_name = $1
            GROUP BY day_of_week, case_status
            ORDER BY day_of_week;
        `;
        
        const result = await pool_local.query(query, [diseaseName]);

        // Step 3: Initialize the weekly counts
        const weeklyCounts = {
            sunday: { admitted: 0, discharged: 0, emergency: 0 },
            monday: { admitted: 0, discharged: 0, emergency: 0 },
            tuesday: { admitted: 0, discharged: 0, emergency: 0 },
            wednesday: { admitted: 0, discharged: 0, emergency: 0 },
            thursday: { admitted: 0, discharged: 0, emergency: 0 },
            friday: { admitted: 0, discharged: 0, emergency: 0 },
            saturday: { admitted: 0, discharged: 0, emergency: 0 }
        };

        // Step 4: Map query results to weeklyCounts
        result.rows.forEach(row => {
            const dayOfWeek = getDayOfWeekName(row.day_of_week); // Convert DOW to day name

            const caseStatus = row.case_status.toLowerCase();  // Convert case status to lowercase
            const caseCount = parseInt(row.case_count, 10);

            if (caseStatus === 'admitted') {
                weeklyCounts[dayOfWeek].admitted = caseCount;
            } else if (caseStatus === 'discharged') {
                weeklyCounts[dayOfWeek].discharged = caseCount;
            } else if (caseStatus === 'emergency') {
                weeklyCounts[dayOfWeek].emergency = caseCount;
            }
        });

        // Step 5: Return the structured response
        const response = {
            disease_name: diseaseName,
            weekly_counts: weeklyCounts
        };

        return res.status(200).json(response);

    } catch (err) {
        console.error('Error getting weekly disease case stats:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Helper function to map DOW integer to day of the week name
const getDayOfWeekName = (dow) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[dow];
};

module.exports = { 
    getWeeklyCase,
    getWeeklyDiseaseCaseStats,
    getDiseaseDetailProvience,
};