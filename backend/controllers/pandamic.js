const pool_local = require('../db/db');
const { findMostTrendyDisease } = require('../utils/trendyDiseaseInLastWeek');

const pandamic = async (req, res) => {
    try {
        // Step 1: Fetch the most trendy disease
        const disease = await findMostTrendyDisease();
        const disease_name = disease.disease_name;
        console.log('Most trendy disease:', disease_name);
        
        if (!disease_name) {
            return res.status(404).json({ error: 'No trendy disease found' });
        }

        // Step 2: Query to get the relevant patient data for the most trendy disease
        const query = `
            SELECT pat_sex AS gender, timestamp
            FROM tbl_patient
            WHERE case_name = $1
        `;
        const values = [disease_name];
        
        const result = await pool_local.query(query, values);
        console.log('Query:', query);
        console.log('Values:', values);
        console.log('Query result:', result.rows);
        
        // Step 3: Formatting the data as required
        const data = result.rows.map(row => ({
            gender: row.gender,
            timestamp: row.timestamp
        }));
        
        console.log('Formatted data:', data);

        // Step 4: Sending the formatted response
        res.status(200).json({
            disease_name,
            data
        });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    pandamic,
};
