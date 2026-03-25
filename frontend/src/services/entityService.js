import API_BASE_URL from "./api";

const getToken = () => localStorage.getItem("token");

const buildHeaders = (isJson = true) => {
  const token = getToken();
  const headers = {};

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const parseResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Une erreur est survenue");
  }

  return data;
};

export const subjectService = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/subjects`, {
      method: "GET",
      headers: buildHeaders(false),
    });
    return parseResponse(response);
  },

  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      method: "GET",
      headers: buildHeaders(false),
    });
    return parseResponse(response);
  },

  async create(payload) {
    const response = await fetch(`${API_BASE_URL}/subjects`, {
      method: "POST",
      body: payload,
    });
    return parseResponse(response);
  },

  async update(id, payload) {
    const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      method: "PUT",
      headers: buildHeaders(true),
      body: JSON.stringify(payload),
    });
    return parseResponse(response);
  },

  async remove(id) {
    const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      method: "DELETE",
      headers: buildHeaders(false),
    });
    return parseResponse(response);
  },
};

export const departmentService = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/departments`, {
      method: "GET",
      headers: buildHeaders(false),
    });
    return parseResponse(response);
  },

  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: "GET",
      headers: buildHeaders(false),
    });
    return parseResponse(response);
  },

  async create(payload) {
    const response = await fetch(`${API_BASE_URL}/departments`, {
      method: "POST",
      body: payload,
    });
    return parseResponse(response);
  },

  async update(id, payload) {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: "PUT",
      headers: buildHeaders(true),
      body: JSON.stringify(payload),
    });
    return parseResponse(response);
  },

  async remove(id) {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: "DELETE",
      headers: buildHeaders(false),
    });
    return parseResponse(response);
  },
};

export const getImageUrl = (value) => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/")) return `http://localhost:5000${value}`;
  return `http://localhost:5000/${value}`;
};