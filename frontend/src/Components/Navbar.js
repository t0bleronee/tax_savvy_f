import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css'; 
export default function Navbar() {
  return (
    <nav className="navbar bg-light">
      <div className="container-fluid d-flex justify-content-between">
        <a className="navbar-brand" href="#">TaxSavvy</a>
        <ul className="navbar-nav d-flex flex-row">
          <li className="nav-item mx-2">
            <Link className="nav-link active" to="/home">Home</Link>
          </li>
          <li className="nav-item mx-2">
            <Link className="nav-link" to="/about">About Us</Link>
          </li>
          <li className="nav-item mx-2">
            <Link className="nav-link" to="/contact">Contact Us</Link>
          </li>
          <li className="nav-item mx-2">
            <Link className="nav-link" to="/services">Services</Link>
          </li>
          <li className="nav-item mx-2">
            <Link className="nav-link" to="/resources">Resources</Link>
          </li>
          <li className="nav-item mx-2">
            <Link className="nav-link btn btn-primary" to="/">LogOut</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
