const pool_local = require('../db/db');

const calculateTopDiseaseAndSave = async () => {
    try {
        // Step 1: Get the case counts for each disease in each district
        const result = await pool_local.query(`
            SELECT hos_district, case_name, COUNT(*) AS case_count
            FROM tbl_patient
            GROUP BY hos_district, case_name
            ORDER BY hos_district, case_count DESC
        `);

        const diseaseData = result.rows;

        // Step 2: Process and insert top disease for each district
        const diseaseMap = {};

        diseaseData.forEach(row => {
            const { hos_district, case_name, case_count } = row;

            // If we haven't encountered this district yet or found a higher case count
            if (!diseaseMap[hos_district] || diseaseMap[hos_district].case_count < case_count) {
                diseaseMap[hos_district] = {
                    disease_name: case_name,
                    hos_district,
                    case_count,
                };
            }
        });

        // Step 3: Prepare and execute insert query to store the results in tbl_disease
        const insertValues = [];
        const placeholders = [];

        Object.values(diseaseMap).forEach((entry, index) => {
            insertValues.push(entry.disease_name, entry.hos_district, entry.case_count);
            const offset = index * 3; // 3 fields per row
            placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3})`);
        });

        if (insertValues.length > 0) {
            const insertQuery = `
                INSERT INTO tbl_disease (disease_name, hos_district, value)
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
            console.log('Top diseases found:', topDiseases);
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

        console.log('Top Diseases:', topDiseases);

        // Get current timestamp and timestamp of 7 days ago
        const currentDate = new Date();
        const lastWeekDate = new Date();
        lastWeekDate.setDate(currentDate.getDate() - 7);

        console.log('Date Range:', lastWeekDate, currentDate);

        // Convert dates to ISO strings for the query
        const currentDateString = currentDate.toISOString();
        const lastWeekDateString = lastWeekDate.toISOString();

        // Fetch weekly case count for each trendy disease
        const weeklyCounts = await Promise.all(topDiseases.map(async (disease) => {
            console.log('Querying for Disease:', disease.disease_name);

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

        console.log('Weekly case counts fetched:', weeklyCounts);
        return weeklyCounts;

    } catch (err) {
        console.error('Error fetching weekly case counts:', err);
        throw err;
    }
};

module.exports = {
    calculateTopDiseaseAndSave,
    findTrendyDisease,
    getWeeklyCaseCount,
}