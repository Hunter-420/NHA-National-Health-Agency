import React from 'react';
import DiseaseChart from '../graphs/MonthlyAllDisease';
import TopDiseaseCase from '../graphs/TopDiseaseCase';
import MonthlyDiseaseChart from '../../pages/MonthlyDiseaseChart';
import MonthlyTopDiseaseChart from '../../pages/MonthlyTopDiseaseChart';

function MainContent() {
  return (
    <main className="flex-1 h-full bg-gray-100  pt-5 " style={{fontFamily: "'IBM Plex Serif', serif"}}>
      <h1 className="text-5xl font-semibold text-gray-700 mb-4 leading-[1.3]"  >
        Generating national health insights.<br />
        Securing the Future.
      </h1>

      {/* Content */}
      <div className="w-full flex justify-center flex-col">
        <p className="text-gray-600 text-[32px] font-semibold underline text-center mr-8 mt-7">
          Weekly Report
        </p>

        <div className="flex flex-wrap mt-8 gap-8 justify-center">
          {/* Make both components fit side by side */}
           <div className="w-full sm:w-[45%] lg:w-[48%] h-[200px]">
            <DiseaseChart />
          </div>
          <div className="h-full">
            <TopDiseaseCase />

            
          </div>
        
      </div>
      </div>

      <div className="w-full flex justify-center flex-col">
        <p className="text-gray-600 text-[32px] font-semibold underline text-center mr-8 mt-7">
          Monthly Report
        </p>

        <div className="flex flex-wrap mt-8 gap-8 justify-center">
          {/* Make both components fit side by side */}
           <div className="w-full sm:w-[45%] lg:w-[48%] h-[200px]">
            <MonthlyDiseaseChart />
          </div>
          <div className="h-full">
            <MonthlyTopDiseaseChart />

            
          </div>
        
      </div>
      </div>
    </main>
  );
}

export default MainContent;
