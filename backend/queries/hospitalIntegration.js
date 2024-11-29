const getAllData = 'SELECT * FROM tblPatient ORDER BY id ASC'

const getHospitalData = 'SELECT * FROM tblPatient WHERE hospital = $1 ORDER BY id ASC'

module.exports = {
    getAllData,
    getHospitalData
}