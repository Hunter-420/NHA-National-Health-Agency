import React from 'react';
import Sidebar from '../SideBar/Sidebar';
import Navbar from '../Navbar/Navbar';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar className="w-[250px] fixed top-0 bottom-0 left-0 bg-[#2d2d2d] text-white pt-5" />

      {/* Main content area (where the Outlet will render) */}
      <div className="flex flex-col w-full ml-[250px]">
        {/* Navbar */}
        <Navbar />

        {/* Dynamic Content */}
        <div className="flex-1 bg-gray-100 pl-9 pt-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
