import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (sectionId) => {
    if (location.pathname !== '/home') {
      // If not on homepage, navigate to home first
      navigate('/home', { state: { scrollTo: sectionId } });
    } else {
      // If already on homepage, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Add this effect to handle scroll after navigation
  React.useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Small delay to ensure page is loaded
      }
    }
  }, [location.state]);

  return (
    <nav className="navbar bg-light">
      <div className="container-fluid d-flex justify-content-between">
      <div className="d-flex align-items-center me-auto">
      {/*<img src="/Assets/logo2.jpg" height="40" alt="Logo" className="me-2"/>*/}
      <Link className="navbar-brand" to="/home">TaxSavvy</Link>
    </div>
        <ul className="navbar-nav d-flex flex-row">
          <li className="nav-item mx-2">
            <button 
              className="nav-link" 
              onClick={() => handleNavigation('hero')}
            >
              Home
            </button>
          </li>
          <li className="nav-item mx-2">
            <button 
              className="nav-link" 
              onClick={() => handleNavigation('about')}
            >
              About Us
            </button>
          </li>
          <li className="nav-item mx-2">
            <button 
              className="nav-link" 
              onClick={() => handleNavigation('features')}
            >
              Features
            </button>
          </li>
          <li className="nav-item mx-2">
            <Link className="nav-link btn btn-primary" to="/">LogOut</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
