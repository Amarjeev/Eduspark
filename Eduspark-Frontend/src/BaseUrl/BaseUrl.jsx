const isLocal = window.location.hostname === "localhost";

export const BaseUrl = isLocal
  ? "http://localhost:5000/"
  : "https://eduspark-backend-w25l.onrender.com/"; // ✅ Fixed URL
