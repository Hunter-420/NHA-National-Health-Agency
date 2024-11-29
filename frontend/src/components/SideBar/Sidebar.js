import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaBuilding, FaHospital, FaChartLine } from "react-icons/fa";

const navItems = [
  { title: "Overview", path: "/overview", icon: <FaHome className="w-5 h-5" fill="rgba(86,106,216,1)" /> },
  { title: "District", path: "/district", icon: <FaBuilding className="w-5 h-5" fill="rgba(86,106,216,1)" /> },
  { title: "Department", path: "/department", icon: <FaBuilding className="w-5 h-5" fill="rgba(86,106,216,1)" /> },
  { title: "Hospital", path: "/hospital", icon: <FaHospital className="w-5 h-5" fill="rgba(86,106,216,1)" /> },
  { title: "Summary", path: "/summary", icon: <FaChartLine className="w-5 h-5" fill="rgba(86,106,216,1)" /> },
];

const Sidebar = () => {
  return (
    <aside className="flex flex-col w-64 h-screen px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-[rgba(229,230,232,1)] dark:border-[#2252fe]">
      <h1 className="w-auto h-7 text-[rgba(86,106,216,1)] text-center">NHA</h1>

      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav className="-mx-3 space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex   items-center px-3 py-3 gap-x-2 transition-colors duration-300 transform rounded-xl ${
                  isActive
                    ? "bg-[rgba(136,234,218,1)] text-gray-700"
                    : "bg-white text-gray-600"
                }`
              }
            >
                <div className="flex justify-center items-center gap-3 relative left-8">

              <div className="flex-shrink-0">{item.icon}</div>
              <span
                className="text-sm font-medium"
                style={{
                  color: "rgba(86,106,216,1)",
                }}
                >
                {item.title}
              </span>
                </div>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
