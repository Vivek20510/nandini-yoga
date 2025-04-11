import React from "react";
import { Link } from "react-router-dom";
import yogaPose from "../assets/yoga-pose-3.png"; 
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import YogaAnimation from "../assets/yoga-animation.json";

const Home = () => {
  return (
    <motion.div
      className="font-serif text-[#444] bg-[#fffaf5]"
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >

    {/* Hero Section */}
    
  <section className="min-h-[85vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-8  bg-cover bg-center">
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#6B4F4F]">
      Yoga By Nandini
    </h1>
    <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#7a5c5c] max-w-md sm:max-w-xl">
      Where the rhythm of breath meets the art of presence — and you return home to yourself.
    </p>


     <div className="mt-6 w-44 sm:w-56 md:w-64 h-44 sm:h-56 md:h-64 rounded-full border-4 border-[#d3b8ae] shadow-md bg-[#FFF6F9] p-1 flex items-center justify-center">
      <Lottie 
        animationData={YogaAnimation} 
        loop={true} 
        autoplay={true} 
        className="w-full h-full"
      />
      </div>

      {/* <img
        src={yogaPose}
        alt="Yoga Pose"
        className="mt-6 w-44 sm:w-56 md:w-64 h-44 sm:h-56 md:h-64 rounded-full border-4 border-[#d3b8ae] shadow-md bg-[#FFF6F9] p-1 object-cover"
      /> */}

<div className="mt-10 flex justify-center">
  <Link
    to="/contact"
    className="group relative inline-block px-8 py-3 sm:px-10 sm:py-4 rounded-full bg-[#d3b8ae] text-white text-base sm:text-lg font-semibold shadow-lg transition-all duration-300 hover:bg-[#c6a597] focus:outline-none focus:ring-4 focus:ring-[#d3b8ae]/50"
    aria-label="Contact Us"
  >
    <span className="relative z-10">Contact Us</span>
    <span className="absolute inset-0 rounded-full bg-white opacity-10 group-hover:opacity-20 transition duration-300" />
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

    Nandini Singh is a certified international yoga and meditation teacher with over 8 years of experience in guiding individuals toward holistic wellness. With a heart rooted in ancient wisdom and a mind open to modern practices, she artfully blends yoga asanas, pranayama, and mindfulness to awaken physical vitality, emotional harmony, and mental clarity.<br /><br />

    Her path has been shaped by profound training at some of the world’s most respected institutions:<br /><br />
    
    <strong>Patanjali Yogpeeth (Haridwar)</strong> — Completed both foundational and advanced yoga practices grounded in holistic well-being, incorporating Ayurvedic healing principles.<br />
    
    <strong>Isha Foundation (Coimbatore)</strong> — Immersed in Inner Engineering and classical Hatha Yoga under the guidance of Sadhguru, with a deep focus on breathwork, inner alignment, and mindfulness.<br />
    
    <strong>Om Yoga International (Rishikesh)</strong> — Completed an intensive teacher training program covering yoga philosophy, anatomy, alignment, and teaching methodology.<br /><br />

    With unwavering dedication, Nandini creates a safe and soulful space where each individual can breathe deeply, move freely, and blossom into their most authentic self — both on and off the mat.
  </p>
</section>


      {/* Why Yoga Section */}
      {/* <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#fff0f4] text-center relative overflow-hidden">
  {/* Decorative floral background blur */}
  {/* <div className="absolute top-0 left-0 w-40 h-40 bg-pink-200 opacity-30 rounded-full blur-3xl animate-pulse"></div>
  <div className="absolute bottom-0 right-0 w-40 h-40 bg-rose-100 opacity-20 rounded-full blur-2xl animate-ping"></div>

  <h3 className="text-3xl font-bold text-[#6B4F4F] mb-3 tracking-wide relative z-10">
    Why Practice Yoga?
  </h3>
  <p className="text-[#7a5c5c] max-w-xl mx-auto mb-10 text-base sm:text-lg z-10 relative">
    Discover the holistic benefits that harmonize your mind, body, and soul.
  </p>

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto z-10 relative"> */}
    {/* Card 1 */}
    {/* <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:scale-105 transform transition duration-300 border-t-4 border-[#f3c1d9]">
      <h4 className="text-2xl mb-2">🧘‍♀️</h4>
      <h5 className="text-[#6B4F4F] font-semibold text-lg mb-1">Flexibility & Strength</h5>
      <p className="text-[#7a5c5c] text-sm">Improve posture and build lean muscle through mindful movement.</p>
    </div> */}

    {/* Card 2 */}
    {/* <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:scale-105 transform transition duration-300 border-t-4 border-[#f3c1d9]">
      <h4 className="text-2xl mb-2">🧠</h4>
      <h5 className="text-[#6B4F4F] font-semibold text-lg mb-1">Mental Clarity</h5>
      <p className="text-[#7a5c5c] text-sm">Breathwork and mindfulness bring calm and focus to your mind.</p>
    </div> */}

    {/* Card 3 */}
    {/* <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:scale-105 transform transition duration-300 border-t-4 border-[#f3c1d9]">
      <h4 className="text-2xl mb-2">💤</h4>
      <h5 className="text-[#6B4F4F] font-semibold text-lg mb-1">Better Sleep</h5>
      <p className="text-[#7a5c5c] text-sm">Create balance within to improve your natural sleep cycles.</p>
    </div>
  </div>
</section> */}

    </motion.div>
  );
};

export default Home;
