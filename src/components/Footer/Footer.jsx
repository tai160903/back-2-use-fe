import React from 'react'
import "./Footer.css";
import { FaFacebookF, FaGoogle, FaLeaf } from "react-icons/fa6";
import { Path } from 'leaflet';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="brand-row">
            <span className="brand-icon" aria-hidden="true">
              <FaLeaf size={28} />
            </span>
            <span className="brand-name">Back2Use</span>
          </div>
          <p className="brand-desc">
            Back2Use is a platform that allows you to find the products you need.
          </p>
          <div className="socials">
           
            <a className="social-btn" href="#" aria-label="Google">
              <FaGoogle className="social-icon" />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="col-title">Site Map</h4>
          <ul className="col-list">
            <li><a href={Path.HOME}>Homepage</a></li>
            <li><a href={Path.STORE}>Store</a></li>
            <li><a href={Path.ABOUT}>About Us</a></li>
            <li><a href={Path.PRICING}>Pricing</a></li>
            <li><a href={Path.VOUCHERS}>Vouchers</a></li>
            <li><a href={Path.RANKINGS}>Rankings</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="col-title">Legal</h4>
          <ul className="col-list">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Returns and Shipping</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} GreenNest. All rights reserved.</span>
      </div>
    </footer>
  )
}
