import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useParams } from 'react-router-dom'; // Import useParams for dynamic routing

// Add Leaflet CSS import (important to display the map correctly)
import 'leaflet/dist/leaflet.css';

// Function to fetch coordinates from Nominatim API based on the hospital name
const fetchCoordinates = async (hospitalName) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(hospitalName)}&format=json&addressdetails=1`
    );
    const data = await response.json();
    
    if (data.length > 0) {
      console.log(`Coordinates for ${hospitalName}:`, data[0]);
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    } else {
      console.warn(`No coordinates found for ${hospitalName}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};

// Function to generate color based on number of patients
const getCircleColor = (patients, maxPatients, minPatients) => {
  const ratio = (patients - minPatients) / (maxPatients - minPatients);
  
  const r = Math.round(255 * ratio);
  const g = 0;
  const b = Math.round(255 * (1 - ratio));
  
  return `rgb(${r}, ${g}, ${b})`;
};

const ProvinceMap = () => {
  const { provinceName } = useParams(); // Get the province name from the URL
  const [hospitalData, setHospitalData] = useState([]);
  
  let maxPatients = 0;
  let minPatients = Infinity;

  const addHospitalMarker = async (hospitalName, patients) => {
    const coordinates = await fetchCoordinates(hospitalName);
    if (coordinates) {
      setHospitalData((prevData) => [...prevData, { name: hospitalName, patients, ...coordinates }]);
      
      if (patients > maxPatients) maxPatients = patients;
      if (patients < minPatients) minPatients = patients;
    } else {
      console.error(`Coordinates not found for ${hospitalName}`);
    }
  };

  useEffect(() => {
    const dummyHospitalData = {
  "province1": [
    { "name": "B & C Medical College Teaching Hospital", "patients": 200 },
    { "name": "B.P. Koirala Institute of Health Sciences", "patients": 300 },
    { "name": "Golden Hospital Pvt.Ltd", "patients": 150 },
    { "name": "Nobel Medical College Teaching Hospital Pvt.Ltd", "patients": 250 },
    { "name": "Neuro Cardio Multispeciality Hospital", "patients": 180 },
    { "name": "Illam Hospital", "patients": 100 },
    { "name": "Koshi Hospital", "patients": 220 },
    { "name": "Life Line Hospital", "patients": 120 },
    { "name": "Purna Tunga Birta City Hospital and Research Center", "patients": 110 },
    { "name": "Manamohan Memorial Eastern Regional Hospital", "patients": 250 },
    { "name": "Mechi Hospital", "patients": 200 },
    { "name": "Morang Cooperative Hospital", "patients": 180 },
    { "name": "Om Sai Pathibhara Hospital Pvt.Ltd", "patients": 130 },
    { "name": "Birat Medical College Teaching Hospital", "patients": 200 },
    { "name": "Purvanchal Cancer Hospital", "patients": 150 }
  ],
  "province2": [
    { "name": "National Medical College Teaching Hospital", "patients": 300 },
    { "name": "Janakpur Zonal Hospital", "patients": 150 },
    { "name": "Gajendra Narayan Singh Sagarmatha Zonal Hospital", "patients": 180 },
    { "name": "Narayani Sub Regional Hospital", "patients": 200 },
    { "name": "Janaki Health Care and Research Center", "patients": 100 },
    { "name": "Birgunj Health Care Hospital", "patients": 250 },
    { "name": "District Hospital Siraha", "patients": 150 },
    { "name": "Provincial Hospital Gaur", "patients": 180 }
  ],
  "province3": [
    { "name": "Aarogya Swasthya Prathisthan", "patients": 180 },
    { "name": "Alka Hospital Pvt.Ltd, Lalitpur", "patients": 220 },
    { "name": "Ashwins Medical College & Hospital", "patients": 200 },
    { "name": "B & B Hospital", "patients": 150 },
    { "name": "Bakulahar Ratnanagar Hospital", "patients": 130 },
    { "name": "B.P. Koirala Memorial Cancer Hospital", "patients": 270 },
    { "name": "Bhaktapur Cancer Hospital", "patients": 100 },
    { "name": "Bharatpur Hospital", "patients": 280 },
    { "name": "Birendra Army Hospital", "patients": 250 },
    { "name": "Blue Cross Hospital Pvt.Ltd", "patients": 140 },
    { "name": "Cancer Care Nepal", "patients": 160 },
    { "name": "Chirayu Dialysis Center", "patients": 90 },
    { "name": "Chitwan Medical College", "patients": 210 },
    { "name": "Chure Hill Hospital Pvt.Ltd", "patients": 200 },
    { "name": "Civil Service Hospital", "patients": 180 },
    { "name": "College of Medical Sciences", "patients": 220 },
    { "name": "Dhading Hospital", "patients": 150 },
    { "name": "Dhulikhel Hospital", "patients": 230 },
    { "name": "Grande International Hospital", "patients": 280 },
    { "name": "Greencity Hospital", "patients": 190 },
    { "name": "Hetauda Hospital", "patients": 210 },
    { "name": "Himal Hospital PVT.LTD", "patients": 160 },
    { "name": "Hospital for Advance Medicine & Surgery (HAMS)", "patients": 200 },
    { "name": "Kanti Children Hospital", "patients": 130 },
    { "name": "Kathmandu Cancer Center", "patients": 240 },
    { "name": "Kathmandu Medical College", "patients": 260 },
    { "name": "Kathmandu Model Hospital", "patients": 220 },
    { "name": "Kist Medical College and Teaching Hospital", "patients": 230 },
    { "name": "Manmohan Cardiothoracic Vascular and Transplant Center", "patients": 300 },
    { "name": "Manmohan Memorial Medical College & Teaching Hospital", "patients": 270 },
    { "name": "Maya Daya Swasthya Clinic", "patients": 110 },
    { "name": "National Trauma Center", "patients": 200 },
    { "name": "National Academy of Medical Sciences, Bir Hospital", "patients": 250 },
    { "name": "National City Hospital", "patients": 230 },
    { "name": "National Dialysis Center", "patients": 180 },
    { "name": "National Kidney Center", "patients": 200 },
    { "name": "National Kidney Center, Gaushala Unit", "patients": 220 },
    { "name": "National Kidney Center, Ramechhap", "patients": 160 },
    { "name": "Nepal Bharat Maitri Hospital", "patients": 180 },
    { "name": "Nepal Cancer Hospital and Research Center", "patients": 270 },
    { "name": "Nepal Medical College Pvt. Ltd.", "patients": 280 },
    { "name": "Nepal Orthopedic Hospital", "patients": 150 },
    { "name": "Nepal Police Hospital", "patients": 140 },
    { "name": "Om Hospital and Research Center PVT.LTD", "patients": 160 },
    { "name": "Paropakar Maternity and Women's Hospital", "patients": 250 },
    { "name": "Patan Academy of Health Science, Patan Hospital", "patients": 230 },
    { "name": "Shahid Dharma Bhakta National Transplant Center", "patients": 190 },
    { "name": "Shahid Gangalal National Heart Center", "patients": 220 },
    { "name": "Spinal Injury Rehabilitation Center", "patients": 180 },
    { "name": "Star Hospital", "patients": 160 },
    { "name": "Sumeru Community Hospital", "patients": 120 },
    { "name": "Suvekchya International Hospital", "patients": 140 },
    { "name": "Trishuli Hospital", "patients": 200 },
    { "name": "TU Teaching Hospital", "patients": 250 },
    { "name": "Upendra Devkota Memorial National Institute of Neuro", "patients": 300 },
    { "name": "Vayodha Hospitals PVT.LTD", "patients": 220 },
    { "name": "Venus Hospital", "patients": 190 }
  ],
  "province4": [
    { "name": "Pokhara Academy of Health Sciences, WRH", "patients": 220 },
    { "name": "Manipal Teaching Hospital", "patients": 280 },
    { "name": "Charak Memorial Hospital", "patients": 180 },
    { "name": "Gandaki Medical College", "patients": 160 },
    { "name": "Lakecity Hospital and Critical Care Pvt.Ltd", "patients": 150 },
    { "name": "Lamjung Hospital", "patients": 120 },
    { "name": "Dhaulagiri Zonal Hospital", "patients": 180 },
    { "name": "Beni Hospital", "patients": 130 },
    { "name": "Syangja District Hospital", "patients": 100 },
    { "name": "Parbat District Hospital", "patients": 120 },
    { "name": "National Kidney Center, Tanahun", "patients": 150 },
    { "name": "Gorkha Hospital", "patients": 110 },
    { "name": "Damauli Hospital", "patients": 130 },
    { "name": "Madhyabindu District Hospital", "patients": 100 },
    { "name": "Waling Community Dialysis Center", "patients": 120 }
  ],
  "province5": [
    { "name": "Lumbini Provincial Hospital", "patients": 250 },
    { "name": "District Hospital Bardia", "patients": 180 },
    { "name": "Rapti Zonal Hospital", "patients": 200 },
    { "name": "Universal College of Medical Sciences", "patients": 220 },
    { "name": "Siddharthanagar City Hospital", "patients": 150 },
    { "name": "Gautam Buddha Community Heart Hospital", "patients": 180 },
    { "name": "Bheri Zonal Hospital", "patients": 200 },
    { "name": "Crimson Hospital", "patients": 140 },
    { "name": "Rapti Sub Regional Hospital", "patients": 130 },
    { "name": "Nepalgunj Medical College", "patients": 230 },
    { "name": "Ganga Hospital", "patients": 120 },
    { "name": "Nawalparasi District Hospital", "patients": 100 },
    { "name": "Madhyabindu District Hospital", "patients": 110 },
    { "name": "Lumbini Medical College", "patients": 250 },
    { "name": "Lumbini Heart Hospital", "patients": 170 }
  ],
  "province6": [
    { "name": "Jumla Hospital", "patients": 100 },
    { "name": "Mahakali Zonal Hospital", "patients": 150 },
    { "name": "Seti Zonal Hospital", "patients": 130 },
    { "name": "Far Western Hospital", "patients": 200 },
    { "name": "Rara Hospital", "patients": 120 },
    { "name": "Dadeldhura Hospital", "patients": 110 },
    { "name": "Kailali District Hospital", "patients": 130 },
    { "name": "Dhangadhi Hospital", "patients": 150 },
    { "name": "Tulsipur Sub Regional Hospital", "patients": 120 },
    { "name": "Nepalgunj Medical College Teaching Hospital", "patients": 140 },
    { "name": "Mid Western Region Hospital", "patients": 160 }
  ],
  "province7": [
    { "name": "Mahendranagar Zonal Hospital", "patients": 160 },
    { "name": "Bajura District Hospital", "patients": 120 },
    { "name": "Kanchanpur District Hospital", "patients": 100 },
    { "name": "Dadeldhura Hospital", "patients": 130 },
    { "name": "Far Western Regional Hospital", "patients": 200 },
    { "name": "Fewa Community Hospital", "patients": 110 },
    { "name": "Janakpur Zonal Hospital", "patients": 140 }
  ]
};

    // Check if the province exists and fetch the hospital data for the selected province
 const intervalId = setInterval(() => {
      const hospitalsInProvince = dummyHospitalData[provinceName] || [];
      hospitalsInProvince.forEach(({ name, patients }) => {
        addHospitalMarker(name, patients);
      });
    }, 1000); // Fetch every second

    // Cleanup the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [provinceName]); 

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer
        center={[27.7172, 85.3240]} // Center map on Kathmandu (or adjust for each province)
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        {hospitalData.map((hospital, index) => (
          <Marker
            key={index}
            position={[hospital.latitude, hospital.longitude]}
            icon={new L.Icon({
              iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
              iconSize: [25 + hospital.patients / 50, 41 + hospital.patients / 50],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
            })}
          >
            <Popup>
              <strong>{hospital.name}</strong>
              <br />
              Patients: {hospital.patients}
              <br />
              Coordinates: {hospital.latitude}, {hospital.longitude}
            </Popup>
            <Circle
              center={[hospital.latitude, hospital.longitude]}
              radius={hospital.patients * 5}
              color={getCircleColor(hospital.patients, maxPatients, minPatients)}
              fillColor={getCircleColor(hospital.patients, maxPatients, minPatients)}
              fillOpacity={0.1}
            />
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default ProvinceMap;

