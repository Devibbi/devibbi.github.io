// page.js
import React from "react";
import Navbar from "../components/Navbar";
import Skills from "../components/Skills";
import HomePage from "../components/Home";
import Blog from "../components/Blog";
import Contact from "../components/Contact";

const Home = () => {
  return (
    <div className="relative min-h-screen bg-gray-50">
      <Navbar />
      <main className="w-full md:pl-24">
        <HomePage />
        <Skills />
        <Blog />
        <Contact />
      </main>
    </div>
  );
};

export default Home;