import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import HeaderLog from "../../components/HeaderLog/HeaderLog";
import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState("admin");
  const [isOpen, setIsOpen] = useState(false); // Trạng thái sidebar

  const handleDrawerToggle = (open) => {
    setIsOpen(open);
  };
  const location = useLocation();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar bên trái */}
      <AdminNavbar onDrawerToggle={handleDrawerToggle} />

      {/* Cột nội dung bên phải gồm Header + Content */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <HeaderLog />
        <div style={{ flex: 1, padding: "20px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
