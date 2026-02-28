import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import YogaAnimation from "../assets/yoga-animation.json";
import { Leaf, Flower, Sparkles } from "lucide-react";

const Home = () => {
  return (
    <motion.div
      className="font-serif text-[#1D3C52] bg-[#F4F1E1]"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-[#F5EBDD] to-[#FFFDF8] relative overflow-hidden">
        {/* Subtle Background Icons */}
        <Leaf className="absolute top-12 left-6 text-[#F26B38] opacity-10 w-14 h-14 animate-spin-slow" />
        <Flower className="absolute bottom-16 right-6 text-[#1D3C52] opacity-10 w-20 h-20 animate-pulse" />

        {/* Heading */}
        <motion.h1
          className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight z-10 text-[#1D3C52]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          Yoga by Nandini
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="mt-5 text-base sm:text-lg md:text-xl text-[#2E2E2E] max-w-2xl z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Breathe in calm. Breathe out stress. Welcome to your inner sanctuary.
        </motion.p>

        {/* Animation */}
        <motion.div
          className="mt-10 w-40 sm:w-52 h-40 sm:h-52 rounded-full border-4 border-[#F26B38] shadow-xl bg-white p-3 flex items-center justify-center z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <Lottie animationData={YogaAnimation} loop autoplay className="w-full h-full" />
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <Link
            to="/contact"
            className="mt-10 inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-[#F26B38] text-white text-base sm:text-lg font-semibold hover:bg-[#1D3C52] transition-all duration-300 shadow-lg z-10"
          >
            <Sparkles className="w-5 h-5" />
            Let’s Connect
          </Link>
        </motion.div>
      </section>

      {/* About Preview Section */}
      <section className="py-16 px-5 sm:px-10 md:px-20 text-center bg-[#F4F1E1]">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1D3C52]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Meet Nandini
        </motion.h2>

        <motion.p
          className="max-w-3xl mx-auto mt-6 text-[#2E2E2E] text-sm sm:text-base md:text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <span className="italic text-[#A8D5BA]">
            “Yoga is the perfume of peace — it lingers long after the practice.”
          </span>
          <br /><br />
          Nandini Singh is a certified international yoga and meditation teacher with 15+ years of experience. Her wisdom blends classical yogic traditions with present-day mindfulness for the modern seeker.
          <br /><br />
          Her journey has led her to train at:
          <br /><br />
          <strong>Patanjali Yogpeeth</strong> – Ayurvedic & holistic practices.<br />
          <strong>Isha Foundation</strong> – Inner Engineering & breathwork.<br />
          <strong>Om Yoga International</strong> – Teacher training & yoga philosophy.
        </motion.p>
      </section>
    </motion.div>
  );
};

export default Home;
