
import  { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";

export default function MainLayout() {
  const [activeTab, setActiveTab] = useState("home");
  const [isOpen, setIsOpen] = useState(false); // Trạng thái sidebar

  const handleDrawerToggle = (open) => {
    setIsOpen(open);
  };
   const location = useLocation();

  return (
    
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* <Header style={{ position: "fixed", top: 0, width: "100%", zIndex: 1100 }} /> */}
      <Navbar
       activeTab={location.pathname}
        onTabChange={setActiveTab}
        onDrawerToggle={handleDrawerToggle} 
        style={{ position: "fixed", top: "64px", height: "calc(100% - 64px)", zIndex: 1000 }}
      />
      <div
        style={{
          marginTop: "64px",
          marginLeft: isOpen ? "250px" : "0",
          flexGrow: 1,
          transition: "margin-left 0.3s",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
