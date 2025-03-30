import React from 'react';
import Navbar from '../Components/Navbar'; // Adjust the path if needed
import HeroSec from '../Components/HeroSec'; // Import the Hero Section
import TaxFeatures from '../Components/TaxFeatures'; // Import the new Tax Features section
import HomeCarousal from '../Components/HomeCarousal'
import AboutUs from '../Components/AboutUs';
import FAQs from '../Components/FAQs';
import Video from '../Components/Video';
import Footer from '../Components/Footer'


export default function Home() {
  return (
    <div>
      <Navbar />  {/* Navigation Bar */}
      
      <div className="container-fluid p-0" id="hero">
        <HeroSec /> {/* Hero Section */}
      </div>

      <div className="container text-center my-5">
        <h1>Welcome to TaxSavvy</h1>
        <h4>Your smart tax companion!</h4>
      </div>
      <div id="features">
        <TaxFeatures />
      </div>
      
      <div id="carousel">
        <HomeCarousal />
      </div>
      
      <div id="about">
        <AboutUs />
      </div>
      
      <div id="faqs">
        <FAQs />
      </div>
      
      <div id="video">
        <Video />
      </div>
      
      <Footer />
    </div>
      
  );
}
