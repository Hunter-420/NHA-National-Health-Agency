import React from 'react'
import Echarts from '../Echarts/Echarts'

function MainContent() {
  return (
    <main className="flex-1 bg-gray-100 pl-9 pt-5">

      <h1 className=" text-5xl font-semibold text-gray-700 mb-4">Generating national health insights.<br/>
      Securing the Future.</h1>
      
      {/* Content */}
      <div className="w-full flex justify-center flex-col ">
        <p className="text-gray-600 text-[32px]
         font-semibold underline text-center 
          mr-8 mt-7">
          Weekly Report 
        </p>

            <div className='flex mt-8 gap-1'>
                  <div className='w-[400px] h-[300px]'>

<Echarts/>
                  </div>
            </div>
      </div>
    </main>
  )
}

export default MainContent
