import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CultureCard from "../components/CultureCard";
import { contentAPI } from "../services/api";
import "../styles/Home.css";

const FALLBACK_COUNTRIES = [
  { id:1, slug:"japan",   name:"Japan",   flag_emoji:"🇯🇵", region:"asia",     description:"Ancient samurai, cherry blossoms, tea ceremony & anime.",      gradient:"linear-gradient(145deg,#f7c35f,#e84c2b)", tags:["History","Arts","Food"],          topic_count:6, question_count:24, user_pct:35 },
  { id:2, slug:"india",   name:"India",   flag_emoji:"🇮🇳", region:"asia",     description:"Yoga, Diwali, Taj Mahal & ancient epics.",                      gradient:"linear-gradient(145deg,#f5a623,#6b3fa0)", tags:["Spirituality","Festivals"],       topic_count:8, question_count:30, user_pct:0  },
  { id:3, slug:"france",  name:"France",  flag_emoji:"🇫🇷", region:"europe",   description:"Revolution, haute cuisine, art & the joie de vivre.",           gradient:"linear-gradient(145deg,#1b4fa8,#e84c2b)", tags:["Fashion","Cuisine"],              topic_count:6, question_count:22, user_pct:0  },
  { id:4, slug:"kenya",   name:"Kenya",   flag_emoji:"🇰🇪", region:"africa",   description:"Maasai warriors, safari culture & Swahili coastal heritage.",   gradient:"linear-gradient(145deg,#1a7a5a,#e84c2b)", tags:["Nature","Heritage"],             topic_count:5, question_count:18, user_pct:0  },
  { id:5, slug:"brazil",  name:"Brazil",  flag_emoji:"🇧🇷", region:"americas", description:"Carnival, samba, Amazonian heritage & football.",               gradient:"linear-gradient(145deg,#1b4fa8,#1a7a5a)", tags:["Music","Nature"],                topic_count:5, question_count:20, user_pct:0  },
  { id:6, slug:"morocco", name:"Morocco", flag_emoji:"🇲🇦", region:"africa",   description:"Medinas, souks, and Berber heritage at the crossroads of worlds.",gradient:"linear-gradient(145deg,#1a7a5a,#f5a623)", tags:["Architecture","Cuisine"],         topic_count:5, question_count:18, user_pct:0  },
  { id:7, slug:"greece",  name:"Greece",  flag_emoji:"🇬🇷", region:"europe",   description:"Gods, democracy, philosophy & the Olympic Games.",              gradient:"linear-gradient(145deg,#1b4fa8,#f5f5dc)", tags:["Mythology","History"],            topic_count:6, question_count:24, user_pct:0  },
  { id:8, slug:"mexico",  name:"Mexico",  flag_emoji:"🇲🇽", region:"americas", description:"Aztec legacy, Día de los Muertos & vibrant cuisine.",           gradient:"linear-gradient(145deg,#1a7a5a,#e84c2b)", tags:["Ancient","Festivals"],           topic_count:6, question_count:22, user_pct:0  },
];

const REGIONS = [
  { value:"all",      label:"All" },
  { value:"asia",     label:"Asia-Pacific" },
  { value:"africa",   label:"Africa" },
  { value:"europe",   label:"Europe" },
  { value:"americas", label:"Americas" },
  { value:"mideast",  label:"Middle East" },
];

const STATS = [
  { val:"40+",    label:"Cultures" },
  { val:"500+",   label:"Lessons" },
  { val:"2,000+", label:"Quiz Questions" },
  { val:"12K+",   label:"Active Learners" },
];

const FLOAT_CHIPS = [
  { label:"🇯🇵 Japan",   cls:"fc fc--1" },
  { label:"🇮🇳 India",   cls:"fc fc--2" },
  { label:"🇲🇦 Morocco", cls:"fc fc--3" },
  { label:"🇧🇷 Brazil",  cls:"fc fc--4" },
];

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [filtered,  setFiltered]  = useState([]);
  const [search,    setSearch]    = useState("");
  const [region,    setRegion]    = useState("all");
  const [loading,   setLoading]   = useState(true);
  const [apiError,  setApiError]  = useState(null);

  // ── Fetch from API ──────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setApiError(null);
        const data = await contentAPI.getCountries();
        if (!cancelled) {
          setCountries(data);
          setFiltered(data);
        }
      } catch {
        if (!cancelled) {
          setCountries(FALLBACK_COUNTRIES);
          setFiltered(FALLBACK_COUNTRIES);
          setApiError("Demo mode — start your Flask API for live data.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ── Client-side filter ──────────────────────────────────────────────────────
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      countries.filter((c) => {
        const matchRegion  = region === "all" || c.region === region;
        const matchSearch  = !q ||
          c.name.toLowerCase().includes(q) ||
          (c.description || "").toLowerCase().includes(q) ||
          (c.tags || []).some((t) => t.toLowerCase().includes(q));
        return matchRegion && matchSearch;
      })
    );
  }, [search, region, countries]);

  return (
    <div className="home-page">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="home-hero">
        <div className="hero-blob hero-blob--1" />
        <div className="hero-blob hero-blob--2" />

        <div className="container hero-inner">

          {/* Left */}
          <div className="hero-content anim-fade-up">
            <span className="hero-pill">✨ 40+ Cultures · 500+ Lessons</span>

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
              <a href="#explore" className="btn btn-primary btn-lg">Start Exploring →</a>
              <Link to="/quiz"   className="btn btn-ghost  btn-lg">Take a Quiz</Link>
            </div>

            <div className="hero-proof">
              <div className="proof-avatars">
                {["🧑","👩","👦","🧕","👨"].map((e,i) => (
                  <span key={i} className="proof-avatar">{e}</span>
                ))}
              </div>
              <span className="proof-label">
                <strong>12,000+ learners</strong> exploring right now
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="hero-visual anim-fade-up-2">
            <div className="hero-globe anim-float">🌏</div>
            {FLOAT_CHIPS.map(({ label, cls }) => (
              <div key={label} className={cls}>{label}</div>
            ))}
          </div>

        </div>
      </section>

      {/* ── STATS STRIP ─────────────────────────────────────────────────── */}
      <div className="stats-strip">
        <div className="container stats-row">
          {STATS.map(({ val, label }) => (
            <div key={label} className="stat-item">
              <div className="stat-val">{val}</div>
              <div className="stat-lbl">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── EXPLORE ─────────────────────────────────────────────────────── */}
      <section id="explore" className="section container">

        {/* Section header */}
        <div className="explore-header">
          <div>
            <p className="caption">Featured Cultures</p>
            <h2 className="display-md" style={{ marginTop: 8 }}>Start your journey</h2>
          </div>
          <Link to="/explore" className="btn btn-outline">View all 40+ →</Link>
        </div>

        {/* API notice */}
        {apiError && <div className="api-notice">⚠️ {apiError}</div>}

        {/* Controls */}
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
              <button className="search-clear" onClick={() => setSearch("")}>×</button>
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

        {/* Skeletons */}
        {loading && (
          <div className="cards-grid">
            {[...Array(8)].map((_,i) => <div key={i} className="card-skeleton" />)}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🌍</div>
            <h3>No cultures found</h3>
            <p>Try a different search or region.</p>
            <button className="btn btn-outline" onClick={() => { setSearch(""); setRegion("all"); }}>
              Clear filters
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <div className="cards-grid">
            {filtered.map((c) => (
              <CultureCard key={c.id ?? c.slug} country={c} />
            ))}
          </div>
        )}

      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────────────── */}
      <section className="section-sm container">
        <div className="cta-banner">
          <div>
            <h2>Ready to begin your<br />cultural journey?</h2>
            <p>Free to start — explore Japan, India, Morocco and more today.</p>
          </div>
          <Link to="/register" className="btn btn-saffron btn-lg">Start for Free →</Link>
        </div>
      </section>

    </div>
  );
}