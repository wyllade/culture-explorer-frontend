import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ── Axios instance ─────────────────────────────────────────── */
const api = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

/* ── Attach token on every request ─────────────────────────── */
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("cq_access");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

/* ── Auto-refresh on 401 ────────────────────────────────────── */
let refreshing = false;
let queue = [];

const flush = (err, token) =>
  queue.forEach((p) => (err ? p.reject(err) : p.resolve(token)));

api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const orig = err.config;
    if (err.response?.status !== 401 || orig._retry) return Promise.reject(err);

    if (refreshing) {
      return new Promise((resolve, reject) => queue.push({ resolve, reject }))
        .then((t) => { orig.headers.Authorization = `Bearer ${t}`; return api(orig); });
    }

    orig._retry = true;
    refreshing  = true;

    try {
      const refresh = localStorage.getItem("cq_refresh");
      if (!refresh) throw new Error("no refresh token");

      const { data } = await axios.post(`${BASE}/auth/refresh`, {}, {
        headers: { Authorization: `Bearer ${refresh}` },
      });
      localStorage.setItem("cq_access", data.access_token);
      api.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
      flush(null, data.access_token);
      return api(orig);
    } catch (e) {
      flush(e);
      localStorage.removeItem("cq_access");
      localStorage.removeItem("cq_refresh");
      localStorage.removeItem("cq_user");
      window.location.href = "/login";
      return Promise.reject(e);
    } finally {
      refreshing = false;
      queue = [];
    }
  }
);

/* ═══════════════════════════════════════════
   AUTH
═══════════════════════════════════════════ */
export const authAPI = {
  register: async (username, email, password) => {
    const { data } = await api.post("/auth/register", { username, email, password });
    localStorage.setItem("cq_access",  data.access_token);
    localStorage.setItem("cq_refresh", data.refresh_token);
    localStorage.setItem("cq_user",    JSON.stringify(data.user));
    return data;
  },

  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("cq_access",  data.access_token);
    localStorage.setItem("cq_refresh", data.refresh_token);
    localStorage.setItem("cq_user",    JSON.stringify(data.user));
    return data;
  },

  logout: () => {
    ["cq_access","cq_refresh","cq_user"].forEach((k) => localStorage.removeItem(k));
  },

  me: async () => {
    const { data } = await api.get("/auth/me");
    localStorage.setItem("cq_user", JSON.stringify(data));
    return data;
  },

  updateMe: async (payload) => {
    const { data } = await api.patch("/auth/me", payload);
    localStorage.setItem("cq_user", JSON.stringify(data));
    return data;
  },

  cached: () => {
    try { return JSON.parse(localStorage.getItem("cq_user")); } catch { return null; }
  },

  isLoggedIn: () => !!localStorage.getItem("cq_access"),
};

/* ═══════════════════════════════════════════
   CONTENT
═══════════════════════════════════════════ */
export const contentAPI = {
  getCountries: async (params = {}) => {
    const { data } = await api.get("/content/countries", { params });
    return data;
  },
  getCountry: async (slug) => {
    const { data } = await api.get(`/content/countries/${slug}`);
    return data;
  },
  getTopics: async (slug) => {
    const { data } = await api.get(`/content/countries/${slug}/topics`);
    return data;
  },
  getTopic: async (id) => {
    const { data } = await api.get(`/content/topics/${id}`);
    return data;
  },
  getQuestions: async (slug, params = {}) => {
    const { data } = await api.get(`/content/countries/${slug}/questions`, { params });
    return data;
  },
  checkAnswer: async (qid, answer_index) => {
    const { data } = await api.post(`/content/questions/${qid}/answer`, { answer_index });
    return data;
  },
};

/* ═══════════════════════════════════════════
   PROGRESS
═══════════════════════════════════════════ */
export const progressAPI = {
  getAll:       async ()           => { const { data } = await api.get("/progress/");                          return data; },
  getCountry:   async (slug)       => { const { data } = await api.get(`/progress/${slug}`);                   return data; },
  markTopic:    async (slug)       => { const { data } = await api.post(`/progress/${slug}/topic`);            return data; },
  submitQuiz:   async (slug, ans)  => { const { data } = await api.post(`/progress/${slug}/quiz`, {answers:ans}); return data; },
  leaderboard:  async ()           => { const { data } = await api.get("/progress/leaderboard");               return data; },
};

export default api;