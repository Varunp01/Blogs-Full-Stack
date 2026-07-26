import React from "react";
import { Link } from "react-router-dom";
import FeaturedBlogs from "./HomeComponents/FeaturedBlogs.jsx";
import LatestBlogs from "./HomeComponents/LatestBlogs.jsx";
import HomeHero from "./HomeComponents/HomeHero.jsx";
import JoinCommunity from "./HomeComponents/JoinCommunity.jsx";

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <HomeHero />
      {/* Featured Blog Section */}
      <FeaturedBlogs />
      {/* Latest Blog Section */}
      <LatestBlogs />
      {/* Join Community */}
      <JoinCommunity />
    </>
  );
};

export default Home;
