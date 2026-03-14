import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Filter, Play } from "lucide-react";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const GallerySection = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [hoveredId, setHoveredId] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      const querySnapshot = await getDocs(collection(db, 'gallery'));
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        category: doc.data().category,
        title: doc.data().title,
        image: doc.data().imageUrl,
        isVideo: doc.data().isVideo,
      }));
      setGalleryItems(docs);
    };
    fetchGallery();
  }, []);

  const filters = [
    { label: "All", value: "all" },
    { label: "Classes", value: "class" },
    { label: "Events", value: "event" },
    { label: "Workshops", value: "workshop" },
  ];

  const filtered =
    activeFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="py-32 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-[10px] tracking-[0.22em] uppercase text-[#8BA5B5] font-semibold mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Gallery
            </span>
            <h2
              className="text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15] text-[#1D3C52]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Classes & Events
            </h2>
            <p className="mt-5 text-[15px] leading-[1.8] text-[#5A7485]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Explore our vibrant community through photos and videos of classes, retreats, and workshops.
            </p>
          </motion.div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-14">
          {filters.map((filter) => (
            <motion.button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-6 py-2.5 rounded-full text-[12px] tracking-[0.08em] uppercase font-semibold transition-all duration-300 ${
                activeFilter === filter.value
                  ? "bg-[#1D3C52] text-white shadow-lg shadow-[#1D3C52]/20"
                  : "bg-white text-[#1D3C52] border border-[#E8E4D8] hover:border-[#1D3C52]"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter size={14} className="inline mr-2" />
              {filter.label}
            </motion.button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
            >
              {/* Image with overlay */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Dark overlay on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-[#1D3C52]/80 via-[#1D3C52]/40 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredId === item.id ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Content - visible on hover */}
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: hoveredId === item.id ? 1 : 0,
                  y: hoveredId === item.id ? 0 : 20,
                }}
                transition={{ duration: 0.3 }}
              >
                {item.isVideo && (
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-all">
                    <Play size={28} className="text-white fill-white" />
                  </div>
                )}

                <h3 className="text-white text-center text-[18px] font-semibold px-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {item.title}
                </h3>

                <span className="text-white/80 text-[11px] tracking-[0.1em] uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </span>
              </motion.div>

              {/* Corner badge */}
              <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] tracking-[0.1em] uppercase font-semibold text-[#1D3C52]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {item.category === "class" && "Class"}
                {item.category === "event" && "Event"}
                {item.category === "workshop" && "Workshop"}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <button className="px-8 py-4 rounded-full bg-[#1D3C52] text-white text-[13px] tracking-[0.1em] uppercase font-medium hover:bg-[#2A5470] transition-all duration-300 shadow-lg shadow-[#1D3C52]/20" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            View All in Gallery
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;
