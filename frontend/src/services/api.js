import axios from "axios";

// Create an Axios instance with a base URL and default headers
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust this to match your backend server URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login if token is invalid or expired
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API service functions
const apiService = {
  // Authentication
  login: (credentials) => api.post("/auth/login", credentials),

  // Domains
  getDomains: () => api.get("/domains"),
  getDomain: (id) => api.get(`/domains/${id}`),
  createDomain: (domain) => api.post("/domains", domain),
  updateDomain: (id, domain) => api.put(`/domains/${id}`, domain),
  deleteDomain: (id) => api.delete(`/domains/${id}`),

  // KPIs
  getKPIs: (domainId) => api.get("/kpis", { params: { domain_id: domainId } }),
  getKPI: (id) => api.get(`/kpis/${id}`),
  createKPI: (kpi) => api.post("/kpis", kpi),
  updateKPI: (id, kpi) => api.put(`/kpis/${id}`, kpi),
  deleteKPI: (id) => api.delete(`/kpis/${id}`),

  // Use Cases
  getUseCases: (domainId) =>
    api.get("/useCases", { params: { domain_id: domainId } }),
  getUseCase: (id) => api.get(`/useCases/${id}`),
  createUseCase: (useCase) => api.post("/useCases", useCase),
  updateUseCase: (id, useCase) => api.put(`/useCases/${id}`, useCase),
  deleteUseCase: (id) => api.delete(`/useCases/${id}`),

  // Capabilities
  getCapabilities: (domainId) =>
    api.get("/capabilities", { params: { domain_id: domainId } }),
  getCapability: (id) => api.get(`/capabilities/${id}`),
  createCapability: (capability) => api.post("/capabilities", capability),
  updateCapability: (id, capability) =>
    api.put(`/capabilities/${id}`, capability),
  deleteCapability: (id) => api.delete(`/capabilities/${id}`),
};

export default apiService;
