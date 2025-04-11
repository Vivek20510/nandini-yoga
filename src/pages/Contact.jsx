import React, { useRef, useState } from "react";
import emailjs from "emailjs-com";
import { motion } from "framer-motion"; // 👈 import motion

const Contact = () => {
  const form = useRef();
  const [submitted, setSubmitted] = useState(false);
  const [reason, setReason] = useState("General Enquiry");
  const [loading, setLoading] = useState(false);

  const messageSuggestions = {
    "General Enquiry": "I'd love to learn more about your sessions and offerings.",
    "Feedback": "I recently attended a session and would love to share my thoughts.",
    "Other": "I have a unique question or something else to share.",
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateID_owner = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_OWNER;
    const templateID_user = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_USER;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    emailjs.sendForm(serviceID, templateID_owner, form.current, publicKey)
      .then(() => {
        return emailjs.sendForm(serviceID, templateID_user, form.current, publicKey);
      })
      .then(() => {
        setSubmitted(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Message error:", err);
        setLoading(false);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }} // 👈 from below
      animate={{ opacity: 1, y: 0 }}   // 👈 to normal position
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-[#fffaf5] text-[#6B4F4F] font-serif px-4 py-12 sm:px-6 text-center"
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-4">Let’s Flow Together</h2>
      <p className="mb-8 text-md sm:text-lg text-[#7a5c5c]">
        Your journey matters. Whether you’re curious, committed, or just seeking balance — we’re here to listen.
      </p>

      {submitted ? (
        <p className="text-xl text-green-700">Your message has been infused with peace 🌸</p>
      ) : (
        <form
          ref={form}
          onSubmit={sendEmail}
          className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md text-left"
        >
          {/* All form fields remain unchanged */}
          <label className="block mb-2 font-medium">Your Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            className="w-full mb-4 p-3 border border-[#d3b8ae] rounded"
          />

          <label className="block mb-2 font-medium">Your Email *</label>
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            className="w-full mb-4 p-3 border border-[#d3b8ae] rounded"
          />

          <label className="block mb-2 font-medium">Subject / Reason *</label>
          <select
            name="subject"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full mb-4 p-3 border border-[#d3b8ae] rounded"
          >
            <option>General Enquiry</option>
            <option>Feedback</option>
            <option>Other</option>
          </select>

          <label className="block mb-2 font-medium">Mobile Number (optional)</label>
          <input
            type="tel"
            name="mobile"
            placeholder="Your Mobile Number"
            className="w-full mb-4 p-3 border border-[#d3b8ae] rounded"
          />

          <label className="block mb-2 font-medium">Message (optional)</label>
          <textarea
            name="message"
            placeholder={messageSuggestions[reason]}
            rows="5"
            className="w-full mb-4 p-3 border border-[#d3b8ae] rounded"
          />

<button
  type="submit"
  disabled={loading}
  className={`w-full px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-white text-base sm:text-lg shadow-lg transition-all duration-300 ease-in-out 
    ${loading 
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-gradient-to-r from-[#d3b8ae] to-[#c7a99a] hover:from-[#c6a89a] hover:to-[#b89b8f] hover:shadow-xl"
    } focus:outline-none focus:ring-4 focus:ring-[#d3b8ae]/50`}
  aria-label="Send with Grace"
>
  {loading ? (
    <span className="flex items-center justify-center space-x-2">
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      <span>Sending...</span>
    </span>
  ) : (
    "Send with Grace"
  )}
</button>

        </form>
      )}
    </motion.div>
  );
};

export default Contact;
