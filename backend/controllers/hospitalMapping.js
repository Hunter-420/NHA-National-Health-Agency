const pool_local = require('../db/db');
const { getHospitalLocation, hospitals } = require('../utils/hospitalMapping');
const { findMostTrendyDisease } = require('../utils/trendyDiseaseInLastWeek');
const { findProvinceByDistrict } = require('../utils/findProvinceByDistrict');
const { getStartOfWeek } = require('../utils/dateUtils');

const hospitalMapping = async (req, res) => {
    try {
        const { province, case_name } = req.body;

        if (!province || !case_name) {
            return res.status(400).json({ error: "Province and case_name are required" });
        }

        if (!province || !case_name) {
            return res.status(400).json({ error: "Province and case_name are required" });
        }

        // Fetch the list of hospitals in the specified province
        const hospitalsInProvince = hospitals.filter(hospital => hospital.province && hospital.province.toLowerCase() === province.toLowerCase());

        // Query to fetch the number of patients for the given case_name and province
        const patientQuery = `
            SELECT hos_name, COUNT(*) AS patients
            FROM tbl_patient
            WHERE hos_province = $1 AND case_name = $2
            GROUP BY hos_name;
        `;
        const patientResult = await pool_local.query(patientQuery, [province, case_name]);

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
        res.status(200).json({ [province]: hospitalsWithPatients });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const mapingForTopDisease = async (req, res) => {
    // Get the start and end of the current week
    const now = new Date();
    const startOfWeek = getStartOfWeek(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    
    try {
        const trendyDisease = await findMostTrendyDisease();

        const disease = trendyDisease.disease_name;

        const result = await pool_local.query(
        `SELECT hos_province, COUNT(*) as count
        FROM tbl_patient
        WHERE case_name = $1 AND timestamp >= $2 AND timestamp < $3
        GROUP BY hos_province`,
        [disease, startOfWeek, endOfWeek]
        );

        const weeklyCounts = result.rows.reduce((acc, row) => {
            // Skip NULL and store the counts
            if (row.hos_province !== 'NULL') {
                acc[row.hos_province] = parseInt(row.count, 10);
            }
            return acc;
        }, {});

        // Find the province with the highest count
        const province = Object.entries(weeklyCounts).reduce((maxProvince, [province, count]) => {
            if (count > maxProvince.count) {
                return { province, count };
            }
            return maxProvince;
        }, { province: null, count: -Infinity }).province;

        const response = {
            disease_name: disease,
            weekly_counts: weeklyCounts,
            province: province // Add the province with the highest count
        };

        res.status(200).json(response);
    
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Helper function to map DOW integer to day of the week name
const getDayOfWeekName = (dow) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[dow];
};
module.exports = {
    hospitalMapping,
    mapingForTopDisease,
}
