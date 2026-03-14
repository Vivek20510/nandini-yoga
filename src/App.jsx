import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Contact from "./pages/Contact";
import BlogPage from "./pages/BlogPage";
import AdminPage from "./pages/AdminPage";
import About from "./pages/About";
import BlogDetailPage from "./pages/BlogDetailPage";
import GalleryPage from "./pages/GalleryPage";
import NotFound from "./pages/NotFound";

const App = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        
        {/* Public Pages Wrapped in Layout */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/about"
          element={
            <MainLayout>
              <About />
            </MainLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <MainLayout>
              <Contact />
            </MainLayout>
          }
        />

        <Route
          path="/blog"
          element={
            <MainLayout>
              <BlogPage />
            </MainLayout>
          }
        />

        <Route
          path="/blog/:id"
          element={
            <MainLayout>
              <BlogDetailPage />
            </MainLayout>
          }
        />

        <Route
          path="/gallery"
          element={
            <MainLayout>
              <GalleryPage />
            </MainLayout>
          }
        />

        {/* Admin WITHOUT Main Layout */}
        <Route path="/admin" element={<AdminPage />} />

        {/* 404 Catch-all */}
        <Route
          path="*"
          element={
            <MainLayout>
              <NotFound />
            </MainLayout>
          }
        />

      </Routes>
    </AnimatePresence>
  );
};

export default App;