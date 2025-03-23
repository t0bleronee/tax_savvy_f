import React from 'react';
import Navbar from '../Components/Navbar'; // Adjust the path if needed
import HeroSec from '../Components/HeroSec'; // Import the Hero Section
import TaxFeatures from '../Components/TaxFeatures'; // Import the new Tax Features section
import HomeCarousal from '../Components/HomeCarousal'
import AboutUs from '../Components/AboutUs';
import FAQs from '../Components/FAQs';
import  Subscription from '../Components/Subscription';
import Video from '../Components/Video';
import Footer from '../Components/Footer'

export default function Home() {
  return (
    <div>
      <Navbar />  {/* Navigation Bar */}
      
      <div className="container-fluid p-0">
        <HeroSec /> {/* Hero Section */}
      </div>

      <div className="container text-center my-5">
        <h1>Welcome to TaxSavvy</h1>
        <p>Your smart tax companion!</p>
      </div>

      {/* Tax Features Section */}
      <TaxFeatures /> 
      <HomeCarousal />
      <AboutUs />
      <FAQs />
      <Subscription />
      <Video />
      
      
    </div>
  );
}
