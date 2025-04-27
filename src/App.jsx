import React from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import BlogPage from "./pages/BlogPage";
import AdminPage from "./pages/AdminPage";

const App = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-[#fffdf9] font-serif">
      {/* Header */}
      <header className="bg-[#fefcf9] p-4 shadow-md text-center text-[#6B4F4F]">
        <nav className="space-x-4 text-lg">
          <Link to="/">Home</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/blog">Blog</Link>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPage />} />
            <Route path="/blog/:blogId" element={<BlogPage />} />

            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-[#f8f1ee] text-[#6B4F4F] text-center py-6 border-t border-[#e0d4d1]">
        <div className="container mx-auto px-4">
          <p className="text-sm sm:text-base">
            &copy; {new Date().getFullYear()} Powered by caffeine & clean code — Vivek Badodiya. All rights reserved.
          </p>
          <p className="text-xs text-[#6B4F4F] mt-4 italic">
            Vivek Badodiya™ — Engineering the Flow • Since 2023
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
