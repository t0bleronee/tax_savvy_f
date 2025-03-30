import React from "react";

import "bootstrap/dist/js/bootstrap.bundle.min.js";  // Ensure JS components work
const VideoCarousel = () => {
  const videos = [
    {
      title: "Financial Education: Why 90% Fail & How to Succeed",
      description: "Financial education is essential and will change your life if you commit to learning and using it. Getting your tax right and staying out of debt is not enough to build financial freedom. In this video, learn why 90% of people fail at financial education and how you can succeed, starting today.",
      embedUrl: "https://www.youtube.com/embed/q5JWp47z4bY?si=JhHGlKtxNJAHx6Jf"
    },
    {
      title: "Financial Literacy 101: Budgeting, Investing & Saving",
      description: "How do you make a budget? What's an index fund? Why is compound interest so powerful? What is the time value of money? Learn the basics of financial literacy, including managing money, saving for the future, and understanding credit. Discover how to make smart financial decisions today!",
      embedUrl: "https://www.youtube.com/embed/4j2emMn7UaI?si=3FVL5JOfrKayda59"
    },
    {
      title: "The 15/65/20 Rule: Money Management Like the Top 1%",
      description: "Discover the easy '15/65/20 system' to manage your money like the top 1%. This strategy helps you balance between saving, spending, and enjoying life, ensuring financial security while living comfortably.",
      embedUrl: "https://www.youtube.com/embed/NEzqHbtGa9U?si=spcncDfuw2vaseXp"
    },
    {
      title: "Smart Paycheck Routine: What To Do After Getting Paid",
      description: "Make sure to do this every time AFTER you get paid. This paycheck budgeting routine helps maximize the value of your money by prioritizing savings, expenses, and investments in a structured way.",
      embedUrl: "https://www.youtube.com/embed/IIKr2915l2g?si=H3MeDJwEf0WTefb5"
    }
  ];

  return (
    <div className="container my-4">
      {/* Styled Heading */}
      <h2 className="text-center mb-4" style={{ fontWeight: "bold", color: "#333" }}>
        Resources
      </h2>

      <div 
        id="videoCarousel" 
        className="carousel carousel-dark slide mx-auto p-3"
        data-bs-ride="carousel"
        style={{ maxWidth: "85%", backgroundColor: "#2EAF7D", borderRadius: "12px", padding: "20px" }}
      >
        {/* Indicators */}
        <div className="carousel-indicators">
          {videos.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#videoCarousel"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-current={index === 0 ? "true" : "false"}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>

        {/* Carousel Items */}
        <div className="carousel-inner">
          {videos.map((video, index) => (
            <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index} data-bs-interval="5000">
              <div className="d-flex align-items-center justify-content-center" style={{ height: "350px" }}>
                <div className="row w-100 " style={{ paddingLeft: "11%" ,paddingRight: "11%" }}>
                  {/* Alternating Video & Description Position */}
                  {index % 2 === 0 ? (
                    <>
                      {/* Left Side: Video */}
                      <div className="col-md-6 d-flex align-items-center justify-content-center">
                      <a href={video.embedUrl.replace("/embed/", "/watch?v=")} target="_blank" rel="noopener noreferrer">
  <img 
    src={`https://img.youtube.com/vi/${video.embedUrl.split("/embed/")[1].split("?")[0]}/hqdefault.jpg`} 
    alt={video.title} 
    width="100%" 
    height="220" 
    style={{ borderRadius: "10px", cursor: "pointer" }} 
  />
</a>

                      </div>
                      {/* Right Side: Description */}
                      <div className="col-md-6 d-flex align-items-center justify-content-center text-start px-4 text-white">
                        <div>
                          <h4 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{video.title}</h4>
                          <p style={{ fontSize: "0.95rem" }}>{video.description}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Left Side: Description */}
                      <div className="col-md-6 d-flex align-items-center justify-content-center text-start px-4 text-white">
                        <div>
                          <h4 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{video.title}</h4>
                          <p style={{ fontSize: "0.95rem" }}>{video.description}</p>
                        </div>
                      </div>
                      {/* Right Side: Video */}
                      <div className="col-md-6 d-flex align-items-center justify-content-center">
                      <a href={video.embedUrl.replace("/embed/", "/watch?v=")} target="_blank" rel="noopener noreferrer">
  <img 
    src={`https://img.youtube.com/vi/${video.embedUrl.split("/embed/")[1].split("?")[0]}/hqdefault.jpg`} 
    alt={video.title} 
    width="100%" 
    height="220" 
    style={{ borderRadius: "10px", cursor: "pointer" }} 
  />
</a>

                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <button className="carousel-control-prev" type="button" data-bs-target="#videoCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#videoCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default VideoCarousel;
