import React from "react";
import "./Header.css";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

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
          <button>
            <Link href="/auth/login" sx={{ textDecoration: "none", color:"white" }}>
              Get started
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
