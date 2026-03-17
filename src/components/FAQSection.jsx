import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const FAQ_ITEMS = [
  {
    id: 1,
    question: "Is yoga suitable for complete beginners?",
    answer: "Absolutely! Our Beginner Yoga program is specifically designed for people with no prior experience. We focus on foundational poses with proper alignment cues. Nandini tailors modifications for every body type, so you progress at your own pace.",
    category: "beginner",
  },
  {
    id: 2,
    question: "What should I wear to a yoga class?",
    answer: "Wear comfortable, breathable clothing that allows free movement. Many students prefer yoga-specific wear, but regular athletic clothing works fine. Bring a yoga mat (or we can provide one) and a water bottle. Classes are barefoot.",
    category: "beginner",
  },
  {
    id: 3,
    question: "How long does it take to see results?",
    answer: "Many students experience reduced stress and improved flexibility within 2-3 weeks. Strength building and deeper mind-body benefits develop over 8-12 weeks. Consistency matters more than duration-a 20-minute daily practice beats sporadic long sessions.",
    category: "progress",
  },
  {
    id: 4,
    question: "Can I do yoga if I have injuries or joint pain?",
    answer: "Yes, but inform Nandini about any injuries before class. Yoga is highly adaptable-she'll suggest modifications to work safely around limitations. In fact, therapeutic yoga often helps with recovery when done correctly.",
    category: "health",
  },
  {
    id: 5,
    question: "What's the difference between online and in-person classes?",
    answer: "Online classes offer flexibility and comfort from home. In-person classes allow for hands-on alignment adjustments and a community atmosphere. Both are equally effective-choose based on your schedule and preference.",
    category: "logistics",
  },
  {
    id: 6,
    question: "How do I get started with meditation?",
    answer: "Start with our Pranayama & Meditation program. We begin with simple breathing techniques to calm the nervous system, then progress to guided meditation. Even 5 minutes daily creates noticeable mental clarity within weeks.",
    category: "meditation",
  },
];

const FAQSection = () => {
  const [openId, setOpenId] = useState(null);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-32 bg-[#F0EDE0]">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-[10px] tracking-[0.22em] uppercase text-[#8BA5B5] font-semibold mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Questions?
            </span>
            <h2
              className="text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15] text-[#1D3C52]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Frequently Asked
            </h2>
            <p className="mt-5 text-[15px] leading-[1.8] text-[#5A7485]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Get answers to common questions about our programs and practices.
            </p>
          </motion.div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full group"
              >
                <div
                  className={`w-full p-6 rounded-2xl border transition-all duration-300 text-left ${
                    openId === faq.id
                      ? "bg-white border-[#1D3C52]/20 shadow-lg"
                      : "bg-white/50 border-[#E8E4D8] hover:border-[#1D3C52]/10 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3
                      className="text-[16px] font-semibold text-[#1D3C52] leading-snug flex-1"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openId === faq.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 mt-1"
                    >
                      <ChevronDown
                        size={20}
                        className={`text-[#8BA5B5] group-hover:text-[#1D3C52] transition-colors ${
                          openId === faq.id ? "text-[#1D3C52]" : ""
                        }`}
                      />
                    </motion.div>
                  </div>
                </div>
              </button>

              {/* Answer */}
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0">
                      <p
                        className="text-[14.5px] leading-[1.8] text-[#5A7485]"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-[#1D3C52]/5 to-[#D27D56]/5 border border-[#D5CFC0]/40 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-[15px] text-[#5A7485] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Didn't find your answer?
          </p>
          <a
            href="/contact"
            className="inline-block px-7 py-3 rounded-full bg-[#1D3C52] text-white text-[13px] tracking-[0.1em] uppercase font-medium hover:bg-[#2A5470] transition-all duration-300"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Get in Touch
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
