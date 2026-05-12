import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/home";
import "./App.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo">
          Culture<span className="logo-accent">Quest</span>
        </NavLink>

        {/* Desktop links */}
        <nav className="navbar-links">
          <NavLink to="/"        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} end>Explore</NavLink>
          <NavLink to="/quiz"    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Quiz</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>My Progress</NavLink>
        </nav>

        <div className="navbar-actions">
          <NavLink to="/login"    className="btn btn-ghost btn-sm">Sign In</NavLink>
          <NavLink to="/register" className="btn btn-saffron btn-sm">Get Started</NavLink>
        </div>

        {/* Mobile hamburger */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`ham-line ${menuOpen ? "open" : ""}`} />
          <span className={`ham-line ${menuOpen ? "open" : ""}`} />
          <span className={`ham-line ${menuOpen ? "open" : ""}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="mobile-menu">
          <NavLink to="/"          onClick={() => setMenuOpen(false)} className="mobile-link">Explore</NavLink>
          <NavLink to="/quiz"      onClick={() => setMenuOpen(false)} className="mobile-link">Quiz</NavLink>
          <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className="mobile-link">My Progress</NavLink>
          <NavLink to="/login"     onClick={() => setMenuOpen(false)} className="mobile-link">Sign In</NavLink>
          <NavLink to="/register"  onClick={() => setMenuOpen(false)} className="mobile-link mobile-link--cta">Get Started</NavLink>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">CultureQuest</div>
          <p>Bringing the world's living cultures<br />to curious minds everywhere.</p>
        </div>
        <div className="footer-col">
          <h5>Explore</h5>
          <NavLink to="/">All Cultures</NavLink>
          <NavLink to="/quiz">Daily Quiz</NavLink>
        </div>
        <div className="footer-col">
          <h5>Account</h5>
          <NavLink to="/dashboard">My Progress</NavLink>
          <NavLink to="/login">Sign In</NavLink>
          <NavLink to="/register">Register</NavLink>
        </div>
        <div className="footer-col">
          <h5>About</h5>
          <a href="#">Our Mission</a>
          <a href="#">Blog</a>
          <a href="#">Contact</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© 2025 CultureQuest · Built with curiosity 🌍</p>
        <p>Privacy · Terms</p>
      </div>
    </footer>
  );
}

// Placeholder pages (swap out for real pages as you build them)
function ComingSoon({ title }) {
  return (
    <div className="coming-soon">
      <div className="cs-emoji">🚧</div>
      <h2>{title}</h2>
      <p>This page is coming soon. Start on the <NavLink to="/">home page</NavLink>.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/"            element={<Home />} />
            <Route path="/country/:slug" element={<ComingSoon title="Country Detail" />} />
            <Route path="/quiz"        element={<ComingSoon title="Quiz" />} />
            <Route path="/dashboard"   element={<ComingSoon title="My Progress" />} />
            <Route path="/login"       element={<ComingSoon title="Sign In" />} />
            <Route path="/register"    element={<ComingSoon title="Create Account" />} />
            <Route path="*"            element={<ComingSoon title="Page Not Found" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}