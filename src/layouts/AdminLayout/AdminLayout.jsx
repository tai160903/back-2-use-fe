import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import HeaderLog from "../../components/HeaderLog/HeaderLog";
import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";
import "./AdminLayout.css";

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState("admin");
  const [isOpen, setIsOpen] = useState(false); // Trạng thái sidebar

  const handleDrawerToggle = (open) => {
    setIsOpen(open);
  };
  const location = useLocation();

  return (
    <div className="admin-layout-container">
      {/* Sidebar bên trái - Fixed */}
      <AdminNavbar onDrawerToggle={handleDrawerToggle} />

      {/* Cột nội dung bên phải gồm Header + Content */}
      <div className={`admin-content-wrapper ${isOpen ? 'sidebar-open' : ''}`}>
        <HeaderLog />
        <div className="admin-main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
