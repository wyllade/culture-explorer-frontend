import { Link } from "react-router-dom";

const TAG_COLORS = {
  History:      "badge-cobalt",
  Arts:         "badge-violet",
  Food:         "badge-coral",
  Cuisine:      "badge-coral",
  Spirituality: "badge-violet",
  Festivals:    "badge-saffron",
  Nature:       "badge-jade",
  Heritage:     "badge-jade",
  Music:        "badge-rose",
  Fashion:      "badge-rose",
  Architecture: "badge-jade",
  Ancient:      "badge-saffron",
  Mythology:    "badge-cobalt",
};

export default function CultureCard({ country }) {
  // Legacy: accept plain string name
  if (typeof country === "string") {
    return (
      <div className="country-card">
        <div className="cc-thumb" style={{ background: "var(--code-bg)" }}>
          <span style={{ fontSize: 56 }}>🌍</span>
        </div>
        <div className="cc-body"><h3>{country}</h3></div>
      </div>
    );
  }

  const {
    slug           = "unknown",
    name           = "Unknown",
    flag_emoji     = "🌍",
    description    = "",
    gradient       = "linear-gradient(145deg, var(--code-bg), var(--cream2))",
    tags           = [],
    topic_count    = 0,
    question_count = 0,
    user_pct       = 0,
  } = country;

  const pct = Math.min(Math.max(Number(user_pct) || 0, 0), 100);

  return (
    <Link to={`/country/${slug}`} className="country-card">

      {/* Thumbnail */}
      <div className="cc-thumb" style={{ background: gradient }}>
        <span style={{ fontSize: 60 }}>{flag_emoji}</span>
        {pct > 0
          ? <span className="cc-pct-badge">{pct}% done</span>
          : <span className="cc-explore-badge">Explore</span>
        }
      </div>

      {/* Body */}
      <div className="cc-body">

        {tags.length > 0 && (
          <div className="cc-tags">
            {tags.slice(0, 2).map((tag) => (
              <span key={tag} className={`badge ${TAG_COLORS[tag] || "badge-accent"}`}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3>{name}</h3>
        <p>{description}</p>

        <div className="cc-meta">
          <div className="cc-stats">
            {topic_count    > 0 && <span>📚 {topic_count} topics</span>}
            {question_count > 0 && <span>❓ {question_count} Q's</span>}
          </div>
          <span className="cc-arrow">→</span>
        </div>

        <div className="cc-progress">
          <div className="cc-progress-fill" style={{ width: `${pct}%` }} />
        </div>

      </div>
    </Link>
  );
}