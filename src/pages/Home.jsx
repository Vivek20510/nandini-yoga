import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import YogaAnimation from "../assets/yoga-animation.json";

const Home = () => {
  return (
    <motion.div
      className="font-serif text-[#1D3C52] bg-[#F4F1E1]"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      {/* HERO SECTION */}
<section className="min-h-screen bg-white flex items-center">
  <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    
    {/* LEFT CONTENT */}
    <div>
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-block mb-4 px-4 py-1 text-sm font-medium bg-gray-100 text-gray-600 rounded-full"
      >
        15+ Years of Teaching Experience
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight"
      >
        Transform Your Body. <br />
        Elevate Your Mind.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-6 text-lg text-gray-600 max-w-xl"
      >
        Guided yoga, breathwork, and meditation programs designed
        to bring balance, strength, and clarity into your everyday life.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-8 flex flex-wrap gap-4"
      >
        <Link
          to="/contact"
          className="px-6 py-3 rounded-xl bg-[#1D3C52] text-white font-medium hover:bg-[#163042] transition-all duration-300 shadow-md"
        >
          Explore Programs
        </Link>

        <Link
          to="/blog"
          className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all duration-300"
        >
          Read the Blog
        </Link>
      </motion.div>
    </div>

    {/* RIGHT SIDE LOTTIE */}
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="flex justify-center lg:justify-end"
    >
      <div className="w-72 sm:w-96">
        <Lottie animationData={YogaAnimation} loop autoplay />
      </div>
    </motion.div>
  </div>
</section>

{/* ABOUT SECTION */}
<section className="py-24 bg-gray-50">
  <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

    {/* LEFT SIDE - TEXT */}
    <div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-semibold text-gray-900"
      >
        Meet Nandini
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mt-6 text-lg text-gray-600 leading-relaxed"
      >
        Nandini Singh is a certified international yoga and meditation
        teacher with over 15 years of experience guiding students toward
        balance, strength, and inner clarity.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mt-4 text-gray-600 leading-relaxed"
      >
        Her approach blends classical yogic philosophy with modern
        mindfulness practices — creating transformative experiences
        for both beginners and advanced practitioners.
      </motion.p>
    </div>

    {/* RIGHT SIDE - CREDENTIAL CARDS */}
    <div className="space-y-6">
      {[
        {
          title: "Patanjali Yogpeeth",
          desc: "Ayurvedic & holistic wellness practices"
        },
        {
          title: "Isha Foundation",
          desc: "Inner Engineering & breathwork training"
        },
        {
          title: "Om Yoga International",
          desc: "Teacher training & yoga philosophy"
        }
      ].map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2, duration: 0.6 }}
          className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900">
            {item.title}
          </h3>
          <p className="mt-2 text-gray-600 text-sm">
            {item.desc}
          </p>
        </motion.div>
      ))}
    </div>

  </div>
</section>


{/* BENEFITS SECTION */}
<section className="py-24 bg-white">
  <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 text-center">

    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-3xl md:text-4xl font-semibold text-gray-900"
    >
      Why Practice With Nandini?
    </motion.h2>

    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="mt-4 text-gray-600 max-w-2xl mx-auto"
    >
      A holistic approach combining movement, breath, and awareness —
      designed to transform both body and mind.
    </motion.p>

    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        {
          title: "Reduce Stress",
          desc: "Breathwork techniques that calm the nervous system and restore balance."
        },
        {
          title: "Improve Flexibility",
          desc: "Guided asanas designed to safely increase mobility and strength."
        },
        {
          title: "Mental Clarity",
          desc: "Meditation practices that enhance focus and emotional stability."
        },
        {
          title: "Holistic Wellness",
          desc: "Integrating yogic philosophy into daily lifestyle for long-term health."
        }
      ].map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2, duration: 0.6 }}
          className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <h3 className="text-xl font-semibold text-gray-900">
            {item.title}
          </h3>
          <p className="mt-3 text-gray-600 text-sm leading-relaxed">
            {item.desc}
          </p>
        </motion.div>
      ))}
    </div>

  </div>
</section>
{/* PROGRAMS PREVIEW SECTION */}
<section className="py-24 bg-gray-50">
  <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
        Explore Our Programs
      </h2>
      <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
        Thoughtfully designed yoga and mindfulness programs 
        to support your personal transformation — online and offline.
      </p>
    </motion.div>

    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
      {[
        {
          title: "Beginner Yoga",
          desc: "A structured foundation program focusing on posture alignment, flexibility, and breath awareness.",
        },
        {
          title: "Meditation & Breathwork",
          desc: "Learn powerful breathing techniques and guided meditations for mental clarity and stress relief.",
        },
        {
          title: "Ayurveda Lifestyle",
          desc: "Discover holistic wellness principles to balance body, mind, and daily routines.",
        },
      ].map((program, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2, duration: 0.6 }}
          className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
        >
          <h3 className="text-xl font-semibold text-gray-900">
            {program.title}
          </h3>
          <p className="mt-4 text-gray-600 text-sm leading-relaxed">
            {program.desc}
          </p>

          <div className="mt-6">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-full">
              Coming Soon
            </span>
          </div>
        </motion.div>
      ))}
    </div>

  </div>
</section>
{/* NEWSLETTER SECTION */}
<section className="py-24 bg-white">
  <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">

    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-3xl md:text-4xl font-semibold text-gray-900"
    >
      Join the Wellness Community
    </motion.h2>

    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="mt-4 text-gray-600 max-w-2xl mx-auto"
    >
      Get mindful insights, yoga tips, and upcoming workshop updates 
      delivered directly to your inbox.
    </motion.p>

    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Enter your email address"
        required
        className="w-full sm:w-auto flex-1 px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1D3C52]"
      />

      <button
        type="submit"
        className="px-6 py-3 rounded-xl bg-[#1D3C52] text-white font-medium hover:bg-[#163042] transition-all duration-300 shadow-md"
      >
        Subscribe
      </button>
    </motion.form>

  </div>
</section>
    </motion.div>
  );
};

export default Home;
