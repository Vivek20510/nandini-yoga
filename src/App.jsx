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
    </>
  );
};

export default App;
