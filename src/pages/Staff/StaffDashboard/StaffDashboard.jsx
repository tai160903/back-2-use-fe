import "./StaffDashboard.css";
import { GoPeople } from "react-icons/go";

export default function StaffDashboard() {
  return (
    <div className="staff-dashboard">
      <div className="staff-dashboard-header">
        <GoPeople className="staff-dashboard-icon" />
        <div>
          <h1 className="staff-dashboard-title">Staff Dashboard</h1>
          <p className="staff-dashboard-subtitle">
            Chào mừng bạn đến giao diện nhân viên. Các chức năng chi tiết sẽ được bổ sung dần.
          </p>
        </div>
      </div>

      <div className="staff-dashboard-content">
        <div className="staff-dashboard-card">
          <h2>Hướng dẫn nhanh</h2>
          <p>
            Đây là khu vực làm việc dành cho tài khoản staff. Bạn có thể sử dụng menu bên
            trái để điều hướng tới các chức năng được phân quyền.
          </p>
        </div>
      </div>
    </div>
  );
}


