import React from "react";

const Carousel = ({ items }) => {
  return (
    <div id="carouselExampleDark" className="carousel carousel-dark slide" data-bs-ride="carousel">
      {/* Indicators */}
      <div className="carousel-indicators">
        {items.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Carousel Items */}
      <div className="carousel-inner">
        {items.map((item, index) => (
          <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index} data-bs-interval="4000">
            <div className="d-flex align-items-center justify-content-center" style={{ height: "500px" }}>
              <div className="row w-100" style={{ paddingLeft: "12%" }}>
                {/* Left Side: Quote */}
                <div className="col-md-6 d-flex align-items-center justify-content-end pe-4">
                  <h3 style={{ marginBottom: "0", maxWidth: "90%" }}>{item.quote}</h3>
                </div>
                
                {/* Right Side: Image */}
                <div className="col-md-6 d-flex align-items-center justify-content-start" >
                  <img src={item.imgSrc} className="img-fluid" alt={`Slide ${index + 1}`} style={{ maxHeight: "400px", borderRadius: "10px" }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;
