import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Lottie from "lottie-react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import YogaAnimation from "../assets/yoga-animation.json";
import TestimonialsSection from "../components/TestimonialsSection";
import GallerySection from "../components/GallerySection";
import FAQSection, { FAQ_ITEMS } from "../components/FAQSection";
import TrustIndicatorSection from "../components/TrustIndicatorsSection";
import NewsletterSection from "../components/NewsletterSection";
import SEO from "../components/SEO";
import { db } from "../firebase";
import {
  PERSON_NAME,
  SITE_DESCRIPTION,
  SITE_IMAGE,
  SITE_NAME,
  SITE_URL,
} from "../lib/site";

/* ─────────── FADE-UP HELPER ─────────── */
const FadeUp = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ─────────── SECTION LABEL ─────────── */
const Label = ({ children }) => (
  <span
    className="inline-block text-[10px] tracking-[0.22em] uppercase text-[#8BA5B5] font-semibold mb-4"
    style={{ fontFamily: "'DM Sans', sans-serif" }}
  >
    {children}
  </span>
);

/* ═══════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════ */
const Home = () => {
  const heroRef = useRef(null);
  const [latestPosts, setLatestPosts] = useState([]);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const postsRef = collection(db, "posts");
        const latestQuery = query(postsRef, orderBy("date", "desc"));
        const querySnapshot = await getDocs(latestQuery);
        const posts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLatestPosts(posts.slice(0, 3));
      } catch (error) {
        setLatestPosts([]);
      }
    };
    fetchLatestPosts();
  }, []);

  const homeDescription =
    "Explore online yoga classes, pranayama, meditation, and mindful living guidance with Nandini Singh. Beginner-friendly private yoga sessions, breathwork support, and holistic wellness programs.";

  const homeSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: SITE_IMAGE,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: PERSON_NAME,
      jobTitle: "Yoga and Meditation Teacher",
      url: SITE_URL,
      image: SITE_IMAGE,
      worksFor: {
        "@type": "Organization",
        name: SITE_NAME,
      },
      description:
        "Certified yoga and meditation teacher offering online yoga, pranayama, meditation, and mindful living guidance.",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <div className="font-serif bg-[#FAFAF7] text-[#1D3C52] overflow-x-hidden">
      <SEO
        title="Online Yoga Classes, Meditation and Pranayama with Nandini Singh"
        description={homeDescription}
        canonicalPath="/"
        schema={homeSchema}
      />

      {/* ═══════════════════════
          HERO
      ═══════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] flex items-center bg-[#F4F1E6] overflow-hidden"
      >
        {/* Decorative blobs — hidden on very small screens */}
        <div className="absolute right-0 top-0 w-[70vw] sm:w-[55vw] h-[70vw] sm:h-[55vw] rounded-full bg-[#E8E2D0]/50 -translate-y-1/4 translate-x-1/4 pointer-events-none" />
        <div className="hidden sm:block absolute right-[8%] bottom-[10%] w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#D6CDB8]/40 pointer-events-none" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-20 pt-24 pb-20 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
        >
          {/* ── Left column ── */}
          <div className="relative z-10 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-5 flex justify-center lg:justify-start"
            >
              <Label>15+ Years of Teaching</Label>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(2.1rem,7vw,4.5rem)] font-normal leading-[1.1] text-[#1D3C52] tracking-[-0.01em]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Private yoga and mindful living
              <br />
              <em className="italic text-[#6B8A9A]">guided online with depth and calm</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="mt-6 text-[14.5px] sm:text-[16px] leading-[1.8] text-[#5A7485] max-w-md mx-auto lg:mx-0"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}
            >
              Online yoga classes, pranayama, and meditation sessions designed for beginners,
              busy professionals, and mindful practitioners who want steadiness, mobility, and
              calm. Work with Nandini through private guidance, small groups, and holistic
              wellness programs.
            </motion.p>

            {/* Tag pill */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.75 }}
              className="mt-5 inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 rounded-full border border-[#D8D2C4] bg-white/70 px-4 py-2 text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-[#6B8A9A]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <span>Beginner-friendly</span>
              <span className="text-[#C5BCA8]">•</span>
              <span>Online yoga classes</span>
              <span className="text-[#C5BCA8]">•</span>
              <span>Private meditation coaching</span>
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-5"
            >
              <Link
                to="/contact"
                className="group w-full sm:w-auto text-center px-7 py-3.5 rounded-full bg-[#1D3C52] text-white text-[12px] sm:text-[13px] tracking-[0.1em] uppercase font-medium hover:bg-[#2A5470] active:scale-95 transition-all duration-300 shadow-lg shadow-[#1D3C52]/20"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Book a Class
                <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                to="/contact"
                className="text-[12px] sm:text-[13px] tracking-[0.08em] uppercase text-[#8BA5B5] hover:text-[#1D3C52] transition-colors duration-300 font-medium underline underline-offset-4 decoration-[#C5BCA8]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Contact Nandini
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.8 }}
              className="mt-10 sm:mt-12 flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-8 pt-7 sm:pt-8 border-t border-[#D8D2C4]"
            >
              {[
                { num: "15+", label: "Years Teaching" },
                { num: "500+", label: "Students Guided" },
                { num: "Online + Offline", label: "Session Modes" },
              ].map((s) => (
                <div key={s.label} className="text-center lg:text-left">
                  <p
                    className="text-xl sm:text-2xl font-semibold text-[#1D3C52]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {s.num}
                  </p>
                  <p
                    className="text-[10px] sm:text-[11px] tracking-[0.14em] uppercase text-[#8BA5B5] mt-1"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right column — Lottie ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end relative order-first lg:order-last"
          >
            <div className="absolute inset-0 rounded-full bg-[#E0D9C8]/30 blur-3xl scale-90" />
            {/* Responsive sizing: smaller on mobile, grows up */}
            <div className="relative w-[200px] xs:w-[240px] sm:w-[320px] md:w-[360px] lg:w-[420px]">
              <Lottie animationData={YogaAnimation} loop autoplay />
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span
            className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#A09880]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-6 sm:h-8 bg-gradient-to-b from-[#A09880] to-transparent"
          />
        </motion.div>
      </section>

      {/* ═══════════════════════
          PHILOSOPHY MARQUEE STRIP
      ═══════════════════════ */}
      <section className="py-8 sm:py-10 bg-[#1D3C52] overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="flex gap-8 sm:gap-12 whitespace-nowrap"
        >
          {Array.from({ length: 4 })
            .flatMap(() => [
              "Pranayama","·","Asana","·","Meditation","·",
              "Ayurveda","·","Dharana","·","Samadhi","·",
            ])
            .map((w, i) => (
              <span
                key={i}
                className={`text-[11px] sm:text-[13px] tracking-[0.18em] uppercase ${
                  w === "·" ? "text-[#8BA5B5]" : "text-[#C8D8E0]"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {w}
              </span>
            ))}
        </motion.div>
      </section>

      {/* ═══════════════════════
          TRUST INDICATORS
      ═══════════════════════ */}
      <TrustIndicatorSection />

      {/* ═══════════════════════
          ABOUT / MEET NANDINI
      ═══════════════════════ */}
      <section className="py-20 sm:py-28 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left */}
          <div>
            <FadeUp>
              <Label>About</Label>
              <h2
                className="text-[clamp(1.8rem,5vw,3.2rem)] font-normal leading-[1.15] text-[#1D3C52]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Meet Nandini Singh
              </h2>
            </FadeUp>

            <FadeUp delay={0.15}>
              <p
                className="mt-5 text-[14.5px] sm:text-[15.5px] leading-[1.9] text-[#5A7485]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Nandini Singh is a certified international yoga and meditation teacher with over 15
                years of experience guiding students toward balance, strength, and inner clarity. Born
                and raised in India, her roots in yogic tradition run deep.
              </p>
              <p
                className="mt-4 text-[14.5px] sm:text-[15.5px] leading-[1.9] text-[#5A7485]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Her approach blends classical yogic philosophy — rooted in Patanjali's Ashtanga system
                — with accessible, modern mindfulness practices. Whether you're a complete beginner or
                an advanced practitioner, she meets you where you are.
              </p>
            </FadeUp>

            <FadeUp delay={0.25}>
              <div className="mt-8">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-[12px] sm:text-[13px] tracking-[0.1em] uppercase text-[#1D3C52] font-semibold hover:gap-4 transition-all duration-300 border-b border-[#1D3C52] pb-1"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Full Story →
                </Link>
              </div>
            </FadeUp>
          </div>

          {/* Right — Training cards */}
          <div className="space-y-4 pt-0 lg:pt-2">
            <FadeUp>
              <Label>Training & Certifications</Label>
            </FadeUp>
            {[
              {
                title: "Patanjali Yogpeeth",
                location: "Haridwar, India",
                desc: "Residential yoga & Ayurvedic wellness immersion under traditional gurukul training.",
              },
              {
                title: "Isha Foundation",
                location: "Coimbatore, India",
                desc: "Inner Engineering program and Hatha yoga teacher certification under Sadhguru's lineage.",
              },
              {
                title: "Om Yoga International",
                location: "Rishikesh, India",
                desc: "200-hr & 300-hr teacher training in classical Hatha, Vinyasa, and yogic philosophy.",
              },
            ].map((item, i) => (
              <FadeUp key={i} delay={i * 0.12}>
                <div className="group bg-white border border-[#E8E4D8] rounded-2xl p-5 sm:p-6 hover:border-[#A8BDC8] hover:shadow-md transition-all duration-400 active:scale-[0.99]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3
                        className="text-[15px] sm:text-[16px] font-semibold text-[#1D3C52] leading-snug"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-[10px] sm:text-[11px] tracking-[0.14em] uppercase text-[#8BA5B5] mt-1"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {item.location}
                      </p>
                    </div>
                    <span className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 rounded-full border border-[#E8E4D8] flex items-center justify-center group-hover:border-[#1D3C52] transition-colors duration-300">
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2 10 L10 2 M10 2 H4 M10 2 V8" stroke="#1D3C52" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  </div>
                  <p
                    className="mt-3 text-[13px] sm:text-[13.5px] leading-[1.75] text-[#6B8A9A]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════
          OFFERINGS
      ═══════════════════════ */}
      <section className="py-20 sm:py-24 bg-[#F0EDE0]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-20">

          <div className="text-center max-w-2xl mx-auto px-2">
            <FadeUp>
              <Label>Offerings</Label>
              <h2
                className="text-[clamp(1.8rem,5vw,3.2rem)] font-normal leading-[1.15] text-[#1D3C52]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                A Path for Every Practitioner
              </h2>
              <p
                className="mt-4 text-[14px] sm:text-[15px] leading-[1.9] text-[#5A7485]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Thoughtfully designed programs rooted in tradition, adapted for modern life —
                available online and in-person.
              </p>
            </FadeUp>
          </div>

          {/* Cards — single col on mobile, 3-col on md+ */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                num: "01",
                title: "Beginner Yoga",
                tag: "Beginners",
                desc: "A calm, structured introduction to movement, alignment, and breathing for people starting fresh or returning after a long pause.",
                detail: "Foundational series · Online & in-person",
              },
              {
                num: "02",
                title: "Pranayama & Meditation",
                tag: "Stress Relief",
                desc: "Breath-led sessions for nervous system balance, improved focus, and a steadier daily rhythm at work and at home.",
                detail: "Private guidance · Ongoing support",
              },
              {
                num: "03",
                title: "Ayurveda & Lifestyle",
                tag: "Lifestyle Balance",
                desc: "Practical routines, rest, and seasonal wellness guidance designed to support energy, digestion, sleep, and long-term consistency.",
                detail: "Workshops & consultations · By enquiry",
              },
            ].map((p, i) => (
              <FadeUp key={i} delay={i * 0.15}>
                <div className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-[#E0D9C8] hover:border-[#1D3C52]/20 hover:shadow-xl transition-all duration-500 h-full flex flex-col active:scale-[0.99]">
                  <div className="flex items-start justify-between mb-5 sm:mb-6">
                    <span
                      className="text-[10px] tracking-[0.2em] uppercase text-[#8BA5B5] font-medium"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {p.tag}
                    </span>
                    <span
                      className="text-[2.2rem] sm:text-[2.8rem] font-light text-[#E8E4D8] leading-none select-none"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {p.num}
                    </span>
                  </div>

                  <h3
                    className="text-[1.2rem] sm:text-[1.4rem] font-semibold text-[#1D3C52] leading-tight mb-3 sm:mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {p.title}
                  </h3>

                  <p
                    className="text-[13.5px] leading-[1.8] text-[#6B8A9A] flex-1"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {p.desc}
                  </p>

                  <div className="mt-5 pt-4 sm:pt-5 border-t border-[#EDE8DC] flex flex-wrap items-center justify-between gap-2">
                    <span
                      className="text-[10px] sm:text-[11px] tracking-[0.12em] uppercase text-[#A09880]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {p.detail}
                    </span>
                    <Link
                      to="/contact"
                      className="text-[12px] text-[#1D3C52] underline underline-offset-2 hover:text-[#2A5470] transition-colors"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Enquire
                    </Link>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════
          WHO THIS IS FOR
      ═══════════════════════ */}
      <section className="py-20 sm:py-24 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start">

            {/* Text block */}
            <div>
              <FadeUp>
                <Label>Who This Is For</Label>
                <h2
                  className="text-[clamp(1.75rem,5vw,3rem)] font-normal leading-[1.15] text-[#1D3C52]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Practice that meets
                  <br />
                  <em className="italic text-[#8BA5B5]">real life where it is</em>
                </h2>
                <p
                  className="mt-5 text-[14.5px] sm:text-[15px] leading-[1.85] text-[#5A7485] max-w-xl"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Whether you are beginning from scratch, returning after a break, or looking for
                  a quieter and more sustainable way to practice, the work is adapted to your body,
                  schedule, and stage of life.
                </p>
              </FadeUp>
            </div>

            {/* Cards — 2-col grid on sm+, single col on xs */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6">
              {[
                {
                  title: "Working professionals",
                  desc: "For people carrying stress, long sitting hours, or mental fatigue who need grounded routines that are realistic to maintain.",
                },
                {
                  title: "Complete beginners",
                  desc: "For anyone who wants patient guidance, clear foundations, and a practice that feels safe rather than intimidating.",
                },
                {
                  title: "Women seeking balance",
                  desc: "For those wanting supportive movement, breathwork, and steadier daily rhythms through different life phases.",
                },
                {
                  title: "Mindful practitioners",
                  desc: "For students who want more than exercise and are drawn to breath, philosophy, and a slower inward approach.",
                },
              ].map((item, i) => (
                <FadeUp key={item.title} delay={i * 0.1}>
                  <div className="h-full rounded-2xl border border-[#E8E4D8] bg-white p-5 sm:p-7 hover:border-[#A8BDC8] hover:shadow-md transition-all duration-300 active:scale-[0.99]">
                    <h3
                      className="text-[1.05rem] sm:text-[1.2rem] font-semibold text-[#1D3C52]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="mt-2 sm:mt-3 text-[13px] sm:text-[13.5px] leading-[1.8] text-[#6B8A9A]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-white border-y border-[#E8E4D8]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 lg:px-20">
          <FadeUp className="max-w-4xl">
            <Label>Online Yoga Guidance</Label>
            <h2
              className="text-[clamp(1.9rem,4.5vw,3rem)] font-normal leading-[1.18] text-[#1D3C52]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Looking for online yoga classes, guided meditation, or pranayama support?
            </h2>
            <p
              className="mt-5 text-[14.5px] sm:text-[15.5px] leading-[1.9] text-[#5A7485]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Yoga By Nandini supports students who want more than a workout. Sessions combine
              traditional yoga practice, breathwork, meditation, and mindful lifestyle guidance
              for people building a calmer, stronger routine at home.
            </p>
            <p
              className="mt-4 text-[14.5px] sm:text-[15.5px] leading-[1.9] text-[#5A7485]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              You can begin with beginner yoga classes, private online yoga sessions, meditation
              coaching, or pranayama practices that help with stress, mobility, focus, sleep, and
              consistency. The approach is personal, beginner-friendly, and rooted in Indian yogic
              tradition rather than trend-driven routines.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-[#EAF1EF]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-16 items-center rounded-[2rem] border border-[#D4DFDB] bg-white/70 p-8 sm:p-10 md:p-12 shadow-[0_20px_70px_rgba(29,60,82,0.06)]">
            <FadeUp>
              <Label>New</Label>
              <h2
                className="text-[clamp(1.8rem,5vw,3.2rem)] font-normal leading-[1.15] text-[#1D3C52]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Mood-based meditation,
                <br />
                <em className="italic text-[#6B8A9A]">created for how you feel today</em>
              </h2>
              <p
                className="mt-5 text-[14.5px] sm:text-[15.5px] leading-[1.9] text-[#5A7485]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Choose a mood like anxious, overthinking, tired, or angry, or describe your own
                feeling. The meditation tool creates a custom script with breath pacing, focus,
                playback, and a mindful timer in just a few seconds.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <Link
                  to="/meditation"
                  className="inline-flex items-center justify-center rounded-full bg-[#1D3C52] px-7 py-3.5 text-[12px] sm:text-[13px] uppercase tracking-[0.1em] text-white shadow-lg shadow-[#1D3C52]/20 transition-all duration-300 hover:bg-[#2A5470] active:scale-95"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Try AI Meditation
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-[#C6D6D1] px-7 py-3.5 text-[12px] sm:text-[13px] uppercase tracking-[0.1em] text-[#1D3C52] transition-all duration-300 hover:border-[#1D3C52] active:scale-95"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Get Personal Guidance
                </Link>
              </div>
            </FadeUp>

            <FadeUp delay={0.12}>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: "Custom script",
                    desc: "AI shapes a short guided meditation around your current feeling and selected duration.",
                  },
                  {
                    title: "Breath pacing",
                    desc: "Each session includes a breathing rhythm, focus point, and gentle tonal direction.",
                  },
                  {
                    title: "Voice + timer",
                    desc: "Listen with browser voice playback or simply read along with the built-in timer.",
                  },
                  {
                    title: "Return anytime",
                    desc: "Your recent meditations stay saved on your device so you can revisit them later.",
                  },
                ].map((item, i) => (
                  <div
                    key={item.title}
                    className={`rounded-3xl border border-[#D9E2DD] bg-[#F8FBFA] p-5 sm:p-6 ${i === 0 ? "sm:translate-y-6" : ""}`}
                  >
                    <p
                      className="text-[10px] tracking-[0.18em] uppercase text-[#8BA5B5]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Meditation Tool
                    </p>
                    <h3
                      className="mt-3 text-[1.1rem] sm:text-[1.25rem] font-semibold text-[#1D3C52]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="mt-2 text-[13.5px] leading-[1.8] text-[#5A7485]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ═══════════════════════
          GALLERY SECTION
      ═══════════════════════ */}
      <GallerySection />

      {/* ═══════════════════════
          TEACHING APPROACH (dark)
      ═══════════════════════ */}
      <section className="py-20 sm:py-24 bg-[#1D3C52]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-16 items-start">

            <FadeUp>
              <Label>Teaching Approach</Label>
              <h2
                className="text-[clamp(1.7rem,4.5vw,2.8rem)] font-normal leading-[1.2] text-[#E8F0F4]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Rooted in tradition,
                <br />
                <em className="italic text-[#AFC3CD]">adapted for modern life</em>
              </h2>
            </FadeUp>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6">
              {[
                {
                  title: "Calm progression",
                  desc: "Sessions are built with patience, clear sequencing, and adaptations so progress feels steady rather than overwhelming.",
                },
                {
                  title: "Breath before intensity",
                  desc: "Breathwork and awareness stay central, helping students build a practice that supports the nervous system as much as the body.",
                },
                {
                  title: "Personal guidance",
                  desc: "The work is shaped around your lifestyle, goals, and experience level instead of using one fixed template for everyone.",
                },
                {
                  title: "Practice you can keep",
                  desc: "The focus is not perfection but consistency, so the benefits continue beyond the mat and into daily life.",
                },
              ].map((item, i) => (
                <FadeUp key={item.title} delay={i * 0.1}>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-7 backdrop-blur-sm hover:border-white/20 transition-all duration-300">
                    <h3
                      className="text-[1rem] sm:text-[1.1rem] font-semibold text-[#F0F5F7]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="mt-2 sm:mt-3 text-[13px] sm:text-[13.5px] leading-[1.75] text-[#B9CBD2]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════
          TESTIMONIALS
      ═══════════════════════ */}
      <TestimonialsSection />

      {/* ═══════════════════════
          MID CTA
      ═══════════════════════ */}
      <section className="py-16 sm:py-20 bg-[#F4F1E6]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 md:px-12 text-center">
          <FadeUp>
            <Label>Ready to Begin</Label>
            <h2
              className="text-[clamp(1.7rem,4.5vw,2.8rem)] font-normal leading-[1.2] text-[#1D3C52]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Start with a conversation,
              <br />
              <em className="italic text-[#8BA5B5]">not pressure</em>
            </h2>
            <p
              className="mt-4 sm:mt-5 text-[14.5px] sm:text-[15px] leading-[1.85] text-[#5A7485] max-w-2xl mx-auto"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              If you are unsure where to start, reach out with your goals, schedule, or questions.
              We can find the right format for your practice together.
            </p>

            {/* CTA buttons — stack on mobile */}
            <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#1D3C52] px-7 py-3.5 text-[12px] sm:text-[13px] uppercase tracking-[0.1em] text-white shadow-lg shadow-[#1D3C52]/20 transition-all duration-300 hover:bg-[#2A5470] active:scale-95"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Contact for Classes <span>→</span>
              </Link>
              <Link
                to="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#D8D2C4] px-7 py-3.5 text-[12px] sm:text-[13px] uppercase tracking-[0.1em] text-[#6B8A9A] transition-all duration-300 hover:border-[#1D3C52] hover:text-[#1D3C52] active:scale-95"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Learn More
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════
          BLOG TEASER
      ═══════════════════════ */}
      {latestPosts.length > 0 && (
        <section className="py-20 sm:py-24 bg-[#FAFAF7]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-20">

            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10 sm:mb-14">
              <FadeUp>
                <Label>From the Blog</Label>
                <h2
                  className="text-[clamp(1.7rem,4.5vw,2.8rem)] font-normal leading-[1.2] text-[#1D3C52]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Real notes on
                  <br />
                  <em className="italic text-[#8BA5B5]">practice & living</em>
                </h2>
              </FadeUp>
              <FadeUp>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-[11px] sm:text-[12px] tracking-[0.12em] uppercase text-[#6B8A9A] hover:text-[#1D3C52] transition-colors font-medium border-b border-[#C5BCA8] pb-1 self-start sm:self-auto"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  All Posts →
                </Link>
              </FadeUp>
            </div>

            {/* Blog cards — single col on mobile, 3-col on md+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
              {latestPosts.map((post, i) => {
                const postDate = post.date?.toDate?.()
                  ? post.date.toDate().toLocaleDateString("en-IN", { month: "short", year: "numeric" })
                  : "";
                const preview =
                  post.desc || post.excerpt || "Read the latest reflections on yoga, breath, and mindful living.";

                return (
                  <FadeUp key={post.id} delay={i * 0.12}>
                    <Link to={`/blog/${post.id}`} className="group block h-full">
                      <div className="h-full bg-white border border-[#E8E4D8] rounded-2xl p-5 sm:p-7 hover:border-[#A8BDC8] hover:shadow-lg transition-all duration-400 active:scale-[0.99]">
                        <div className="flex items-center gap-3 mb-4 sm:mb-5">
                          {post.category && (
                            <span
                              className="text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-white bg-[#1D3C52] px-3 py-1 rounded-full"
                              style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                              {post.category}
                            </span>
                          )}
                          {postDate && (
                            <span
                              className="text-[11px] text-[#A09880]"
                              style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                              {postDate}
                            </span>
                          )}
                        </div>
                        <h3
                          className="text-[15px] sm:text-[17px] font-semibold text-[#1D3C52] leading-snug group-hover:text-[#2A5470] transition-colors"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {post.title || "Untitled Post"}
                        </h3>
                        <p
                          className="mt-2 sm:mt-3 text-[13px] sm:text-[13.5px] leading-[1.75] text-[#6B8A9A]"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {preview.length > 140 ? `${preview.slice(0, 140)}...` : preview}
                        </p>
                        <span
                          className="inline-block mt-4 sm:mt-5 text-[12px] text-[#8BA5B5] group-hover:text-[#1D3C52] transition-colors"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          Read more →
                        </span>
                      </div>
                    </Link>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════
          FAQ + NEWSLETTER
      ═══════════════════════ */}
      <FAQSection />
      <NewsletterSection />

    </div>
  );
};

export default Home;
