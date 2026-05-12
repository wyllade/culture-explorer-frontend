import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CultureCard from "../components/CultureCard";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Fallback data if API is offline ──────────────────────────────────────────
const FALLBACK_COUNTRIES = [
  {
    id: 1, slug: "japan", name: "Japan", flag_emoji: "🇯🇵",
    region: "asia", description: "Ancient samurai, cherry blossoms, tea ceremony & anime.",
    gradient: "linear-gradient(145deg,#f7c35f,#e84c2b)",
    tags: ["History", "Arts", "Food"], topic_count: 6, question_count: 24, user_pct: 35,
  },
  {
    id: 2, slug: "india", name: "India", flag_emoji: "🇮🇳",
    region: "asia", description: "Yoga, Diwali, Taj Mahal & ancient epics.",
    gradient: "linear-gradient(145deg,#f5a623,#6b3fa0)",
    tags: ["Spirituality", "Festivals"], topic_count: 8, question_count: 30, user_pct: 0,
  },
  {
    id: 3, slug: "france", name: "France", flag_emoji: "🇫🇷",
    region: "europe", description: "Revolution, haute cuisine, art & the joie de vivre.",
    gradient: "linear-gradient(145deg,#1b4fa8,#e84c2b)",
    tags: ["Fashion", "Cuisine"], topic_count: 6, question_count: 22, user_pct: 0,
  },
  {
    id: 4, slug: "kenya", name: "Kenya", flag_emoji: "🇰🇪",
    region: "africa", description: "Maasai warriors, safari culture & Swahili heritage.",
    gradient: "linear-gradient(145deg,#1a7a5a,#e84c2b)",
    tags: ["Nature", "Heritage"], topic_count: 5, question_count: 18, user_pct: 0,
  },
  {
    id: 5, slug: "brazil", name: "Brazil", flag_emoji: "🇧🇷",
    region: "americas", description: "Carnival, samba, Amazonian heritage & football.",
    gradient: "linear-gradient(145deg,#1b4fa8,#1a7a5a)",
    tags: ["Music", "Nature"], topic_count: 5, question_count: 20, user_pct: 0,
  },
  {
    id: 6, slug: "morocco", name: "Morocco", flag_emoji: "🇲🇦",
    region: "africa", description: "Medinas, souks, and Berber heritage.",
    gradient: "linear-gradient(145deg,#1a7a5a,#f5a623)",
    tags: ["Architecture", "Cuisine"], topic_count: 5, question_count: 18, user_pct: 0,
  },
];

const REGIONS = [
  { value: "all",      label: "All Regions" },
  { value: "asia",     label: "Asia-Pacific" },
  { value: "africa",   label: "Africa" },
  { value: "europe",   label: "Europe" },
  { value: "americas", label: "Americas" },
  { value: "mideast",  label: "Middle East" },
];

const STATS = [
  { val: "40+",   label: "Cultures" },
  { val: "500+",  label: "Lessons" },
  { val: "2,000+",label: "Quiz Questions" },
  { val: "12K+",  label: "Active Learners" },
];

export default function Home() {
  const [countries, setCountries]   = useState([]);
  const [filtered,  setFiltered]    = useState([]);
  const [search,    setSearch]      = useState("");
  const [region,    setRegion]      = useState("all");
  const [loading,   setLoading]     = useState(true);
  const [error,     setError]       = useState(null);

  // ── Fetch countries from API ────────────────────────────────────────────────
  useEffect(() => {
    const controller = new AbortController();

    async function fetchCountries() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/content/countries`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        setCountries(data);
        setFiltered(data);
      } catch (err) {
        if (err.name === "AbortError") return;
        // API offline — use fallback silently
        setCountries(FALLBACK_COUNTRIES);
        setFiltered(FALLBACK_COUNTRIES);
        setError("Using demo data — connect your Flask API for live content.");
      } finally {
        setLoading(false);
      }
    }

    fetchCountries();
    return () => controller.abort();
  }, []);

  // ── Filter whenever search or region changes ─────────────────────────────
  useEffect(() => {
    const q = search.toLowerCase();
    const result = countries.filter((c) => {
      const matchRegion = region === "all" || c.region === region;
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.tags || []).some((t) => t.toLowerCase().includes(q)) ||
        (c.description || "").toLowerCase().includes(q);
      return matchRegion && matchSearch;
    });
    setFiltered(result);
  }, [search, region, countries]);

  return (
    <div className="home-page">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="home-hero">
        <div className="hero-bg-circle hero-bg-circle--1" />
        <div className="hero-bg-circle hero-bg-circle--2" />

        <div className="container hero-inner">
          <div className="hero-content anim-fade-up">
            <span className="hero-label">✨ 40+ Cultures · 500+ Lessons</span>
            <h1 className="hero-title">
              Discover<br />
              <em className="text-coral">Living</em>{" "}
              <span className="text-cobalt">Cultures</span>
            </h1>
            <p className="lead hero-desc">
              Explore traditions, history, arts, food, and stories from every
              corner of the globe — with quizzes that make learning unforgettable.
            </p>
            <div className="hero-ctas">
              <a href="#explore" className="btn btn-primary btn-lg">
                Start Exploring →
              </a>
              <Link to="/quiz" className="btn btn-ghost btn-lg">
                Take a Quiz
              </Link>
            </div>

            <div className="hero-proof">
              <div className="proof-avatars">
                {["🧑","👩","👦","🧕","👨"].map((e, i) => (
                  <span key={i} className="proof-avatar">{e}</span>
                ))}
              </div>
              <p className="proof-text">
                <strong>12,000+ learners</strong> exploring right now
              </p>
            </div>
          </div>

          <div className="hero-visual anim-fade-up-2">
            <div className="hero-globe anim-float">🌏</div>
            {[
              { label: "🇯🇵 Japan",   cls: "fc fc--1" },
              { label: "🇮🇳 India",   cls: "fc fc--2" },
              { label: "🇲🇦 Morocco", cls: "fc fc--3" },
              { label: "🇧🇷 Brazil",  cls: "fc fc--4" },
            ].map(({ label, cls }) => (
              <div key={label} className={cls}>{label}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────────────────────── */}
      <div className="stats-strip">
        <div className="container stats-inner">
          {STATS.map(({ val, label }) => (
            <div key={label} className="stats-item">
              <div className="stats-val">{val}</div>
              <div className="stats-lbl">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── EXPLORE GRID ──────────────────────────────────────────────────── */}
      <section id="explore" className="section container">

        {/* Header */}
        <div className="explore-header">
          <div>
            <p className="caption">Featured Cultures</p>
            <h2 className="display-md" style={{ marginTop: 8 }}>
              Start your journey
            </h2>
          </div>
          <Link to="/explore" className="btn btn-outline">
            View all 40+ →
          </Link>
        </div>

        {/* Error banner */}
        {error && (
          <div className="api-notice">
            ⚠️ {error}
          </div>
        )}

        {/* Search + filters */}
        <div className="explore-controls">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="input search-input"
              type="text"
              placeholder="Search cultures, topics, foods…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="search-clear"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >×</button>
            )}
          </div>

          <div className="filter-pills">
            {REGIONS.map(({ value, label }) => (
              <button
                key={value}
                className={`filter-pill${region === value ? " active" : ""}`}
                onClick={() => setRegion(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="cards-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-skeleton" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🌍</div>
            <h3>No cultures found</h3>
            <p>Try a different search or region filter.</p>
            <button
              className="btn btn-outline"
              onClick={() => { setSearch(""); setRegion("all"); }}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Cards */}
        {!loading && filtered.length > 0 && (
          <div className="cards-grid">
            {filtered.map((country) => (
              <CultureCard key={country.id || country.slug} country={country} />
            ))}
          </div>
        )}

      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      <section className="section container">
        <div className="cta-banner">
          <div>
            <h2>Ready to begin your<br />cultural journey?</h2>
            <p>Free to start — explore Japan, India, Morocco and more today.</p>
          </div>
          <Link to="/explore" className="btn btn-saffron btn-lg">
            Start for Free →
          </Link>
        </div>
      </section>

    </div>
  );
}