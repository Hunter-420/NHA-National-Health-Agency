const pool_local = require('../db/db');

const calculateTopDiseaseAndSave = async () => {
    try {
        // Step 1: Get the case counts for each disease in each district, including the timestamp
        const result = await pool_local.query(`
            SELECT hos_district, case_name, timestamp
            FROM tbl_patient
        `);

        const diseaseData = result.rows;

        // Step 2: Process and insert top disease for each district, considering timestamp
        const diseaseMap = {};

        diseaseData.forEach(row => {
            const { hos_district, case_name, timestamp } = row;

            // If we haven't encountered this district yet or found a higher case count
            if (!diseaseMap[hos_district]) {
                diseaseMap[hos_district] = {
                    disease_name: case_name,
                    hos_district,
                    case_count: 1, // Start with 1 since we're counting this case
                    timestamp, // Store the timestamp
                };
            } else {
                // Increment case count and check if timestamp is later
                diseaseMap[hos_district].case_count += 1;
                // Update timestamp to the latest if needed (you can adjust this logic if needed)
                if (new Date(diseaseMap[hos_district].timestamp) < new Date(timestamp)) {
                    diseaseMap[hos_district].timestamp = timestamp;
                }
            }
        });

        // Step 3: Prepare and execute insert query to store the results in tbl_disease
        const insertValues = [];
        const placeholders = [];

        Object.values(diseaseMap).forEach((entry, index) => {
            insertValues.push(entry.disease_name, entry.hos_district, entry.case_count, entry.timestamp);
            const offset = index * 4; // 4 fields per row (disease_name, hos_district, value, timestamp)
            placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`);
        });

        if (insertValues.length > 0) {
            const insertQuery = `
                INSERT INTO tbl_disease (disease_name, hos_district, value, timestamp)
                VALUES ${placeholders.join(', ')}
            `;

            await pool_local.query(insertQuery, insertValues);
            console.log('Top diseases for each district have been calculated and inserted into tbl_disease.');
        } else {
            console.log('No disease data found to insert.');
        }

    } catch (err) {
        console.error('Error calculating top diseases:', err);
    }
};

const findTrendyDisease = async () => {
    try {
        // Aggregate the total cases for each disease across all districts and get the top 3
        const result = await pool_local.query(`
            SELECT disease_name, SUM(value) AS total_cases
            FROM tbl_disease
            GROUP BY disease_name
            ORDER BY total_cases DESC
            LIMIT 3
        `);

        // Extract the top 3 diseases
        if (result.rows.length > 0) {
            const topDiseases = result.rows.map(row => ({
                disease_name: row.disease_name,
                total_cases: row.total_cases
            }));

            return topDiseases;
        } else {
            console.log('No disease data found in tbl_disease.');
            return [];
        }

    } catch (err) {
        console.error('Error finding top diseases:', err);
        throw err;
    }
};

const getWeeklyCaseCount = async () => {
    try {
        // Get the top 3 trendy diseases
        const topDiseases = await findTrendyDisease();

        if (topDiseases.length === 0) {
            console.log('No trendy diseases found to fetch weekly case count.');
            return [];
        }

        // Get current timestamp and timestamp of 7 days ago
        const currentDate = new Date();
        const lastWeekDate = new Date();
        lastWeekDate.setDate(currentDate.getDate() - 7);

        // Convert dates to ISO strings for the query
        const currentDateString = currentDate.toISOString();
        const lastWeekDateString = lastWeekDate.toISOString();

        // Fetch weekly case count for each trendy disease
        const weeklyCounts = await Promise.all(topDiseases.map(async (disease) => {

            const weeklyCountResult = await pool_local.query(`
                SELECT TO_CHAR(timestamp, 'Day') AS day_of_week, COUNT(*) AS cases
                FROM tbl_patient
                WHERE case_name = $1
                AND timestamp BETWEEN $2 AND $3
                GROUP BY day_of_week
                ORDER BY day_of_week
            `, [disease.disease_name, lastWeekDateString, currentDateString]);

            const weeklyCounts = {};
            weeklyCountResult.rows.forEach(row => {
                weeklyCounts[row.day_of_week.trim()] = parseInt(row.cases, 10);
            });

            return {
                disease_name: disease.disease_name,
                weekly_counts: weeklyCounts
            };
        }));

        return weeklyCounts;

    } catch (err) {
        console.error('Error fetching weekly case counts:', err);
        throw err;
    }
};

const findMostTrendyDisease = async (req, res) => {
    try {
        // First, call the findTrendyDisease function to get the top 3 diseases
        const topDiseases = await findTrendyDisease();

        if (topDiseases.length > 0) {
            // Find the disease with the highest total cases from the top 3
            const topDisease = topDiseases.reduce((max, disease) => {
                return disease.total_cases > max.total_cases ? disease : max;
            });
            return topDisease;
        } else {
            console.log('No top diseases available.');
            return null;
        }

    } catch (err) {
        console.error('Error finding top disease among the top 3:', err);
        throw err;
    }
}

module.exports = {
    calculateTopDiseaseAndSave,
    findTrendyDisease,
    getWeeklyCaseCount,
    findMostTrendyDisease,
}