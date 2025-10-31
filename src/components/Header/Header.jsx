import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Header.css";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import logoImage from "../../assets/image/Logo.png";
import useAuth from "../../hooks/useAuth"; 
import { logout } from "../../store/slices/authSlice";
import { useSelector } from "react-redux";
import { getProfileApi } from "../../store/slices/userSlice";

export default function Header() {
  const location = useLocation();
  const { currentUser, dispatch, navigate } = useAuth();
  const {userInfo} = useSelector(state => state.user);
  console.log("userInfo", userInfo);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Gọi API get profile khi component mount và có currentUser
  useEffect(() => {
    if (currentUser && !userInfo?.data) {
      dispatch(getProfileApi());
    }
  }, [currentUser, userInfo?.data, dispatch]);

  // Danh sách trang auth
  const loginPage = location.pathname === "/auth/login";
  const registerPage = location.pathname === "/auth/register";

  let buttonText = "Get started";
  let buttonLink = "/auth/login";
  if (loginPage) {
    buttonText = "Sign Up";
    buttonLink = "/auth/register";
  } else if (registerPage) {
    buttonText = "Sign In";
    buttonLink = "/auth/login";
  }

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate("/auth/login");
  };

  return (
    <div className="header">
      <div className="headerTitles">
        {/* LOGO */}
        <div className="header-logo">
          <img src={logoImage} alt="Back2Use Logo" className="logo-image" />
          <div className="logo-text">
            <Button
              sx={{
                fontSize: "30px",
                fontWeight: "700",
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                textTransform: "none",
              }}
            >
              <Link to="/" style={{ textDecoration: "none", color: "#006C1E" }}>
                Back2Use
              </Link>
              <span
                style={{
                  fontSize: "15px",
                  color: "#374151",
                  textTransform: "none",
                }}
              >
                Reusable Packaging
              </span>
            </Button>
          </div>
        </div>

        {/* NAV LINKS */}
        <div className="header-nav">
          <Link to="/liststore">Stores</Link>
          <Link to="/rankings">Ranking</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/vouchers">Vouchers</Link>
          <Link to="/about">About</Link>
        </div>

        {/* CTA hoặc Avatar */}
        <div className="cta">
          {currentUser ? (
            <>
              <Avatar
                src={userInfo?.avatar || ""}
                alt={userInfo?.fullName || "User"}
                onClick={handleMenuOpen}
                sx={{
                  cursor: "pointer",
                  boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                  width: 40,
                  height: 40,
                }}
              >
                {userInfo?.fullName
                  ? userInfo.fullName.charAt(0).toUpperCase()
                  : "U"}
              </Avatar>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: { mt: 1.5 },
                }}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleMenuClose();
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/wallet");
                    handleMenuClose();
                  }}
                >
                  Wallet
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
              {/* Thêm nút đăng ký doanh nghiệp cho customer */}
           
            </>
          ) : (
            <Button
              sx={{
                backgroundColor: "#006c1e",
                color: "white",
                "&:hover": { backgroundColor: "#004d15" },
              }}
            >
              <Link
                to={buttonLink}
                style={{ textDecoration: "none", color: "white" }}
              >
                {buttonText}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
