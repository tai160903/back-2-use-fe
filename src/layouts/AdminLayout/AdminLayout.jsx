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
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header cố định trên cùng */}
      <HeaderLog />

      <div style={{ display: "flex", flex: 1 }}>
        {/* AdminNavbar bên trái */}
        <AdminNavbar
          onDrawerToggle={handleDrawerToggle}
        />

        {/* Nội dung chính bên phải */}
        <div
          style={{
            flexGrow: 1,
            marginLeft: isOpen ? "" : "70px",
            transition: "margin-left 0.3s",
            padding: "20px",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
