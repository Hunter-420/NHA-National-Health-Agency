import React from 'react';
import Sidebar from '../SideBar/Sidebar';
import Navbar from '../Navbar/Navbar';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex flex-col w-full">
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
