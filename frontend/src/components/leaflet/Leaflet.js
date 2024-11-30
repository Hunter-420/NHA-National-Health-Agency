import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Default Leaflet marker icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Utility function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const Leaflet = () => {
  const { province, case_name } = useParams(); // Get province and case_name from the URL
  const [hospitalData, setHospitalData] = useState([]); // State to hold the hospital data
  const [center, setCenter] = useState([27.7172, 85.3240]); // Default center (Kathmandu) for map
  const [loading, setLoading] = useState(true); // Loading state
  const [noData, setNoData] = useState(false); // State to track if no data was found

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedProvince = capitalizeFirstLetter(province); // Capitalize province name
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/hm/get-hospital-mapping`, {
          province: formattedProvince,
          case_name: case_name,
        });

        // Check if data is available for the province
        if (response.data[formattedProvince] && Object.keys(response.data[formattedProvince]).length > 0) {
          const hospitals = Object.values(response.data[formattedProvince]); // Convert object to array
          setHospitalData(hospitals);

          // Calculate the center by averaging the latitude and longitude of all hospitals
          const avgLatitude = hospitals.reduce((sum, hospital) => sum + hospital.latitude, 0) / hospitals.length;
          const avgLongitude = hospitals.reduce((sum, hospital) => sum + hospital.longitude, 0) / hospitals.length;

          setCenter([avgLatitude, avgLongitude]);
          setNoData(false); // Set to false if data exists
        } else {
          setHospitalData([]);
          setNoData(true); // Set to true if no data is available
        }
      } catch (error) {
        console.error('Error fetching hospital data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [province, case_name]);

  // Function to determine circle color based on the number of patients
  const getCircleColor = (hospital) => {
    const topHospital = hospitalData.reduce(
      (max, hospital) => (hospital.patients > max.patients ? hospital : max),
      hospitalData[0]
    );
    return hospital.patients === topHospital.patients ? 'lightcoral' : 'lightgreen';
  };

  // Custom Marker Icon
  const hospitalIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', // Your custom icon URL
    iconSize: [25, 41], // Size of the icon
    iconAnchor: [12, 41], // Anchor point of the icon
    popupAnchor: [0, -41], // Popup anchor
  });

  if (loading) {
    return <div>Loading map...</div>; // Optional loading state
  }

  return (
    <div>
      {/* Show message if no data is available */}
      {noData ? (
        <div className="no-data-message" style={{ textAlign: 'center', margin: '20px' }}>
          <h2>No hospital data available for {province}</h2>
          <p>Please try another province or case name.</p>
        </div>
      ) : (
        <MapContainer center={center} zoom={10} style={{ height: '100vh', width: '90%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
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
                  <strong>{hospital.name}</strong>
                  <br />
                  Patients: {hospital.patients}
                  <br />
                  Location: ({hospital.latitude}, {hospital.longitude})
                </Popup>
              </CircleMarker>

              {/* Default Marker with Custom Icon */}
              <Marker
                position={[hospital.latitude, hospital.longitude]}
                icon={hospitalIcon} // Apply the custom marker icon here
              >
                <Popup>
                  <strong>{hospital.name}</strong>
                  <br />
                  Patients: {hospital.patients}
                  <br />
                  Location: ({hospital.latitude}, {hospital.longitude})
                </Popup>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default Leaflet;
