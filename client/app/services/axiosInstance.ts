import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
});

export const setAuthToken = (token: string) => {
  axios.defaults.headers.common["Authorization"] = `Token ${token}`;
  axios.defaults.withCredentials = true;
};

export const removeAuthToken = () => {
  delete axios.defaults.headers.common["Authorization"];
  axios.defaults.withCredentials = false;
};
