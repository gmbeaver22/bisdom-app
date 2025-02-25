import axios from "axios";

// Create an Axios instance with a base URL and default headers
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust this to match your backend server URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request and response interceptors (unchanged from Phase 1)
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API service functions
const apiService = {
  // Authentication (unchanged)
  login: (credentials) => api.post("/auth/login", credentials),

  // Domains (unchanged)
  getDomains: () => api.get("/domains"),
  getDomain: (id) => api.get(`/domains/${id}`),
  createDomain: (domain) => api.post("/domains", domain),
  updateDomain: (id, domain) => api.put(`/domains/${id}`, domain),
  deleteDomain: (id) => api.delete(`/domains/${id}`),

  // KPIs (unchanged)
  getKPIs: (domainId) => api.get("/kpis", { params: { domain_id: domainId } }),
  getKPI: (id) => api.get(`/kpis/${id}`),
  createKPI: (kpi) => api.post("/kpis", kpi),
  updateKPI: (id, kpi) => api.put(`/kpis/${id}`, kpi),
  deleteKPI: (id) => api.delete(`/kpis/${id}`),

  // Use Cases (unchanged)
  getUseCases: (domainId) =>
    api.get("/useCases", { params: { domain_id: domainId } }),
  getUseCase: (id) => api.get(`/useCases/${id}`),
  createUseCase: (useCase) => api.post("/useCases", useCase),
  updateUseCase: (id, useCase) => api.put(`/useCases/${id}`, useCase),
  deleteUseCase: (id) => api.delete(`/useCases/${id}`),

  // Capabilities (unchanged)
  getCapabilities: (domainId) =>
    api.get("/capabilities", { params: { domain_id: domainId } }),
  getCapability: (id) => api.get(`/capabilities/${id}`),
  createCapability: (capability) => api.post("/capabilities", capability),
  updateCapability: (id, capability) =>
    api.put(`/capabilities/${id}`, capability),
  deleteCapability: (id) => api.delete(`/capabilities/${id}`),

  // Applications (Phase 2)
  getApplications: (domainId) =>
    api.get("/applications", { params: { domain_id: domainId } }),
  getApplication: (id) => api.get(`/applications/${id}`),
  createApplication: (application) => api.post("/applications", application),
  updateApplication: (id, application) =>
    api.put(`/applications/${id}`, application),
  deleteApplication: (id) => api.delete(`/applications/${id}`),

  // Business Rules (Phase 2)
  getBusinessRules: (domainId) =>
    api.get("/businessRules", { params: { domain_id: domainId } }),
  getBusinessRule: (id) => api.get(`/businessRules/${id}`),
  createBusinessRule: (rule) => api.post("/businessRules", rule),
  updateBusinessRule: (id, rule) => api.put(`/businessRules/${id}`, rule),
  deleteBusinessRule: (id) => api.delete(`/businessRules/${id}`),

  // Data Elements (Phase 2)
  getDataElements: (domainId) =>
    api.get("/dataElements", { params: { domain_id: domainId } }),
  getDataElement: (id) => api.get(`/dataElements/${id}`),
  createDataElement: (dataElement) => api.post("/dataElements", dataElement),
  updateDataElement: (id, dataElement) =>
    api.put(`/dataElements/${id}`, dataElement),
  deleteDataElement: (id) => api.delete(`/dataElements/${id}`),

  // Technical Components (Phase 2)
  getTechnicalComponents: (domainId) =>
    api.get("/technicalComponents", { params: { domain_id: domainId } }),
  getTechnicalComponent: (id) => api.get(`/technicalComponents/${id}`),
  createTechnicalComponent: (component) =>
    api.post("/technicalComponents", component),
  updateTechnicalComponent: (id, component) =>
    api.put(`/technicalComponents/${id}`, component),
  deleteTechnicalComponent: (id) => api.delete(`/technicalComponents/${id}`),
};

export default apiService;
