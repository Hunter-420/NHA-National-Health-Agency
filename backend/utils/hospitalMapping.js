const hospitals = [
    { name: 'Shree Harsha Hospital', latitude: 27.6988, longitude: 85.2837, province: 'Bagmati' }, // Kathmandu
    { name: 'Kantipur Hospital', latitude: 27.7100, longitude: 85.2890, province: 'Bagmati' }, // Kathmandu
    { name: 'Grande International Hospital', latitude: 27.6595, longitude: 85.3257, province: 'Bagmati' }, // Kathmandu
    { name: 'Patan Hospital', latitude: 27.6667, longitude: 85.3240, province: 'Bagmati' }, // Kathmandu
    { name: 'Om Hospital', latitude: 27.6794, longitude: 85.3301, province: 'Bagmati' }, // Kathmandu
    { name: 'B&B Hospital', latitude: 27.6694, longitude: 85.3214, province: 'Bagmati' }, // Kathmandu
    { name: 'Hams Hospital', latitude: 27.6695, longitude: 85.3012, province: 'Bagmati' }, // Kathmandu
    { name: 'Star Hospital', latitude: 27.7023, longitude: 85.3359, province: 'Bagmati' }, // Kathmandu
    { name: 'National Hospital', latitude: 27.6762, longitude: 85.3279, province: 'Bagmati' }, // Kathmandu
    { name: 'Tribhuvan University Teaching Hospital', latitude: 27.6861, longitude: 85.3456, province: 'Bagmati' }, // Kathmandu
    { name: 'Siddhartha Hospital', latitude: 27.6512, longitude: 85.2799, province: 'Bagmati' }, // Kathmandu
    { name: 'Maternity Hospital', latitude: 27.6994, longitude: 85.2946, province: 'Bagmati' }, // Kathmandu
    { name: 'Kanti Children’s Hospital', latitude: 27.6780, longitude: 85.3015, province: 'Bagmati' }, // Kathmandu
    { name: 'Nepal Cancer Hospital', latitude: 27.5754, longitude: 85.3614, province: 'Bagmati' }, // Lalitpur
    { name: 'Sanjivani Hospital', latitude: 27.7182, longitude: 85.3044, province: 'Bagmati' }, // Kathmandu
    { name: 'Care Hospital', latitude: 27.6976, longitude: 85.3178, province: 'Bagmati' }, // Kathmandu
    { name: 'Apex Hospital', latitude: 27.6698, longitude: 85.3256, province: 'Bagmati' }, // Kathmandu
    { name: 'Bhaktapur Cancer Hospital', latitude: 27.6698, longitude: 85.4440, province: 'Bagmati' }, // Bhaktapur
    { name: 'Kathmandu Medical College Teaching Hospital', latitude: 27.6747, longitude: 85.2819, province: 'Bagmati' }, // Kathmandu
    { name: 'Medical College Teaching Hospital', latitude: 27.7112, longitude: 85.2864, province: 'Bagmati' }, // Kathmandu
    { name: 'Nepal Medical College', latitude: 27.6507, longitude: 85.2780, province: 'Bagmati' }, // Kathmandu
    { name: 'Manmohan Memorial Medical College', latitude: 27.6987, longitude: 85.2801, province: 'Bagmati' }, // Kathmandu
    { name: 'Chhetrapati Hospital', latitude: 27.7119, longitude: 85.2917, province: 'Bagmati' }, // Kathmandu
    { name: 'Narayani Hospital', latitude: 27.6378, longitude: 84.9297, province: 'Madesh' }, // Birgunj
    { name: 'Zikri Hospital', latitude: 27.6795, longitude: 85.3204, province: 'Bagmati' }, // Kathmandu
    { name: 'Medical Care Centre', latitude: 27.7000, longitude: 85.3400, province: 'Bagmati' }, // Kathmandu
    { name: 'St. Xavier Hospital', latitude: 27.6980, longitude: 85.2910, province: 'Bagmati' }, // Kathmandu
    { name: 'Sashwat Hospital', latitude: 27.6930, longitude: 85.3289, province: 'Bagmati' }, // Kathmandu
    { name: 'Hetauda Teaching Hospital', latitude: 27.4099, longitude: 85.1123, province: 'Bagmati' }, // Hetauda
    { name: 'Bir Hospital', latitude: 27.7153, longitude: 85.3047, province: 'Bagmati' }, // Kathmandu
    { name: 'Biratnagar Hospital', latitude: 26.4606, longitude: 87.2716, province: 'Koshi' }, // Biratnagar
    { name: 'Grande Hospital', latitude: 27.6595, longitude: 85.3257, province: 'Bagmati' }, // Kathmandu
];

const getHospitalLocation = (hospitalName) => {
  if (!hospitalName) return { message: "Hospital name is required." };
  const hospital = hospitals.find(h => h.name && h.name.toLowerCase() === hospitalName.toLowerCase());
  
  if (hospital) {
      return {
          name: hospital.name,
          latitude: hospital.latitude,
          longitude: hospital.longitude,
      };
  } else {
      return { message: "Hospital not found." };
  }
}

module.exports = { getHospitalLocation, hospitals };