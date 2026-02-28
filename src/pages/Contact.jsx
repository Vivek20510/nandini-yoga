import React, { useRef, useState } from "react";
import emailjs from "emailjs-com";
import { motion } from "framer-motion";
import { MessageSquare, Phone } from "lucide-react"; // Lucide icons
import { Link } from "react-router-dom";

const Contact = () => {
  const form = useRef();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const messageSuggestions = {
    "General Enquiry": "I'd love to learn more about your sessions and offerings.",
    "Personal Yoga Session": "I'm interested in booking a personal yoga session at my home.",
    "Yoga Camp Participation": "I'd like to know more about upcoming yoga camps and how to join.",
    "Corporate or Workplace Wellness": "We're exploring wellness options for our team. Can we connect?",
    "Collaboration / Partnership": "I’m interested in collaborating or partnering with your team.",
    "Feedback": "I recently attended a session and would love to share my thoughts.",
    "Other": "I have a unique question or something else to share.",
  };

  const [reason, setReason] = useState("General Enquiry");
  const [message, setMessage] = useState(messageSuggestions["General Enquiry"]);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error before each submission

    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateID_owner = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_OWNER;
    const templateID_user = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_USER;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    emailjs
      .sendForm(serviceID, templateID_owner, form.current, publicKey)
      .then(() => emailjs.sendForm(serviceID, templateID_user, form.current, publicKey))
      .then(() => {
        setSubmitted(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Message error:", err);
        setError("Something went wrong. Please try again later.");
        setLoading(false);
      });
  };

  return (
          <motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="min-h-screen bg-white px-5 sm:px-8 md:px-16 lg:px-24 py-16 sm:py-20"
>
  <div className="max-w-6xl mx-auto">

    {/* Heading */}
    <div className="text-center mb-12 sm:mb-16">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">
        Let’s Connect
      </h2>
      <p className="mt-4 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Whether you're interested in personal sessions, workshops,
        collaborations, or simply have a question —
        we’d love to hear from you.
      </p>
    </div>

    {submitted ? (
  <div className="text-center py-16 sm:py-20">

    <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#1D3C52]">
      Thank you for reaching out 🌿
    </h3>

    <p className="mt-4 text-gray-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
      Your message has been received. We’ll get back to you soon.
      In the meantime, feel free to explore more about our programs
      and wellness insights.
    </p>

    {/* Action Buttons */}
    <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">

      <Link
        to="/"
        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1D3C52] text-white text-sm sm:text-base font-medium hover:bg-[#163042] transition shadow-sm"
      >
        Return to Home
      </Link>

      <Link
        to="/blog"
        className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-700 text-sm sm:text-base font-medium hover:bg-gray-100 transition"
      >
        Explore the Blog
      </Link>

    </div>

  </div>
) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

        {/* LEFT INFO SECTION */}
        <div className="space-y-8 order-2 lg:order-1">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Contact Information
            </h3>
            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
              Reach out for personal yoga sessions, corporate wellness
              programs, or event collaborations.
            </p>
          </div>

          <div className="space-y-5 text-gray-600 text-sm sm:text-base">
            <div className="flex items-center gap-3">
              <MessageSquare size={18} />
              info@yogabynandini.com
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} />
              +91 98765 43210
            </div>
          </div>
        </div>

        {/* FORM SECTION */}
        <form
          ref={form}
          onSubmit={sendEmail}
          className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 order-1 lg:order-2"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1D3C52] transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Email *
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1D3C52] transition"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <select
              name="subject"
              value={reason}
              onChange={(e) => {
                const selected = e.target.value;
                setReason(selected);
                setMessage(messageSuggestions[selected] || "");
              }}
              className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1D3C52] transition"
            >
              {Object.keys(messageSuggestions).map((key) => (
                <option key={key}>{key}</option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              name="message"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1D3C52] transition"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 sm:py-3.5 rounded-xl font-medium text-white text-sm sm:text-base transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1D3C52] hover:bg-[#163042]"
            }`}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

      </div>
    )}
  </div>
</motion.div>
  );
};

export default Contact;
