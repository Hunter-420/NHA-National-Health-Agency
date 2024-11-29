import React from 'react'
import { useParams } from 'react-router-dom'

function DieasePage() {
     const {diseaseName}= useParams();
  return (
    <div>
      {diseaseName}
    </div>
  )
}

export default DieasePage
