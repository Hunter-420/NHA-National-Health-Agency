const pool_hib = require('../db/db_hib');
const pool_local = require('../db/db');
const queries = require('../queries/hospitalIntegration');
const extractDistrict = require('../utils/extractDistrict');
const { findProvinceByDistrict } = require('../utils/findProvinceByDistrict');
const { calculateTopDiseaseAndSave } = require('../utils/trendyDiseaseInLastWeek');

const getHibData = async (req, res) => {
    try {
        // Query the HIB database
        const result = await pool_hib.query(queries.getAllData);
        const data = result.rows;

        const batchSize = 1000;

        for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);

            const values = [];
            const placeholders = batch.map((row, index) => {
                const {
                    doc_name, doc_code, doc_depart, hospital_code, pat_sex, pat_address, pat_age,
                    case_name, case_type, case_status, case_code, case_depart, hos_name,
                    hos_address, timestamp, hos_district, hos_province
                } = row;

                const updatedDistrict = extractDistrict(hos_address);
                const updatedProvince = findProvinceByDistrict(updatedDistrict);

                // Add the values for this row to the values array
                values.push(
                    doc_name, doc_code, doc_depart, hospital_code, pat_sex, pat_address, pat_age,
                    case_name, case_type, case_status, case_code, case_depart, hos_name,
                    hos_address, timestamp, updatedDistrict, updatedProvince
                );

                // Return the placeholders for this row
                const offset = index * 17; // There are 17 fields to insert per row
                return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10}, $${offset + 11}, $${offset + 12}, $${offset + 13}, $${offset + 14}, $${offset + 15}, $${offset + 16}, $${offset + 17})`;
            }).join(',');

            // Construct the final INSERT query with the correct number of placeholders
            const insertQuery = `
                INSERT INTO tbl_patient (
                    doc_name, doc_code, doc_depart, hospital_code, pat_sex, pat_address, pat_age,
                    case_name, case_type, case_status, case_code, case_depart, hos_name,
                    hos_address, timestamp, hos_district, hos_province
                ) VALUES ${placeholders}
            `;

            // Execute the query with the accumulated values
            await pool_local.query(insertQuery, values);
        }
        calculateTopDiseaseAndSave()

        res.status(200).json('Data successfully inserted into local database');
    } catch (err) {
        console.error('Error inserting data into local database:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getHibData,
};
