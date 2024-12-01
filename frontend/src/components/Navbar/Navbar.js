import React from 'react'
import { FaSearch } from "react-icons/fa"; // Import the search icon
import { IoIosNotifications } from "react-icons/io";
function Navbar() {
  return (
    <nav className="w-full h-[60px]  text-white flex items-center justify-between px-4  shadow-md">

    
    <div className="flex justify-end items-center w-full  gap-[40px] ">
    <form  className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 w-[180px]  rounded-3xl border border-gray-300 outline-none text-black"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent text-gray-600"
        >
          <FaSearch className="text-xl" style={{ color: "rgba(86,106,216,1)" }} />
        </button>
      </form>
  <div>
  <IoIosNotifications size={25} fill='blue' className='cursor-pointer'/>

  </div>

 
    </div>
   
  </nav>
  )
}

export default Navbar
