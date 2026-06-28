import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Languages, Leaf, Users } from "lucide-react";
import SEO from "../components/SEO";

const classes = [
  {
    title: "Morning Batch",
    time: "Early morning",
    level: "All levels",
    text: "A steady group practice for students who want rhythm, alignment, and breath-led movement.",
  },
  {
    title: "Beginners Batch",
    time: "By current schedule",
    level: "New students",
    text: "A structured introduction to yoga foundations with patient guidance and clear modifications.",
  },
  {
    title: "Weekend Batch",
    time: "Weekend slots",
    level: "Gentle pace",
    text: "For students balancing work and home schedules who still want a consistent weekly practice.",
  },
];

const classesFaq = [
  ["Do I need prior yoga experience?", "No. Beginner batches start from scratch and progress gradually."],
  ["Are classes online or in-person?", "Both may be available depending on the current batch schedule."],
  ["What language are classes taught in?", "Hindi and English, usually mixed naturally based on the group."],
  ["How do I join?", "Send an enquiry through the contact page. Nandini will share current batch options."],
];

const Classes = () => {
  return (
    <main className="bg-yoga-paper pt-28 font-body text-yoga-ink">
      <SEO
        title="Yoga Classes and Batches | Yoga by Nandini"
        description="Join small-group Hatha yoga and pranayama batches with Nandini Singh. Beginner-friendly classes taught in Hindi and English."
        canonicalPath="/classes"
      />

      <section className="border-b border-yoga-border px-5 pb-14 pt-8 md:px-10 md:pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-yoga-sage">
            <span className="h-px w-5 bg-yoga-sage" />
            Classes
          </div>
          <h1 className="font-display text-[42px] font-bold leading-[1.08] md:text-7xl">
            Join a yoga <em className="text-yoga-clay">batch.</em>
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-8 text-yoga-ink/65 md:text-base">
            Small groups, personal attention, and consistent practice. Classes are rooted in Hatha
            yoga and pranayama, with clear guidance for beginners and regular students.
          </p>
        </div>
      </section>

      <section className="border-b border-yoga-border px-5 py-14 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {classes.map((item) => (
            <article key={item.title} className="rounded-2xl border border-yoga-border bg-white p-5 md:p-7">
              <Leaf className="mb-6 h-6 w-6 text-yoga-sage" />
              <h2 className="font-display text-2xl font-bold">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-yoga-ink/60">{item.text}</p>
              <div className="mt-6 grid gap-3 border-t border-yoga-border pt-5 text-sm text-yoga-ink/55">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yoga-sage" />
                  {item.time}
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-yoga-sage" />
                  {item.level}
                </span>
                <span className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-yoga-sage" />
                  Hindi and English
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-yoga-ink px-5 py-14 text-yoga-paper md:px-10 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-yoga-sageLight">
              <span className="h-px w-5 bg-yoga-sageLight" />
              How to join
            </div>
            <h2 className="font-display text-3xl font-bold leading-tight md:text-5xl">
              Start with a simple enquiry.
            </h2>
          </div>
          <div className="divide-y divide-white/10">
            {[
              ["01", "Send your details", "Use the contact form and mention your level, preferred time, and any questions."],
              ["02", "Confirm the batch", "Nandini shares what is currently running and helps you choose the right group."],
              ["03", "Begin practice", "You receive the joining details and start with a steady, guided class rhythm."],
            ].map(([num, title, text]) => (
              <div key={title} className="grid grid-cols-[2.5rem_1fr] gap-4 py-5">
                <span className="font-display text-sm font-bold text-white/20">{num}</span>
                <div>
                  <h3 className="font-medium text-yoga-paper/85">{title}</h3>
                  <p className="mt-1 text-sm leading-7 text-white/40">{text}</p>
                </div>
              </div>
            ))}
            <Link
              to="/contact"
              className="mt-6 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-yoga-paper px-6 text-sm font-medium text-yoga-ink"
            >
              Send an enquiry <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-yoga-sage">
            <span className="h-px w-5 bg-yoga-sage" />
            Questions
          </div>
          <h2 className="font-display text-3xl font-bold md:text-5xl">Common questions</h2>
          <div className="mt-8 divide-y divide-yoga-border">
            {classesFaq.map(([question, answer]) => (
              <div key={question} className="py-5">
                <h3 className="font-medium">{question}</h3>
                <p className="mt-2 text-sm leading-7 text-yoga-ink/55">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Classes;
