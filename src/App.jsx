import React from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home as HomeLucide,
  Mail,
  PenLine,
  Instagram,
  Phone,
  User
} from "lucide-react";

import Home from "./pages/Home";
import Contact from "./pages/Contact";
import BlogPage from "./pages/BlogPage";
import AdminPage from "./pages/AdminPage";
import About from "./pages/About"; 

const App = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-light-cream font-serif text-charcoal">
      {/* Header */}
      <header className="bg-soft-green shadow-md border-b border-light-grey">
        <nav className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center text-base sm:text-lg font-medium">
          <div className="flex space-x-6 items-center mb-4 sm:mb-0">
            <motion.div
              className="flex items-center gap-1 text-deep-navy hover:text-warm-coral transition duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <HomeLucide className="w-5 h-5" />
              <Link to="/">Home</Link>
            </motion.div>
            <motion.div
              className="flex items-center gap-1 text-deep-navy hover:text-warm-coral transition duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <User className="w-5 h-5" />
              <Link to="/about">About</Link>
            </motion.div>
            <motion.div
              className="flex items-center gap-1 text-deep-navy hover:text-warm-coral transition duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Mail className="w-5 h-5" />
              <Link to="/contact">Contact</Link>
            </motion.div>
            <motion.div
              className="flex items-center gap-1 text-deep-navy hover:text-warm-coral transition duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <PenLine className="w-5 h-5" />
              <Link to="/blog">Blog</Link>
            </motion.div>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} /> {/* ✅ New Route */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-soft-green text-light-grey text-center py-6 border-t border-light-grey mt-12">
        <div className="container mx-auto px-4">
          <p className="text-sm sm:text-base">
            &copy; {new Date().getFullYear()} Powered by caffeine & clean code —{" "}
            <span className="text-deep-navy font-semibold">
              Vivek Badodiya
            </span>. All rights reserved.
          </p>
          <p className="text-xs mt-2 italic">
            Vivek Badodiya™ — Engineering the Flow • Since 2023
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
