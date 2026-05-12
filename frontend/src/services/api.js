import axios from "axios";

// ── Base instance ─────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// ── Request interceptor: attach JWT ──────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor: auto-refresh expired token ─────────────────────────
let isRefreshing = false;
let failedQueue  = [];

function processQueue(error, token = null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return api(original);
          })
          .catch(Promise.reject.bind(Promise));
      }

      original._retry = true;
      isRefreshing    = true;

      try {
        const refresh = localStorage.getItem("refresh_token");
        if (!refresh) throw new Error("No refresh token");

        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { headers: { Authorization: `Bearer ${refresh}` } }
        );

        localStorage.setItem("access_token", data.access_token);
        api.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
        processQueue(null, data.access_token);
        return api(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

// ── Helpers ───────────────────────────────────────────────────────────────────
function saveTokens({ access_token, refresh_token }) {
  if (access_token)  localStorage.setItem("access_token",  access_token);
  if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
}

function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════════════════
export const authAPI = {
  /** Register a new user */
  register: async (username, email, password) => {
    const { data } = await api.post("/auth/register", { username, email, password });
    saveTokens(data);
    return data;
  },

  /** Log in */
  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    saveTokens(data);
    return data;
  },

  /** Log out (clears local tokens) */
  logout: () => {
    clearTokens();
  },

  /** Get current user profile */
  me: async () => {
    const { data } = await api.get("/auth/me");
    return data;
  },

  /** Update profile (username, avatar_emoji, new_password) */
  updateMe: async (updates) => {
    const { data } = await api.patch("/auth/me", updates);
    return data;
  },

  /** Check if user is logged in (token present) */
  isLoggedIn: () => !!localStorage.getItem("access_token"),
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT  — countries, topics, questions
// ═══════════════════════════════════════════════════════════════════════════════
export const contentAPI = {
  /** List all countries, optional region filter & search */
  getCountries: async ({ region, q } = {}) => {
    const params = {};
    if (region && region !== "all") params.region = region;
    if (q) params.q = q;
    const { data } = await api.get("/content/countries", { params });
    return data;
  },

  /** Single country with full topics */
  getCountry: async (slug) => {
    const { data } = await api.get(`/content/countries/${slug}`);
    return data;
  },

  /** All topics for a country */
  getTopics: async (slug) => {
    const { data } = await api.get(`/content/countries/${slug}/topics`);
    return data;
  },

  /** Single topic by ID */
  getTopic: async (topicId) => {
    const { data } = await api.get(`/content/topics/${topicId}`);
    return data;
  },

  /** Quiz questions for a country */
  getQuestions: async (slug, { difficulty, topic, limit = 10 } = {}) => {
    const params = { limit };
    if (difficulty) params.difficulty = difficulty;
    if (topic)      params.topic      = topic;
    const { data } = await api.get(`/content/countries/${slug}/questions`, { params });
    return data;
  },

  /** Check a single answer */
  checkAnswer: async (questionId, answerIndex) => {
    const { data } = await api.post(`/content/questions/${questionId}/answer`, {
      answer_index: answerIndex,
    });
    return data;
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROGRESS — user progress, quiz submission, leaderboard
// ═══════════════════════════════════════════════════════════════════════════════
export const progressAPI = {
  /** All progress for the current user */
  getAll: async () => {
    const { data } = await api.get("/progress/");
    return data;
  },

  /** Progress for one country */
  getCountry: async (slug) => {
    const { data } = await api.get(`/progress/${slug}`);
    return data;
  },

  /** Mark a topic as read */
  markTopic: async (slug) => {
    const { data } = await api.post(`/progress/${slug}/topic`);
    return data;
  },

  /**
   * Submit a completed quiz
   * @param {string} slug  - country slug
   * @param {Array}  answers - [{ question_id, answer_index }, ...]
   */
  submitQuiz: async (slug, answers) => {
    const { data } = await api.post(`/progress/${slug}/quiz`, { answers });
    return data;
  },

  /** Global XP leaderboard */
  leaderboard: async () => {
    const { data } = await api.get("/progress/leaderboard");
    return data;
  },
};

// ── Default export for ad-hoc calls ──────────────────────────────────────────
export default api;