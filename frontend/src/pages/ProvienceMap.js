import React from 'react'
import { useParams } from 'react-router-dom'
import Leaflet from '../components/leaflet/Leaflet';

function ProvienceMap() {
     const {provinceName,diseaseName}= useParams();
  return (
    <div>

      <Leaflet/>
         
    </div>
  )
}

export default ProvienceMap
