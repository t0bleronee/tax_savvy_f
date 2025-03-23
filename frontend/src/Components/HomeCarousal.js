import React from "react";
import Carousel from "../Components/Carousal"; // Importing the reusable Carousel component

const homeCarouselItems = [
  {
    imgSrc: "/Assets/telescope.jpg", // Replace with actual image source
    quote: "Take charge of your financial future today! If you don’t control your money, it will end up controlling you. Our platform empowers you to make smart financial decisions effortlessly.",
  },
  {
    imgSrc: "/Assets/credit_card.jpg", // Replace with actual image source
    quote: "Financial freedom isn’t just a dream—it’s a choice. Millions wish for it, but only those who take action achieve it. Get started with our tools and resources to secure your financial independence.",
  },
  {
    imgSrc: "/Assets/people_on_stair.png.jpg", // Replace with actual image source
    quote: "Your money won’t grow on its own, but we can help make it happen! Learn how to save and invest wisely with our expert-backed insights and personalized recommendations.",
  },
  {
    imgSrc: "/Assets/type_writer.jpg", // Replace with actual image source
    quote: "Earning more isn’t enough—keeping and growing your wealth is what truly matters. Discover smart strategies to maximize your savings and investments with our easy-to-use platform.",
  },
];

const Home = () => {
  return (
    <div>
      <Carousel items={homeCarouselItems} />
      <h2 className="text-center mt-4">Welcome to TaxSavvy</h2>
      <p className="text-center">
        Your one-stop platform for simplified tax filing and financial insights.
      </p>
    </div>
  );
};

export default Home;
