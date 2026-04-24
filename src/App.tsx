import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import CategoryPage from './pages/CategoryPage';
import { BlogListPage, BlogDetailPage } from './pages/BlogPages';
import StaticPage from './pages/StaticPage';

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  // Domain Protection & Cannonical Redirection logic
  useEffect(() => {
    const hostname = window.location.hostname;
    
    // Safety check: Don't redirect in development or preview environments
    const isDev = hostname === 'localhost' || 
                  hostname === '127.0.0.1' || 
                  hostname.includes('asia-east1.run.app') || 
                  hostname.includes('google.com') ||
                  hostname.includes('webcontainer.io');

    if (!isDev && hostname !== "classroom6x.store") {
      window.location.replace(`https://classroom6x.store${window.location.pathname}${window.location.search}`);
    }
  }, []);

  return (
    <Router>
      <Layout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
        <Routes>
          <Route path="/" element={<HomePage searchQuery={searchQuery} />} />
          <Route path="/game/:id" element={<GamePage />} />
          {/* Support legacy paths without /game/ prefix */}
          <Route path="/basket-random" element={<Navigate to="/game/basket-random" replace />} />
          <Route path="/slope" element={<Navigate to="/game/slope" replace />} />
          <Route path="/run-3" element={<Navigate to="/game/run-3" replace />} />
          
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/blogs" element={<BlogListPage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          
          <Route path="/about" element={<StaticPage pageName="About Us" />} />
          <Route path="/contact" element={<StaticPage pageName="Contact Us" />} />
          <Route path="/privacy" element={<StaticPage pageName="Privacy Policy" />} />
          <Route path="/terms" element={<StaticPage pageName="Terms of Service" />} />
          
          {/* Catch all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
