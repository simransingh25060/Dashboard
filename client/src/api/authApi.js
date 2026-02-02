import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api/auth",
});

// attach JWT automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const uploadProfileImage = (formData) => {
  return API.put("/upload", formData);
};

// Fetch current user profile
export const getProfile = () => {
  const token = localStorage.getItem("token");
  return API.get("/me", {
  headers: {'Authorization': `Bearer ${token}`}
  });
};


