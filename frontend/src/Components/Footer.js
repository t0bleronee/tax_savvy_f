import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import "../css/footer.css"; // Import your CSS file for styling
const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
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
      <li className="hover:opacity-75">
              <button 
                className="nav-lin" 
                onClick={() => scrollToSection('hero')}
              >
                Home
              </button>
            </li>
      <li className="hover:opacity-75">
              <button 
                className="nav-lin" 
                onClick={() => scrollToSection('features')}
              >
                Features
              </button>
            </li>
            <li className="hover:opacity-75">
              <button 
                className="nav-lin" 
                onClick={() => scrollToSection('about')}
              >
                About Us
              </button>
            </li>
            <li className="hover:opacity-75">
              <button 
                className="nav-lin" 
                onClick={() => scrollToSection('faqs')}
              >
                FAQs
              </button>
            </li>
          
            
      </ul>

   
      {/* Copyright */}
      <p className="text-sm">© {new Date().getFullYear()} Your Company | All Rights Reserved</p>
    </footer>
  );
};

export default Footer;
