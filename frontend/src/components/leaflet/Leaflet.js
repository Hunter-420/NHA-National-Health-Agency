import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Default Leaflet marker icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const ProvinceMap = () => {
  const { province } = useParams(); // Get province from the URL
  const [hospitalData, setHospitalData] = useState([]); // State to hold the hospital data for the selected province
  const [center, setCenter] = useState([27.7172, 85.3240]); // Default center (Kathmandu) for map
  const [loading, setLoading] = useState(true); // Loading state to handle map rendering

  // Mock data for hospitals in different provinces
  const mockData = {
  "province1": [
    { "name": "B & C Medical College Teaching Hospital", "patients": 200, "latitude": 26.6739, "longitude": 87.2718 },
    { "name": "B.P. Koirala Institute of Health Sciences", "patients": 300, "latitude": 26.7282, "longitude": 87.2749 },
    { "name": "Golden Hospital Pvt.Ltd", "patients": 180, "latitude": 26.6839, "longitude": 87.2832 },
    { "name": "Nobel Medical College Teaching Hospital Pvt.Ltd", "patients": 250, "latitude": 26.7383, "longitude": 87.2978 },
    { "name": "Neuro Cardio Multispeciality Hospital", "patients": 220, "latitude": 26.7001, "longitude": 87.2400 },
    { "name": "Illam Hospital", "patients": 150, "latitude": 26.8801, "longitude": 87.9174 },
    { "name": "Koshi Hospital", "patients": 280, "latitude": 26.6505, "longitude": 87.5130 },
    { "name": "Life Line Hospital", "patients": 170, "latitude": 26.7460, "longitude": 87.2117 },
    { "name": "Purna Tunga Birta City Hospital and Research Center", "patients": 190, "latitude": 26.7199, "longitude": 87.2556 },
    { "name": "Manamohan Memorial Eastern Regional Hospital", "patients": 230, "latitude": 26.7571, "longitude": 87.1760 },
    { "name": "Mechi Hospital", "patients": 160, "latitude": 26.6509, "longitude": 87.4034 },
    { "name": "Morang Cooperative Hospital", "patients": 210, "latitude": 26.4376, "longitude": 87.4445 },
    { "name": "Om Sai Pathibhara Hospital Pvt.Ltd", "patients": 140, "latitude": 26.7352, "longitude": 87.5136 },
    { "name": "Birat Medical College Teaching Hospital", "patients": 200, "latitude": 26.6702, "longitude": 87.3056 },
    { "name": "Purvanchal Cancer Hospital", "patients": 180, "latitude": 26.5939, "longitude": 87.2864 }
  ],
  "province2": [
    { "name": "National Medical College Teaching Hospital", "patients": 300, "latitude": 26.6552, "longitude": 85.9938 },
    { "name": "Janakpur Zonal Hospital", "patients": 150, "latitude": 26.7273, "longitude": 85.9150 },
    { "name": "Gajendra Narayan Singh Sagarmatha Zonal Hospital", "patients": 200, "latitude": 26.7031, "longitude": 85.9323 },
    { "name": "Narayani Sub Regional Hospital", "patients": 180, "latitude": 26.6437, "longitude": 85.1670 },
    { "name": "Janaki Health Care and Research Center", "patients": 120, "latitude": 26.7431, "longitude": 85.8782 },
    { "name": "Birgunj Health Care Hospital", "patients": 230, "latitude": 27.0007, "longitude": 84.8757 },
    { "name": "District Hospital Siraha", "patients": 140, "latitude": 26.5911, "longitude": 85.5632 },
    { "name": "Provincial Hospital Gaur", "patients": 160, "latitude": 26.8008, "longitude": 85.2139 }
  ],
  "province3": [
    { "name": "Aarogya Swasthya Prathisthan", "patients": 180, "latitude": 27.7124, "longitude": 85.2941 },
    { "name": "Alka Hospital Pvt.Ltd, Lalitpur", "patients": 220, "latitude": 27.6676, "longitude": 85.3574 },
    { "name": "Ashwins Medical College & Hospital", "patients": 250, "latitude": 27.6409, "longitude": 85.5181 },
    { "name": "B & B Hospital", "patients": 280, "latitude": 27.6363, "longitude": 85.3507 },
    { "name": "Bakulahar Ratnanagar Hospital", "patients": 210, "latitude": 27.6611, "longitude": 85.3711 },
    { "name": "B.P. Koirala Memorial Cancer Hospital", "patients": 300, "latitude": 27.6410, "longitude": 85.4171 },
    { "name": "Bhaktapur Cancer Hospital", "patients": 150, "latitude": 27.6689, "longitude": 85.4328 },
    { "name": "Bharatpur Hospital", "patients": 230, "latitude": 27.6740, "longitude": 84.4316 },
    { "name": "Birendra Army Hospital", "patients": 260, "latitude": 27.7073, "longitude": 85.3380 },
    { "name": "Blue Cross Hospital Pvt.Ltd", "patients": 190, "latitude": 27.6822, "longitude": 85.3856 },
    { "name": "Cancer Care Nepal", "patients": 170, "latitude": 27.6162, "longitude": 85.4721 },
    { "name": "Chirayu Dialysis Center", "patients": 130, "latitude": 27.6377, "longitude": 85.4424 },
    { "name": "Chitwan Medical College", "patients": 240, "latitude": 27.6883, "longitude": 84.3489 },
    { "name": "Chure Hill Hospital Pvt.Ltd", "patients": 200, "latitude": 27.6633, "longitude": 85.5327 },
    { "name": "Civil Service Hospital", "patients": 150, "latitude": 27.6709, "longitude": 85.3495 },
    { "name": "College of Medical Sciences", "patients": 210, "latitude": 27.6657, "longitude": 85.3428 },
    { "name": "Dhading Hospital", "patients": 180, "latitude": 27.9454, "longitude": 85.3002 },
    { "name": "Dhulikhel Hospital", "patients": 250, "latitude": 27.6105, "longitude": 85.5473 },
    { "name": "Grande International Hospital", "patients": 220, "latitude": 27.6701, "longitude": 85.3309 },
    { "name": "Greencity Hospital", "patients": 190, "latitude": 27.6835, "longitude": 85.3008 },
    { "name": "Hetauda Hospital", "patients": 180, "latitude": 27.3911, "longitude": 85.0264 },
    { "name": "Himal Hospital PVT.LTD", "patients": 200, "latitude": 27.6360, "longitude": 85.3582 },
    { "name": "Hospital for Advance Medicine & Surgery (HAMS)", "patients": 230, "latitude": 27.6742, "longitude": 85.3695 },
    { "name": "Kanti Children Hospital", "patients": 270, "latitude": 27.7099, "longitude": 85.2952 },
    { "name": "Kathmandu Cancer Center", "patients": 280, "latitude": 27.7112, "longitude": 85.3356 },
    { "name": "Kathmandu Medical College", "patients": 260, "latitude": 27.6961, "longitude": 85.3217 },
    { "name": "Kathmandu Model Hospital", "patients": 230, "latitude": 27.6908, "longitude": 85.3541 },
    { "name": "Kist Medical College and Teaching Hospital", "patients": 200, "latitude": 27.6947, "longitude": 85.3323 },
    { "name": "Manmohan Cardiothoracic Vascular and Transplant Center", "patients": 220, "latitude": 27.7201, "longitude": 85.3116 }
  ],
  "province4": [
    { "name": "Pokhara Academy of Health Sciences, WRH", "patients": 230, "latitude": 28.2096, "longitude": 83.9739 },
    { "name": "Western Regional Hospital", "patients": 250, "latitude": 28.2094, "longitude": 83.9780 },
    { "name": "Lakeview Hospital", "patients": 180, "latitude": 28.2073, "longitude": 83.9745 },
    { "name": "Himalayan Hospital", "patients": 170, "latitude": 28.2106, "longitude": 83.9770 }
  ],
  "province5": [
    { "name": "Lumbini Zonal Hospital", "patients": 200, "latitude": 27.6651, "longitude": 83.4565 },
    { "name": "Butwal Hospital", "patients": 160, "latitude": 27.7124, "longitude": 83.4401 },
    { "name": "Kapilvastu Hospital", "patients": 140, "latitude": 27.6117, "longitude": 83.3135 },
    { "name": "Devdaha Hospital", "patients": 120, "latitude": 27.6635, "longitude": 83.4589 }
  ],
  "province6": [
    { "name": "Tansen Hospital", "patients": 250, "latitude": 28.4237, "longitude": 83.5869 },
    { "name": "Bhairahawa Hospital", "patients": 300, "latitude": 28.1227, "longitude": 83.4355 },
    { "name": "Rupandehi Hospital", "patients": 210, "latitude": 28.3752, "longitude": 83.4659 },
    { "name": "Lumbini Hospital", "patients": 180, "latitude": 28.3395, "longitude": 83.4906 }
  ],
  "province7": [
    { "name": "Seti Zonal Hospital", "patients": 220, "latitude": 28.9914, "longitude": 80.2535 },
    { "name": "Far Western Regional Hospital", "patients": 250, "latitude": 28.8704, "longitude": 80.2350 },
    { "name": "Dhangadi Hospital", "patients": 180, "latitude": 28.6810, "longitude": 80.4355 },
    { "name": "Dadeldhura District Hospital", "patients": 150, "latitude": 29.3036, "longitude": 80.6898 }
  ]
};
 

  // Simulate fetching hospital data based on the province
  useEffect(() => {
    console.log("Selected province:", province);  // Log province

    if (mockData[province]) {
      setHospitalData(mockData[province]);

      // Calculate the center by averaging the latitude and longitude of all hospitals
      const avgLatitude = mockData[province].reduce((sum, hospital) => sum + hospital.latitude, 0) / mockData[province].length;
      const avgLongitude = mockData[province].reduce((sum, hospital) => sum + hospital.longitude, 0) / mockData[province].length;

      // Set the center after calculating the average coordinates
      setCenter([avgLatitude, avgLongitude]);

      // Set loading state to false after data is fetched and center is set
      setLoading(false);
    }
  }, [province]);

  // Function to determine circle color based on the position
  const getCircleColor = (hospital) => {
    const topHospital = hospitalData.reduce((max, hospital) => (hospital.patients > max.patients ? hospital : max), hospitalData[0]);
    if (hospital.patients === topHospital.patients) {
      return 'lightcoral'; // Light red for the top hospital
    }
    return 'lightgreen'; // Light blue for all other hospitals
  };

  // Prevent map rendering until we have center and hospital data
  if (loading) {
    return <div>Loading map...</div>; // Optional loading state
  }

  return (
    <MapContainer center={center} zoom={10} style={{ height: "100vh", width: "90%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {hospitalData.map((hospital) => (
        <React.Fragment key={hospital.name}>
          {/* Circle Marker */}
          <CircleMarker
            center={[hospital.latitude, hospital.longitude]}
            radius={hospital.patients / 10} // Adjust the circle size based on the number of patients
            color={getCircleColor(hospital)} // Use the function to set the color
            fillOpacity={0.6}
          >
            <Popup>
              <strong>{hospital.name}</strong><br />
              Patients: {hospital.patients}<br />
              Location: ({hospital.latitude}, {hospital.longitude})
            </Popup>
          </CircleMarker>
          
          {/* Default Marker */}
          <Marker position={[hospital.latitude, hospital.longitude]}>
            <Popup>
              <strong>{hospital.name}</strong><br />
              Patients: {hospital.patients}<br />
              Location: ({hospital.latitude}, {hospital.longitude})
            </Popup>
          </Marker>
        </React.Fragment>
      ))}
    </MapContainer>
  );
};

export default ProvinceMap;

