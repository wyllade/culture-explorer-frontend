import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { authAPI } from "./api.js";
import Home      from "./pages/Home.jsx";
import Explore   from "./pages/Explore.jsx";
import Country   from "./pages/Country.jsx";
import Quiz      from "./pages/Quiz.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login     from "./pages/Login.jsx";
import Register  from "./pages/Register.jsx";
import "./App.css";

/* ── Navbar ─────────────────────────────────────────────────────── */
function Navbar() {
  const [open,   setOpen]   = useState(false);
  const [scroll, setScroll] = useState(false);
  const [user,   setUser]   = useState(authAPI.cached());
  const location = useLocation();

  // close mobile menu on route change
  useEffect(() => setOpen(false), [location]);

  // scroll shadow
  useEffect(() => {
    const fn = () => setScroll(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // sync user from storage
  useEffect(() => setUser(authAPI.cached()), [location]);

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className={`navbar${scroll ? " navbar--scrolled" : ""}`}>
      <div className="navbar-inner container">

        <NavLink to="/" className="navbar-logo">
          Culture<span>Quest</span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="navbar-links">
          <NavLink to="/"         end className={({isActive})=> isActive ? "nlink active":"nlink"}>Home</NavLink>
          <NavLink to="/explore"  className={({isActive})=> isActive ? "nlink active":"nlink"}>Explore</NavLink>
          <NavLink to="/quiz"     className={({isActive})=> isActive ? "nlink active":"nlink"}>Quiz</NavLink>
          {user && <NavLink to="/dashboard" className={({isActive})=> isActive ? "nlink active":"nlink"}>My Progress</NavLink>}
        </nav>

        <div className="navbar-actions">
          {user ? (
            <>
              <NavLink to="/dashboard" className="nav-avatar" title={user.username}>
                {user.avatar_emoji || "🌍"}
              </NavLink>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <NavLink to="/login"    className="btn btn-ghost   btn-sm">Sign In</NavLink>
              <NavLink to="/register" className="btn btn-saffron btn-sm">Get Started</NavLink>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button className={`hamburger${open?" open":""}`} onClick={()=>setOpen(!open)} aria-label="menu">
          <span/><span/><span/>
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`mobile-drawer${open?" open":""}`}>
        <NavLink to="/"         end   className="mdlink">🏠 Home</NavLink>
        <NavLink to="/explore"        className="mdlink">🌍 Explore</NavLink>
        <NavLink to="/quiz"           className="mdlink">🧠 Quiz</NavLink>
        {user && <NavLink to="/dashboard" className="mdlink">📊 My Progress</NavLink>}
        <hr className="divider" style={{margin:"8px 0"}}/>
        {user ? (
          <button className="mdlink mdlink--btn" onClick={handleLogout}>Sign Out</button>
        ) : (
          <>
            <NavLink to="/login"    className="mdlink">Sign In</NavLink>
            <NavLink to="/register" className="mdlink mdlink--cta">Get Started →</NavLink>
          </>
        )}
      </div>
    </header>
  );
}

/* ── Footer ─────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">CultureQuest</div>
          <p>Bringing the world's living cultures<br/>to curious minds everywhere.</p>
        </div>
        <div className="footer-col">
          <h5>Explore</h5>
          <NavLink to="/explore">All Cultures</NavLink>
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

/* ── App shell ──────────────────────────────────────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/explore"       element={<Explore />} />
            <Route path="/country/:slug" element={<Country />} />
            <Route path="/quiz"          element={<Quiz />} />
            <Route path="/quiz/:slug"    element={<Quiz />} />
            <Route path="/dashboard"     element={<Dashboard />} />
            <Route path="/login"         element={<Login />} />
            <Route path="/register"      element={<Register />} />
            <Route path="*"              element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div style={{textAlign:"center",padding:"120px 28px"}}>
      <div style={{fontSize:72,marginBottom:20}}>🗺️</div>
      <h2 className="display-md">Page not found</h2>
      <p className="lead" style={{marginBottom:32}}>Looks like this culture doesn't exist yet.</p>
      <NavLink to="/" className="btn btn-ink btn-lg">Back to Home</NavLink>
    </div>
  );
}