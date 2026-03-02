import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#FAFAF7]/95 backdrop-blur-md shadow-[0_1px_30px_rgba(29,60,82,0.08)]"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-5 flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div>
              <span className="block text-[15px] font-semibold tracking-[0.06em] text-[#1D3C52]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Nandini Singh
              </span>
              <span className="block text-[10px] tracking-[0.18em] uppercase text-[#8BA5B5] font-medium"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Yoga & Mindfulness
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative group"
                >
                  <span
                    className={`text-[13px] tracking-[0.1em] uppercase font-medium transition-colors duration-300 ${
                      isActive ? "text-[#1D3C52]" : "text-[#6B8A9A] hover:text-[#1D3C52]"
                    }`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {item.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-dot"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1D3C52]"
                    />
                  )}
                  {!isActive && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#8BA5B5] transition-all duration-300 group-hover:w-full group-hover:left-0 group-hover:translate-x-0" />
                  )}
                </Link>
              );
            })}

            {/* CTA */}
            <Link
              to="/contact"
              className="ml-4 px-5 py-2.5 rounded-full border border-[#1D3C52] text-[#1D3C52] text-[12px] tracking-[0.12em] uppercase font-medium hover:bg-[#1D3C52] hover:text-white transition-all duration-300"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Work With Me
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-[#1D3C52]"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={22} />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu size={22} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-[#FAFAF7]/98 backdrop-blur-md border-t border-[#E8E4D8]"
            >
              <div className="px-8 py-8 flex flex-col gap-7">
                {navItems.map((item, i) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 text-[15px] tracking-[0.08em] uppercase font-medium transition-colors ${
                          isActive ? "text-[#1D3C52]" : "text-[#6B8A9A]"
                        }`}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {isActive && <span className="w-4 h-[1px] bg-[#1D3C52]" />}
                        {item.name}
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="pt-2 border-t border-[#E8E4D8]"
                >
                  <Link
                    to="/contact"
                    onClick={() => setIsOpen(false)}
                    className="inline-block px-6 py-3 rounded-full bg-[#1D3C52] text-white text-[12px] tracking-[0.14em] uppercase font-medium"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Work With Me
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer for fixed navbar */}
      <div className="h-[72px]" />
    </>
  );
};

export default Navbar;
