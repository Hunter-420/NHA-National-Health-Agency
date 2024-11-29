import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Overview from './pages/Overview';
import District from './pages/District';
import Department from './pages/Department';
import Hosptital from './pages/Hosptital';
import Summary from './pages/Summary';
import MainContent from './components/MainContent/MainContent';
import SpecificDiseaseProvinceBarChart from './components/graphs/SpecificDiseaseProvionceBarChart';
import Provience from './pages/Provience';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>

        <Route index element={<MainContent/> } />
          <Route path="overview" element={<Overview />} />
 <Route path="district" element={<District />} />
          <Route path="department" element={<Department />} />
          <Route path="hospital" element={<Hosptital />} />
          <Route path="summary" element={<Summary />} /> */
          <Route path='province/:diseaseName' element={<SpecificDiseaseProvinceBarChart/>}/>
          <Route path='province/:provinceName/:diseaseName' element={<Provience/>}/>


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;