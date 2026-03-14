import React, { useMemo, useState } from "react";

const Label = ({ children }) => (
  <span
    className="inline-block text-[10px] tracking-[0.22em] uppercase text-[#8BA5B5] font-semibold mb-5"
    style={{ fontFamily: "'DM Sans', sans-serif" }}
  >
    {children}
  </span>
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isValidEmail = useMemo(() => EMAIL_RE.test(email.trim()), [email]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    setSuccessMessage("");
    setErrorMessage("");

    if (!EMAIL_RE.test(normalizedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.ok) {
        setErrorMessage(data?.message || "Subscription failed. Please try again.");
        return;
      }

      setSuccessMessage(data.message || "You're subscribed. Watch your inbox for quiet notes.");
      setEmail("");
    } catch (error) {
      setErrorMessage("We couldn't connect right now. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-[#F0EDE0]">
      <div className="max-w-2xl mx-auto px-6 md:px-12 text-center">
        <Label>Stay Connected</Label>
        <h2
          className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-normal leading-[1.2] text-[#1D3C52]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Quiet notes on
          <br />
          <em className="italic text-[#8BA5B5]">yoga & mindful living</em>
        </h2>
        <p
          className="mt-5 text-[14.5px] leading-[1.8] text-[#5A7485]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Occasional essays, practice guides, and workshop announcements -
          delivered to your inbox with care. No noise, no sales tactics.
        </p>

        <form
          className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="your@email.com"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (successMessage) setSuccessMessage("");
              if (errorMessage) setErrorMessage("");
            }}
            aria-invalid={Boolean(errorMessage)}
            className="flex-1 px-5 py-3.5 rounded-full border border-[#D8D2C4] bg-white text-[14px] text-[#1D3C52] placeholder-[#A09880] focus:outline-none focus:ring-2 focus:ring-[#1D3C52]/20 focus:border-[#1D3C52] transition-all"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />
          <button
            type="submit"
            disabled={isSubmitting || !isValidEmail}
            className="px-7 py-3.5 rounded-full bg-[#1D3C52] text-white text-[13px] tracking-[0.1em] uppercase font-medium hover:bg-[#2A5470] transition-all duration-300 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        {errorMessage ? (
          <p
            className="mt-4 text-[12px] text-[#B65E47]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p
            className="mt-4 text-[12px] text-[#456B57]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {successMessage}
          </p>
        ) : null}

        <p
          className="mt-4 text-[11px] text-[#A09880] tracking-wide"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Unsubscribe at any time. No spam, ever.
        </p>
      </div>
    </section>
  );
};

export default NewsletterSection;
