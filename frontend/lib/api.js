import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let refreshing = false;
let waitQueue = [];

const flush = (err) => {
  waitQueue.forEach((p) => (err ? p.reject(err) : p.resolve()));
  waitQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const req = err.config;
    const is401 = err.response?.status === 401;
    const isExpired = err.response?.data?.code === "TOKEN_EXPIRED";

    if (!is401 || !isExpired || req._retry) return Promise.reject(err);

    if (refreshing) {
      return new Promise((resolve, reject) =>
        waitQueue.push({ resolve, reject }),
      ).then(() => api(req));
    }

    req._retry = true;
    refreshing = true;

    try {
      await api.post("/auth/refresh");
      flush(null);
      return api(req);
    } catch (e) {
      flush(e);
      window.location.href = "/login";
      return Promise.reject(e);
    } finally {
      refreshing = false;
    }
  },
);

export default api;
