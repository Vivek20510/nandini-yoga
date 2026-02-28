import React from "react";
import { motion } from "framer-motion";
import { Heart, GraduationCap, Sparkles, Flower, Lightbulb } from "lucide-react";

const About = () => {
  return (
    <motion.section
      className="min-h-screen bg-gradient-to-b from-[#FFFDF8] to-[#F5EBDD] px-6 sm:px-10 py-16 font-serif text-[#1D3C52]"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="text-center mb-16">
        <Heart className="mx-auto w-12 h-12 text-[#F26B38] animate-bounce" />
        <h1 className="text-4xl sm:text-5xl font-bold mt-4">Meet Nandini</h1>
        <p className="mt-4 text-lg sm:text-xl text-[#A8D5BA] italic">
          “Yoga is the perfume of peace — it lingers long after the practice.”
        </p>
      </div>

      {/* Bio Section */}
      <motion.div
        className="max-w-5xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-lg sm:text-xl leading-relaxed text-[#2E2E2E]">
          Nandini Singh is a <strong>globally certified yoga teacher</strong> with over 15 years of experience. Her sessions are a sanctuary where ancient yogic wisdom meets mindful modernity, crafted for seekers of all ages.
        </p>
      </motion.div>

      {/* Training & Journey Timeline */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-14"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        {/* Training Card */}
        <div className="bg-white border border-[#E1D5C9] p-6 rounded-xl shadow-md">
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
            <GraduationCap className="w-5 h-5 text-[#F26B38]" />
            Training & Certification
          </h3>
          <ul className="list-disc pl-5 space-y-3 text-[#2E2E2E]">
            <li>
              <strong>Patanjali Yogpeeth:</strong> Ayurvedic healing & pranayama.
            </li>
            <li>
              <strong>Isha Foundation:</strong> Inner Engineering & Hatha Yoga.
            </li>
            <li>
              <strong>Om Yoga International:</strong> 500-hour teacher training.
            </li>
          </ul>
        </div>

        {/* Journey Timeline */}
        <div className="bg-white border border-[#E1D5C9] p-6 rounded-xl shadow-md">
          <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
            <Flower className="w-5 h-5 text-[#A8D5BA]" />
            Her Journey
          </h3>
          <ol className="relative border-l border-[#A8D5BA] space-y-4 pl-5 text-[#2E2E2E]">
            <li>
              <span className="font-semibold">2008:</span> Started spiritual studies in Rishikesh.
            </li>
            <li>
              <span className="font-semibold">2012:</span> Certified in Hatha Yoga and Ayurveda.
            </li>
            <li>
              <span className="font-semibold">2016:</span> Began international teaching and workshops.
            </li>
            <li>
              <span className="font-semibold">2023:</span> Founded “Yoga by Nandini” platform.
            </li>
          </ol>
        </div>
      </motion.div>

      {/* Philosophy Highlights */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {[
          {
            title: "Mindful Movement",
            icon: <Sparkles className="w-5 h-5 text-[#F26B38]" />,
            desc: "Each class blends breath with movement for inner peace.",
          },
          {
            title: "Holistic Healing",
            icon: <Heart className="w-5 h-5 text-[#A8D5BA]" />,
            desc: "Integrates yoga, meditation, and Ayurveda for full-body harmony.",
          },
          {
            title: "Personal Growth",
            icon: <Lightbulb className="w-5 h-5 text-[#F26B38]" />,
            desc: "Guides students on a soulful path to clarity and joy.",
          },
        ].map(({ title, icon, desc }, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-3">
              {icon}
              <h4 className="text-lg font-semibold">{title}</h4>
            </div>
            <p className="text-sm text-[#2E2E2E]">{desc}</p>
          </div>
        ))}
      </motion.div>

      {/* Quote / Outro */}
      <motion.div
        className="bg-[#F26B38] text-white text-center p-8 rounded-3xl max-w-3xl mx-auto shadow-lg"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <p className="text-lg sm:text-xl italic">
          “Each breath is a brushstroke painting your inner canvas with peace, balance, and joy.”
        </p>
      </motion.div>
    </motion.section>
  );
};

export default About;
