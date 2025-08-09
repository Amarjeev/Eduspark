const isLocal = window.location.hostname === "localhost";

export const BaseUrl = isLocal
  ? "http://localhost:5000/"
  :"https://api.eduspark.space/api/"

// export const BaseUrl = "https://api.eduspark.space/api/";


