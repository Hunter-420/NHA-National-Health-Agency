const pool_local = require('../db/db');
const { getHospitalLocation, hospitals } = require('../utils/hospitalMapping');

const hospitalMapping = async (req, res) => {
    try {
        const { province, case_name } = req.body;

        if (!province || !case_name) {
            return res.status(400).json({ error: "Province and case_name are required" });
        }

        console.log('Province:', province);
        console.log('Case Name:', case_name);

        if (!province || !case_name) {
            return res.status(400).json({ error: "Province and case_name are required" });
        }

        // Log the request parameters
        console.log('Province:', province);
        console.log('Case Name:', case_name);

        // Fetch the list of hospitals in the specified province
        const hospitalsInProvince = hospitals.filter(hospital => hospital.province && hospital.province.toLowerCase() === province.toLowerCase());

        // Log the hospitals in the specified province
        console.log('Hospitals in Province:', hospitalsInProvince);

        // Query to fetch the number of patients for the given case_name and province
        const patientQuery = `
            SELECT hos_name, COUNT(*) AS patients
            FROM tbl_patient
            WHERE hos_province = $1 AND case_name = $2
            GROUP BY hos_name;
        `;
        const patientResult = await pool_local.query(patientQuery, [province, case_name]);

        // Log the query result
        console.log('Patient Query Result:', patientResult.rows);

        // Create a dictionary to store patient counts by hospital
        const patientCounts = patientResult.rows.reduce((acc, row) => {
            if (row.hos_name) {
                acc[row.hos_name.toLowerCase()] = parseInt(row.patients); // Use lowercase to match case-insensitively
            }
            return acc;
        }, {});

        // Map the hospitals with their patient counts and geographical information
        const hospitalsWithPatients = hospitalsInProvince.map(hospital => {
            const location = getHospitalLocation(hospital.name);
            const patientCount = patientCounts[hospital.name.toLowerCase()] || 0; // Default to 0 if no patients found
            return {
                name: location.name,
                patients: patientCount,
                latitude: location.latitude,
                longitude: location.longitude,
            };
        });

        // Return the response as per the desired format
        res.json({ [province]: hospitalsWithPatients });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    hospitalMapping,
}
