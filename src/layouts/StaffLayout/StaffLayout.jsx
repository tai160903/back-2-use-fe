import { useState } from "react";
import { Outlet } from "react-router-dom";
import HeaderLog from "../../components/HeaderLog/HeaderLog";
import StaffNavbar from "../../components/StaffNavbar/StaffNavbar";
import "./StaffLayout.css";

export default function StaffLayout() {
  const [isOpen, setIsOpen] = useState(false);

  const handleDrawerToggle = (open) => {
    setIsOpen(open);
  };

  return (
    <div className="staff-layout-container">
    
      <StaffNavbar onDrawerToggle={handleDrawerToggle} />

    
      <div
        className={`staff-content-wrapper ${
          isOpen ? "sidebar-open" : ""
        }`}
      >
        <HeaderLog />
        <div className="staff-page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}


