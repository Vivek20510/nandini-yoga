import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Users, Heart, Zap } from "lucide-react";

const CountUp = ({ end, duration = 2, prefix = "", suffix = "", start = false }) => {
  const [count, setCount] = useState(0);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!start || hasAnimatedRef.current) return;

    hasAnimatedRef.current = true;

    if (end === 0) {
      setCount(0);
      return;
    }

    let startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      setCount(Math.floor(end * progress));

      if (progress === 1) {
        clearInterval(timer);
        setCount(end);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [start, end, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const TrustIndicatorSection = () => {
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, {
    once: true,
    amount: 0.2,
  });

  const stats = [
    {
      id: 1,
      icon: Award,
      value: 3,
      suffix: "+",
      label: "International Certifications",
      description: "Patanjali Yogpeeth • Isha Foundation • Om Yoga International",
    },
    {
      id: 2,
      icon: Users,
      value: 500,
      suffix: "+",
      label: "Students Guided",
      description: "Across 15+ years of dedicated teaching",
    },
    {
      id: 3,
      icon: Heart,
      value: 15,
      suffix: "+",
      label: "Years of Teaching",
      description: "Continuous practice and evolution",
    },
    {
      id: 4,
      icon: Zap,
      value: 1,
      suffix: ":1",
      label: "Personal Attention",
      description: "Thoughtful guidance with space for adaptation and steady progress",
    },
  ];

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
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-r from-[#1D3C52] to-[#2A5470]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#8BA5B5]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#D5CFC0]/5 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-[10px] tracking-[0.22em] uppercase text-[#8BA5B5] font-semibold mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Why Nandini
            </span>
            <h2
              className="text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15] text-white"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Trusted by Practitioners
            </h2>
            <p className="mt-5 text-[15px] leading-[1.8] text-[#C8D8E0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              A proven track record of transforming lives through authentic yoga practice.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.id}
                  variants={itemVariants}
                  className="group relative"
                >
                  {/* Glassmorphism card */}
                  <div className="relative p-7 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 h-full overflow-hidden">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="inline-block p-3 rounded-lg bg-white/10 group-hover:bg-white/20 transition-all duration-300 mb-4">
                        <Icon size={24} className="text-[#E8D9C8]" />
                      </div>

                      {/* Number */}
                      <div className="mb-3">
                        <p
                          className="text-[clamp(2.2rem,5vw,3.2rem)] font-light leading-none text-white"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          <CountUp
                            end={stat.value}
                            suffix={stat.suffix}
                            duration={2.5}
                            start={sectionInView}
                          />
                        </p>
                      </div>

                      {/* Label */}
                      <p
                        className="text-[13px] font-semibold text-white mb-2"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {stat.label}
                      </p>

                      {/* Description */}
                      <p
                        className="text-[11.5px] leading-[1.6] text-[#A8BFC8]"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {stat.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicatorSection;
