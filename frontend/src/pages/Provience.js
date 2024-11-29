import React from 'react'
import { useParams } from 'react-router-dom'

function Provience() {
     const {provinceName,diseaseName}= useParams();
  return (
    <div>
         <h1>
             {provinceName}
         </h1>
          <p>{diseaseName}</p>
    </div>
  )
}

export default Provience
