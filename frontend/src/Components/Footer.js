import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-blue-400 text-white text-center py-6">
      {/* Social Media Icons */}
      <div className="flex justify-center space-x-6 text-2xl mb-4">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="hover:opacity-75" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="hover:opacity-75" />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="hover:opacity-75" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="hover:opacity-75" />
        </a>
      </div>

      {/* Navigation Links */}
      <ul className="flex justify-center space-x-6 text-lg mb-4">
        <li><Link to="/home" className="hover:opacity-75">Home</Link></li>
        <li><Link to="/about" className="hover:opacity-75">About</Link></li>
        <li><Link to="/services" className="hover:opacity-75">Services</Link></li>
        <li><Link to="/team" className="hover:opacity-75">Team</Link></li>
        <li><Link to="/contact" className="hover:opacity-75">Contact</Link></li>
      </ul>

      {/* Address & Email */}
      <p className="text-sm mb-2">📍 123, ABC Street, City, Country</p>
      <p className="text-sm mb-4">📧 contact@example.com</p>

      {/* Copyright */}
      <p className="text-sm">© {new Date().getFullYear()} Your Company | All Rights Reserved</p>
    </footer>
  );
};

export default Footer;
