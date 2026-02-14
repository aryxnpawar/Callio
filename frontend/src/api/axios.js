import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default axios.create({ baseURL: API_URL,withCredentials:true });
