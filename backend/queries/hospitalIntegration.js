const getAllData = 'SELECT * FROM tbl_Patient ORDER BY id ASC'

const getHospitalData = 'SELECT * FROM tblPatient WHERE hospital = $1 ORDER BY id ASC'

// const insertPatientDataIntoLocalServer = `
//     INSERT INTO tbl_patient (
//         doc_name, doc_code, doc_depart, hospital_code, pat_sex, pat_address, pat_age, 
//         case_name, case_type, case_status, case_code, case_depart, hos_name, 
//         hos_address, timestamp, district
//     ) 
//     VALUES 
//     %L
// `;


module.exports = {
    getAllData,
    getHospitalData,
    // insertPatientDataIntoLocalServer
}