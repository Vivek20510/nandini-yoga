import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import {
  ArrowRight,
  Award,
  Leaf,
  MapPin,
  Sprout,
  Sun,
  Users,
  Wind,
} from "lucide-react";
import yogaPose from "../assets/yoga-pose.png";
import FAQSection, { FAQ_ITEMS } from "../components/FAQSection";
import GallerySection from "../components/GallerySection";
import NewsletterSection from "../components/NewsletterSection";
import SEO from "../components/SEO";
import TestimonialsSection from "../components/TestimonialsSection";
import { db } from "../firebase";
import {
  PERSON_NAME,
  SITE_DESCRIPTION,
  SITE_IMAGE,
  SITE_NAME,
  SITE_URL,
} from "../lib/site";

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

const SectionLabel = ({ children }) => (
  <div className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-yoga-sage">
    <span className="h-px w-5 bg-yoga-sage" />
    {children}
  </div>
);

const StatStrip = () => (
  <section className="grid grid-cols-3 bg-yoga-ink text-yoga-paper">
    {[
      ["15+", "Years teaching"],
      ["500+", "Students taught"],
      ["Intl.", "Certified"],
    ].map(([value, label]) => (
      <div key={label} className="border-r border-white/10 px-3 py-6 text-center last:border-r-0 md:py-8">
        <span className="block font-display text-3xl font-bold md:text-5xl">{value}</span>
        <span className="mt-1 block text-[11px] leading-snug text-white/45 md:text-sm">{label}</span>
      </div>
    ))}
  </section>
);

const disciplines = [
  {
    icon: Leaf,
    title: "Hatha Yoga",
    text: "Classical posture work with attention to alignment, steadiness, and breath.",
  },
  {
    icon: Wind,
    title: "Pranayama",
    text: "Structured breathwork to build focus, calm, and a stronger daily rhythm.",
  },
  {
    icon: Sun,
    title: "Morning Practice",
    text: "Small group sessions designed for consistency, clarity, and community.",
  },
  {
    icon: Sprout,
    title: "Beginner Batches",
    text: "A patient foundation for students starting from scratch or returning after a pause.",
  },
];

const Home = () => {
  const [latestPosts, setLatestPosts] = useState([]);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const postsRef = collection(db, "posts");
        const latestQuery = query(postsRef, orderBy("date", "desc"));
        const querySnapshot = await getDocs(latestQuery);
        const posts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setLatestPosts(posts.slice(0, 3));
      } catch {
        setLatestPosts([]);
      }
    };

    fetchLatestPosts();
  }, []);

  const homeDescription =
    "Learn Hatha yoga and pranayama with Nandini Singh, an internationally certified yoga teacher with 15+ years of experience teaching small group classes.";

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
      logo: { "@type": "ImageObject", url: SITE_IMAGE },
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: PERSON_NAME,
      jobTitle: "Yoga Teacher",
      url: SITE_URL,
      image: SITE_IMAGE,
      worksFor: { "@type": "Organization", name: SITE_NAME },
      description:
        "Certified yoga teacher offering Hatha yoga, pranayama, and small-group batch classes.",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];

  return (
    <main className="overflow-x-hidden bg-yoga-paper font-body text-yoga-ink">
      <SEO
        title="Yoga by Nandini | Hatha Yoga and Pranayama Classes"
        description={homeDescription}
        canonicalPath="/"
        schema={homeSchema}
      />

      <section className="border-b border-yoga-border px-5 pb-12 pt-32 md:px-10 md:pb-20 md:pt-36">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
          >
            <SectionLabel>Yoga teacher · Nandini Singh</SectionLabel>
            <h1 className="max-w-4xl font-display text-[42px] font-bold leading-[1.08] text-yoga-ink sm:text-6xl lg:text-7xl">
              Teaching yoga the way it was meant to be <em className="text-yoga-clay">taught.</em>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-8 text-yoga-ink/70 md:text-base">
              15 years of practice and teaching in Hatha yoga and pranayama. Based in India,
              trained internationally, and known for small-group classes that are precise,
              unhurried, and beginner-friendly.
            </p>

            <div className="mt-8 grid gap-3 text-sm text-yoga-ink/55">
              {[
                [Award, "Internationally certified yoga teacher"],
                [MapPin, "India · Online and in-person classes"],
                [Users, "Small group batches · Hindi and English"],
              ].map(([Icon, text]) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon className="h-5 w-5 shrink-0 text-yoga-sage" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/classes"
                className="inline-flex min-h-[46px] items-center justify-center rounded-lg bg-yoga-ink px-6 text-sm font-medium text-yoga-paper transition hover:bg-black"
              >
                View Classes
              </Link>
              <Link
                to="/about"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg border border-yoga-sage px-6 text-sm font-medium text-yoga-sage transition hover:bg-yoga-sage hover:text-white"
              >
                Learn About Me <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.42, delay: 0.1, ease: "easeOut" }}
            className="rounded-2xl border border-yoga-border bg-white p-4 shadow-sm md:p-5"
          >
            <div className="flex min-h-[280px] items-center justify-center rounded-xl bg-yoga-mist md:min-h-[420px]">
              <img
                src={yogaPose}
                alt="Yoga posture illustration"
                className="max-h-[330px] w-auto object-contain md:max-h-[450px]"
                loading="eager"
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-4">
              {["Hatha yoga", "Pranayama", "Breathwork", "Beginner-friendly"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-yoga-border bg-yoga-paper px-3 py-1 text-[11px] text-yoga-ink/55"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <StatStrip />

      <section className="border-b border-yoga-border px-5 py-14 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <FadeUp>
            <SectionLabel>About</SectionLabel>
            <h2 className="font-display text-3xl font-bold leading-tight md:text-5xl">
              Who is <em className="text-yoga-clay">Nandini?</em>
            </h2>
          </FadeUp>
          <FadeUp delay={0.05} className="rounded-2xl border border-yoga-border bg-white p-5 md:p-8">
            <p className="text-sm leading-8 text-yoga-ink/70 md:text-base">
              Nandini Singh is a certified yoga teacher with over 15 years of experience in Hatha
              yoga and pranayama. She has trained in India and internationally, and has taught
              hundreds of students across levels and ages.
            </p>
            <p className="mt-4 text-sm leading-8 text-yoga-ink/70 md:text-base">
              Her teaching is unhurried, precise, and deeply rooted in traditional practice. The
              work is not about performance; it is about consistency, understanding, and a practice
              you can keep.
            </p>
            <Link
              to="/about"
              className="mt-6 inline-flex min-h-[44px] items-center gap-2 border-b border-yoga-ink text-sm font-medium text-yoga-ink"
            >
              Read full bio <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeUp>
        </div>
      </section>

      <section className="border-b border-yoga-border px-5 py-14 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl">
          <FadeUp className="max-w-2xl">
            <SectionLabel>Disciplines</SectionLabel>
            <h2 className="font-display text-3xl font-bold leading-tight md:text-5xl">
              What she <em className="text-yoga-clay">teaches</em>
            </h2>
            <p className="mt-4 text-sm leading-7 text-yoga-ink/55 md:text-base">
              Rooted in classical tradition. Adapted thoughtfully for modern practitioners.
            </p>
          </FadeUp>

          <div className="mt-8 grid divide-y divide-yoga-border md:grid-cols-2 md:gap-x-10 md:divide-y-0">
            {disciplines.map((item, index) => {
              const Icon = item.icon;
              return (
                <FadeUp key={item.title} delay={index * 0.04}>
                  <div className="flex gap-4 py-5 md:border-b md:border-yoga-border">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-yoga-border bg-yoga-mist">
                      <Icon className="h-5 w-5 text-yoga-sage" />
                    </div>
                    <div>
                      <h3 className="font-medium text-yoga-ink">{item.title}</h3>
                      <p className="mt-1 text-sm leading-7 text-yoga-ink/55">{item.text}</p>
                    </div>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-yoga-ink px-5 py-12 text-yoga-paper md:px-10 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <FadeUp>
            <SectionLabel>Philosophy</SectionLabel>
            <h2 className="font-display text-3xl font-bold leading-tight md:text-5xl">
              How Nandini approaches teaching
            </h2>
          </FadeUp>
          <div className="divide-y divide-white/10">
            {[
              ["01", "Practice over performance", "Consistency and understanding matter more than impressive poses."],
              ["02", "Breath before posture", "Every class begins with awareness. The body follows when the breath leads."],
              ["03", "Every body is different", "Modification and patience are built into the way she teaches."],
            ].map(([num, title, text], index) => (
              <FadeUp key={title} delay={index * 0.04}>
                <div className="grid grid-cols-[2.5rem_1fr] gap-4 py-5">
                  <span className="font-display text-sm font-bold text-white/20">{num}</span>
                  <div>
                    <h3 className="font-medium text-yoga-paper/80">{title}</h3>
                    <p className="mt-1 text-sm leading-7 text-white/35">{text}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <GallerySection />
      <TestimonialsSection />

      {latestPosts.length > 0 && (
        <section className="border-y border-yoga-border px-5 py-14 md:px-10 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <FadeUp>
                <SectionLabel>Writing</SectionLabel>
                <h2 className="font-display text-3xl font-bold leading-tight md:text-5xl">
                  From the <em className="text-yoga-clay">blog</em>
                </h2>
              </FadeUp>
              <Link
                to="/blog"
                className="inline-flex min-h-[44px] items-center gap-2 self-start border-b border-yoga-ink text-sm font-medium"
              >
                All writings <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 divide-y divide-yoga-border">
              {latestPosts.map((post, index) => {
                const postDate = post.date?.toDate?.()
                  ? post.date.toDate().toLocaleDateString("en-IN", { month: "long", year: "numeric" })
                  : "";

                return (
                  <Link
                    key={post.id}
                    to={`/blog/${post.id}`}
                    className="grid min-h-[72px] grid-cols-[3rem_1fr] gap-4 py-5 transition hover:text-yoga-sage md:grid-cols-[4rem_1fr_auto]"
                  >
                    <span className="font-display text-3xl font-bold text-yoga-border">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      {post.category && (
                        <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.08em] text-yoga-sage">
                          {post.category}
                        </span>
                      )}
                      <span className="block text-sm font-medium leading-6 md:text-base">
                        {post.title || "Untitled Post"}
                      </span>
                    </span>
                    {postDate && (
                      <span className="col-start-2 text-xs text-yoga-ink/40 md:col-start-auto md:self-center">
                        {postDate}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <NewsletterSection />
      <FAQSection />

      <section className="border-t border-yoga-border px-5 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-3xl">
          <SectionLabel>Contact</SectionLabel>
          <h2 className="font-display text-3xl font-bold leading-tight md:text-5xl">
            Get in <em className="text-yoga-clay">touch</em>
          </h2>
          <p className="mt-4 text-sm leading-7 text-yoga-ink/55 md:text-base">
            Have a question about yoga, her work, or current batches? Write directly. Nandini
            responds personally.
          </p>
          <Link
            to="/contact"
            className="mt-7 inline-flex min-h-[46px] items-center justify-center rounded-lg border border-yoga-sage px-6 text-sm font-medium text-yoga-sage transition hover:bg-yoga-sage hover:text-white"
          >
            Go to contact page
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
