import React from "react";
import "./Header.css";
import Typography from "@mui/material/Typography";

export default function Header() {
  return (
    <div className="header">
      <div className="headerTitles">
        <div className="header-logo">
          <Typography sx={{ fontSize: "30px", fontWeight: "700" }}>
            Back2Use
          </Typography>
          <span
            style={{
              fontSize: "15px",
              color: "white",
              textTransform: "none",
            }}
          >
            Reusable Packaging
          </span>
        </div>
        <div className="header-nav">
          <a href="#solutions">Feature</a>
          <a href="#customers">Pricing</a>
          <a href="#about">About</a>
        </div>
        <div className="cta">
          <button>Get started</button>
        </div>
      </div>
    </div>
  );
}
