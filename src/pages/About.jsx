import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Sparkles, Lightbulb } from "lucide-react";

const About = () => {
  return (
    <motion.section
      className="min-h-screen bg-white px-6 sm:px-10 md:px-16 lg:px-24 py-16 sm:py-20 text-gray-900"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold">
            Meet Nandini
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto italic text-sm sm:text-base">
            “Yoga is the perfume of peace — it lingers long after the practice.”
          </p>
        </div>

        {/* Bio Section */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Nandini Singh is a <strong>globally certified yoga teacher</strong> 
             with over 15 years of experience. Her sessions blend ancient yogic
            wisdom with modern mindfulness practices — creating a space where
            students experience strength, balance, and inner clarity.
          </p>
        </div>

        {/* Training & Journey */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">

          {/* Training */}
          <div>
            <h3 className="flex items-center gap-3 text-xl font-semibold mb-6">
              <GraduationCap size={20} className="text-[#1D3C52]" />
              Training & Certification
            </h3>

            <ul className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
              <li><strong>Patanjali Yogpeeth:</strong> Ayurvedic healing & pranayama.</li>
              <li><strong>Isha Foundation:</strong> Inner Engineering & Hatha Yoga.</li>
              <li><strong>Om Yoga International:</strong> 500-hour teacher training.</li>
            </ul>
          </div>

          {/* Journey */}
          <div>
            <h3 className="text-xl font-semibold mb-6">
              Professional Journey
            </h3>

            <ul className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
              <li><strong>2008:</strong> Began spiritual studies in Rishikesh.</li>
              <li><strong>2012:</strong> Certified in Hatha Yoga and Ayurveda.</li>
              <li><strong>2016:</strong> Started international teaching & workshops.</li>
              <li><strong>2023:</strong> Founded “Yoga by Nandini”.</li>
            </ul>
          </div>

        </div>

        {/* Philosophy Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">

          {[
            {
              title: "Mindful Movement",
              icon: <Sparkles size={18} className="text-[#1D3C52]" />,
              desc: "Each class integrates breath with movement to cultivate presence and calm."
            },
            {
              title: "Holistic Healing",
              icon: <Lightbulb size={18} className="text-[#1D3C52]" />,
              desc: "A balanced integration of yoga, meditation, and lifestyle practices."
            },
            {
              title: "Personal Growth",
              icon: <Sparkles size={18} className="text-[#1D3C52]" />,
              desc: "Guiding students toward clarity, resilience, and emotional balance."
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex items-center gap-2 mb-3">
                {item.icon}
                <h4 className="text-base font-semibold">{item.title}</h4>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}

        </div>

        {/* Closing Quote */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-lg sm:text-xl italic text-gray-700 leading-relaxed">
            “Each breath is a brushstroke painting your inner canvas 
            with peace, balance, and joy.”
          </p>
        </div>

      </div>
    </motion.section>
  );
};

export default About;