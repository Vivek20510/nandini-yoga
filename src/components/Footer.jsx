import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Youtube, Mail } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

const socials = [
  {
    label: "Instagram",
    href: "https://instagram.com/",
    icon: <Instagram size={16} />,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/",
    icon: <Youtube size={16} />,
  },
  {
    label: "Email",
    href: "mailto:yoga.nandinisingh@gmail.com",
    icon: <Mail size={16} />,
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#1D3C52] text-[#C8D8E0]">

      {/* ── Main grid ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-20 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-14 md:gap-10">

          {/* Brand column */}
          <div>
            {/* Logo mark */}
            <div className="flex items-center gap-3 mb-5">
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 24C14 24 6 18 6 11C6 7.686 9.134 5 14 5C18.866 5 22 7.686 22 11C22 18 14 24 14 24Z"
                  stroke="#8BA5B5" strokeWidth="1.2" fill="none"/>
                <path d="M14 24C14 24 4 16 4 10C4 6 7 4 10 5.5" stroke="#4A6A7A" strokeWidth="1" fill="none" strokeLinecap="round"/>
                <path d="M14 24C14 24 24 16 24 10C24 6 21 4 18 5.5" stroke="#4A6A7A" strokeWidth="1" fill="none" strokeLinecap="round"/>
                <circle cx="14" cy="12" r="2" fill="#8BA5B5" opacity="0.4"/>
              </svg>
              <div>
                <span
                  className="block text-[15px] font-semibold tracking-[0.06em] text-[#E8F0F4]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Nandini Singh
                </span>
                <span
                  className="block text-[10px] tracking-[0.18em] uppercase text-[#6B8A9A]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Yoga & Mindfulness
                </span>
              </div>
            </div>

            <p
              className="text-[14px] leading-[1.85] text-[#8BA5B5] max-w-xs"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Guiding practitioners toward balance, strength, and inner clarity
              through classical yoga, breathwork, and Ayurvedic wisdom.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mt-8">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-[#2E5470] flex items-center justify-center text-[#6B8A9A] hover:border-[#8BA5B5] hover:text-[#C8D8E0] transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4
              className="text-[10px] tracking-[0.22em] uppercase text-[#6B8A9A] font-semibold mb-6"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Navigation
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-[14px] text-[#8BA5B5] hover:text-[#E8F0F4] transition-colors duration-300"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & location */}
          <div>
            <h4
              className="text-[10px] tracking-[0.22em] uppercase text-[#6B8A9A] font-semibold mb-6"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Get in Touch
            </h4>
            <ul className="space-y-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <li>
                <a
                  href="mailto:yoga.nandinisingh@gmail.com"
                  className="text-[14px] text-[#8BA5B5] hover:text-[#E8F0F4] transition-colors duration-300"
                >
                  yoga.nandinisingh@gmail.com
                </a>
              </li>
              <li className="text-[14px] text-[#6B8A9A] leading-relaxed">
                Based in India<br />
                <span className="text-[12px]">Online sessions worldwide</span>
              </li>
              <li className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-[12px] tracking-[0.1em] uppercase text-[#8BA5B5] border-b border-[#2E5470] pb-0.5 hover:text-[#E8F0F4] hover:border-[#8BA5B5] transition-all duration-300 font-medium"
                >
                  Work With Me →
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Divider ── */}
        <div className="mt-16 pt-7 border-t border-[#243F56] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-[11px] text-[#4A6A7A] tracking-wide"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            © {new Date().getFullYear()} Nandini Singh. All rights reserved.
          </p>
          <p
            className="text-[11px] text-[#3A5A6A] tracking-wide italic"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            "Yoga is the journey of the self, through the self, to the self."
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;