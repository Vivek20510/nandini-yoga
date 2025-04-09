import React from "react";
import { Link } from "react-router-dom";
import HeroImage from "../assets/nandini-hero.png";

const Home = () => {
  return (
    <div className="font-serif text-[#444] bg-[#fffaf5]">
      {/* Hero Section */}
      <section className="min-h-[85vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-8 bg-[url('/background-floral.png')] bg-cover bg-center">
  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#6B4F4F]">
    Yoga By Nandini
  </h1>
  <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#7a5c5c] max-w-md sm:max-w-xl">
    Where the rhythm of breath meets the art of presence — and you return home to yourself.
  </p>
  <img
    src={HeroImage}
    alt="Nandini Yoga"
    className="mt-6 w-44 sm:w-56 md:w-64 h-44 sm:h-56 md:h-64 rounded-full border-4 border-[#d3b8ae] object-cover shadow-md"
  />
  <div className="mt-8">
    <Link
      to="/contact"
      className="inline-block bg-[#d3b8ae] hover:bg-[#c6a597] text-white text-base sm:text-lg font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full shadow-md transition duration-300"
    >
      Contact Us
    </Link>
  </div>
</section>


      {/* About Section */}
<section className="py-12 sm:py-16 px-4 sm:px-6 text-center bg-[#fffaf5]">
  <h2 className="text-2xl sm:text-3xl font-bold text-[#6B4F4F]">
    About Nandini
  </h2>
  <p className="max-w-md sm:max-w-3xl mx-auto mt-4 text-base sm:text-lg leading-relaxed text-[#7a5c5c]">
    <span className="italic">“Yoga is the perfume of peace — it lingers long after the practice.”</span><br /><br />
    Nandini Singh is a certified international yoga and meditation teacher with over 8 years of experience guiding individuals toward holistic wellness. Rooted in both traditional and modern practices, she integrates yoga, pranayama, and mindfulness to foster physical vitality, emotional balance, and mental clarity.<br /><br />
    Trained at <strong>Om Yoga International (Rishikesh)</strong> and <strong>Transfigure Yoga (Indore)</strong>, Nandini is devoted to cultivating a safe, soulful space where every student can breathe, move, and bloom into their most authentic self.
  </p>
</section>

    </div>
  );
};

export default Home;
