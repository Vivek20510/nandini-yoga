import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">

          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Yoga by Nandini
            </h3>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Guiding mindful movement, breath, and holistic wellness —
              online and offline.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Quick Links
            </h4>
            <div className="flex flex-col space-y-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-[#1D3C52] transition">Home</Link>
              <Link to="/about" className="hover:text-[#1D3C52] transition">About</Link>
              <Link to="/blog" className="hover:text-[#1D3C52] transition">Blog</Link>
              <Link to="/contact" className="hover:text-[#1D3C52] transition">Contact</Link>
            </div>
          </div>

          {/* Future Section Placeholder */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Stay Connected
            </h4>
            <p className="text-sm text-gray-600">
              Join our wellness journey and stay updated with upcoming
              programs and events.
            </p>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Yoga by Nandini. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;