import React from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import Home from "./pages/Home";
import Contact from "./pages/Contact";
import BlogPage from "./pages/BlogPage";
import AdminPage from "./pages/AdminPage";
import About from "./pages/About"; 

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {/* HEADER */}
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

          {[
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
            { name: "Blog", path: "/blog" },
            { name: "Contact", path: "/contact" },
          ].map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative pb-1"
              >
                <span className={`transition ${isActive ? "text-[#1D3C52]" : "text-gray-700 hover:text-[#1D3C52]"}`}>
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

        {/* Mobile Dropdown Menu */}
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

                {[
                  { name: "Home", path: "/" },
                  { name: "About", path: "/about" },
                  { name: "Blog", path: "/blog" },
                  { name: "Contact", path: "/contact" },
                ].map((item) => {
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

                      {/* Animated Underline */}
                      {isActive && (
                        <motion.div
                          layoutId="mobile-underline"
                          className="absolute left-0 right-0 -bottom-1 h-[2px] bg-[#1D3C52] rounded"
                        />
                      )}

                      {/* Left Active Indicator (extra polish) */}
                      {isActive && (
                        <motion.div
                          layoutId="mobile-indicator"
                          className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#1D3C52] rounded-full"
                        />
                      )}
                    </Link>
                  );
                })}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} /> 
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      {/* Footer*/}
      <footer className="bg-gray-50 border-t border-gray-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 text-center">

          <h3 className="text-lg font-semibold text-gray-900">
            Yoga by Nandini
          </h3>

          <p className="mt-3 text-sm text-gray-600">
            Guiding mindful movement, breath, and holistic wellness —
            online and offline.
          </p>

          <div className="mt-6 text-xs text-gray-400">
            © {new Date().getFullYear()} Yoga by Nandini. All rights reserved.
          </div>

        </div>
      </footer>
    </div>
  );
};

export default App;
