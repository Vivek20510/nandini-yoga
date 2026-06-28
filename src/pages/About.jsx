import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, BookOpen, Globe, Heart, MapPin, Users } from "lucide-react";
import SEO from "../components/SEO";
import { PERSON_NAME, SITE_IMAGE, SITE_NAME, SITE_URL } from "../lib/site";

/* ── Shared animation wrapper (same as Home) ── */
const FadeUp = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-48px" }}
    transition={{ duration: 0.38, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const SectionLabel = ({ children, light = false }) => (
  <div
    className={`mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] ${
      light ? "text-white/40" : "text-yoga-sage"
    }`}
  >
    <span className={`h-px w-5 ${light ? "bg-white/30" : "bg-yoga-sage"}`} />
    {children}
  </div>
);

/* ── Static data ── */
const TIMELINE = [
  {
    year: "2008",
    event: "Began studying Hatha yoga in Rishikesh under senior Iyengar teachers.",
  },
  {
    year: "2012",
    event: "Certified at Patanjali Yogpeeth — Hatha yoga and foundational pranayama.",
  },
  {
    year: "2016",
    event: "Completed advanced pranayama training with Isha Foundation, Coimbatore.",
  },
  {
    year: "2019",
    event: "Awarded 500-hour international certification through Om Yoga International, Rishikesh.",
  },
  {
    year: "2023",
    event: "Founded Yoga by Nandini — small-group batch classes in India and online.",
  },
];

const CERTIFICATIONS = [
  {
    org: "Patanjali Yogpeeth",
    focus: "Hatha Yoga & Ayurvedic Foundation",
    location: "Haridwar, India",
  },
  {
    org: "Isha Foundation",
    focus: "Inner Engineering & Advanced Pranayama",
    location: "Coimbatore, India",
  },
  {
    org: "Om Yoga International",
    focus: "500-hr Teacher Training",
    location: "Rishikesh, India",
  },
];

const PHILOSOPHY = [
  {
    icon: Heart,
    title: "Practice over performance",
    body: "Consistency and understanding matter more than impressive postures. Showing up daily — even briefly — is the practice.",
  },
  {
    icon: BookOpen,
    title: "Breath before posture",
    body: "Every class starts with awareness. The body follows naturally once the breath is grounded and steady.",
  },
  {
    icon: Users,
    title: "Every body is different",
    body: "Modification and patience are built into the way Nandini teaches. There is no standard body and no standard pace.",
  },
];

const About = () => {
  const aboutDescription =
    "Learn about Nandini Singh — certified yoga teacher with 15+ years of experience in Hatha yoga and pranayama, teaching small-group batch classes in India and online.";

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PERSON_NAME,
    image: SITE_IMAGE,
    url: `${SITE_URL}/about`,
    jobTitle: "Yoga Teacher",
    worksFor: { "@type": "Organization", name: SITE_NAME },
    description: aboutDescription,
  };

  return (
    <main className="overflow-x-hidden bg-yoga-paper font-body text-yoga-ink">
      <SEO
        title="About Nandini Singh | Yoga Teacher"
        description={aboutDescription}
        canonicalPath="/about"
        schema={aboutSchema}
      />

      {/* ── HERO ── */}
      <section className="border-b border-yoga-border px-5 pb-14 pt-32 md:px-10 md:pb-20 md:pt-36">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
          >
            <SectionLabel>About</SectionLabel>
            <h1 className="max-w-3xl font-display text-[42px] font-bold leading-[1.08] text-yoga-ink sm:text-6xl lg:text-7xl">
              The teacher{" "}
              <em className="text-yoga-clay">behind the mat.</em>
            </h1>
          </motion.div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            {/* Portrait card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.42, delay: 0.08, ease: "easeOut" }}
              className="rounded-2xl border border-yoga-border bg-white p-4 shadow-sm md:p-5"
            >
              <div className="flex min-h-[280px] items-center justify-center rounded-xl bg-yoga-mist md:min-h-[380px]">
                {/* Swap for <img src={yogaPose3} ...> when a real photo is available */}
                <span className="font-display text-6xl">🪷</span>
              </div>

              {/* Stats strip */}
              <div className="mt-4 grid grid-cols-3 divide-x divide-yoga-border rounded-xl border border-yoga-border bg-yoga-paper">
                {[
                  ["15+", "Years teaching"],
                  ["500+", "Students"],
                  ["Intl.", "Certified"],
                ].map(([value, label]) => (
                  <div key={label} className="px-3 py-4 text-center">
                    <span className="block font-display text-2xl font-bold text-yoga-clay">
                      {value}
                    </span>
                    <span className="mt-0.5 block text-[10px] leading-snug text-yoga-ink/40">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Bio text */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.12, ease: "easeOut" }}
              className="flex flex-col gap-6"
            >
              <div className="rounded-2xl border border-yoga-border bg-white p-5 md:p-8">
                <SectionLabel>Her story</SectionLabel>
                <h2 className="font-display text-2xl font-bold leading-snug md:text-3xl">
                  Rooted in tradition.{" "}
                  <em className="text-yoga-clay">Open to every student.</em>
                </h2>
                <p className="mt-4 text-sm leading-8 text-yoga-ink/70 md:text-base">
                  Nandini Singh has studied and taught yoga for over 15 years. Her path began
                  in Rishikesh, where she trained with senior Iyengar teachers before earning
                  formal certifications from Patanjali Yogpeeth and Isha Foundation.
                </p>
                <p className="mt-3 text-sm leading-8 text-yoga-ink/70 md:text-base">
                  Her teaching is precise and unhurried — built for students who want to
                  understand the practice, not just move through it. She has taught hundreds of
                  students across levels and ages, primarily through small-group batch classes
                  where each person gets real attention.
                </p>
                <p className="mt-3 text-sm leading-8 text-yoga-ink/70 md:text-base">
                  Classes are offered in Hindi and English, in-person (India) and online.
                </p>
              </div>

              {/* Quick facts */}
              <div className="grid gap-3 text-sm text-yoga-ink/55">
                {[
                  [Award, "Internationally certified — 500-hr training"],
                  [MapPin, "Based in India · Online and in-person"],
                  [Globe, "Classes in Hindi and English"],
                ].map(([Icon, text]) => (
                  <div key={text} className="flex items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0 text-yoga-sage" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section className="border-b border-yoga-border px-5 py-14 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl">
          <FadeUp className="max-w-xl">
            <SectionLabel>Certifications</SectionLabel>
            <h2 className="font-display text-3xl font-bold leading-tight md:text-5xl">
              Trained at the{" "}
              <em className="text-yoga-clay">source.</em>
            </h2>
            <p className="mt-3 text-sm leading-7 text-yoga-ink/55 md:text-base">
              Every credential comes from institutions with deep roots in traditional Indian yoga.
            </p>
          </FadeUp>

          <div className="mt-8 flex flex-col gap-4 md:mt-10">
            {CERTIFICATIONS.map(({ org, focus, location }, i) => (
              <FadeUp key={org} delay={i * 0.05}>
                <div className="flex items-start gap-5 rounded-2xl border border-yoga-border bg-white p-5 md:p-6">
                  <span className="font-display text-2xl font-bold text-yoga-border md:text-3xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-medium text-yoga-ink">{org}</p>
                    <p className="mt-0.5 text-sm text-yoga-ink/55">{focus}</p>
                    <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.1em] text-yoga-sage">
                      {location}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="border-b border-yoga-border px-5 py-14 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <FadeUp>
              <SectionLabel>Journey</SectionLabel>
              <h2 className="font-display text-3xl font-bold leading-tight md:text-5xl">
                Milestones along{" "}
                <em className="text-yoga-clay">the path.</em>
              </h2>
            </FadeUp>

            <div className="relative pl-5 md:pl-8">
              {/* Vertical line */}
              <div className="absolute bottom-0 left-0 top-0 w-px bg-yoga-border" />

              {TIMELINE.map(({ year, event }, i) => (
                <FadeUp key={year} delay={i * 0.05}>
                  <div className="relative mb-8 last:mb-0">
                    {/* Dot */}
                    <div className="absolute -left-[1.3rem] top-[5px] h-3 w-3 rounded-full border-2 border-white bg-yoga-sage shadow-sm md:-left-[2.1rem]" />
                    <p className="font-display text-xl font-bold text-yoga-clay">{year}</p>
                    <p className="mt-1 text-sm leading-7 text-yoga-ink/60 md:text-base">
                      {event}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section className="bg-yoga-ink px-5 py-12 text-yoga-paper md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <FadeUp>
            <SectionLabel light>Teaching philosophy</SectionLabel>
            <h2 className="max-w-xl font-display text-3xl font-bold leading-tight md:text-5xl">
              What guides every session.
            </h2>
          </FadeUp>

          <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3">
            {PHILOSOPHY.map(({ icon: Icon, title, body }, i) => (
              <FadeUp key={title} delay={i * 0.05}>
                <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/10">
                    <Icon className="h-5 w-5 text-yoga-sage" />
                  </div>
                  <h3 className="font-medium text-yoga-paper/90">{title}</h3>
                  <p className="text-sm leading-7 text-white/40">{body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="border-t border-yoga-border px-5 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <FadeUp>
            <p className="font-display text-xl font-bold italic text-yoga-ink/40 md:text-2xl">
              "Yoga is not about touching your toes. It is what you learn on the way down."
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-yoga-ink/30">
              — Jigar Gor
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/classes"
                className="inline-flex min-h-[46px] items-center justify-center rounded-lg bg-yoga-ink px-6 text-sm font-medium text-yoga-paper transition hover:bg-black"
              >
                View Classes
              </Link>
              <Link
                to="/contact"
                className="inline-flex min-h-[46px] items-center justify-center rounded-lg border border-yoga-sage px-6 text-sm font-medium text-yoga-sage transition hover:bg-yoga-sage hover:text-white"
              >
                Get in touch
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
};

export default About;