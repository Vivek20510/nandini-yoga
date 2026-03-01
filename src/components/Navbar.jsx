import React, { useState } from "react";
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
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-lg md:text-xl font-semibold tracking-tight text-gray-900"
        >
          Yoga by Nandini
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium relative">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative pb-1"
              >
                <span
                  className={`transition ${
                    isActive
                      ? "text-[#1D3C52]"
                      : "text-gray-700 hover:text-[#1D3C52]"
                  }`}
                >
                  {item.name}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute left-0 right-0 -bottom-1 h-[2px] bg-[#1D3C52] rounded"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-900"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-sm"
          >
            <div className="flex flex-col px-6 py-6 space-y-6 text-base font-medium">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`relative pb-1 transition ${
                      isActive
                        ? "text-[#1D3C52]"
                        : "text-gray-700 hover:text-[#1D3C52]"
                    }`}
                  >
                    {item.name}

                    {isActive && (
                      <>
                        <motion.div
                          layoutId="mobile-underline"
                          className="absolute left-0 right-0 -bottom-1 h-[2px] bg-[#1D3C52] rounded"
                        />
                        <motion.div
                          layoutId="mobile-indicator"
                          className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#1D3C52] rounded-full"
                        />
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;