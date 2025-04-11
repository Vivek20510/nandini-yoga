import React from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Contact from "./pages/Contact";

const App = () => {
  const location = useLocation();

  return (
    <>
      <header className="bg-[#fefcf9] p-4 shadow-md text-center text-[#6B4F4F]">
        <nav className="space-x-4 text-lg">
          <Link to="/">Home</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </header>

      {/* AnimatePresence wraps routes for animation */}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-[#f8f1ee] text-[#6B4F4F] text-center py-6 mt-10 border-t border-[#e0d4d1]">
        <div className="container mx-auto px-4">
          <p className="text-sm sm:text-base">
            &copy; {new Date().getFullYear()} Crafted with ♥ by Vivek Badodiya. All rights reserved.
          </p>
          <p className="text-xs text-[#6B4F4F] mt-4 italic">
  Vivek Badodiya™ — Crafting Digital Elegance • Est. 2024
</p>

        </div>
      </footer>
    </>
  );
};

export default App;
