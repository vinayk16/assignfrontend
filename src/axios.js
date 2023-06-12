import axios from "axios";


const instance = axios.create({
  // baseURL: "https://amazon-backend-app.herokuapp.com",
  baseURL: "https://backend-phvv.onrender.com:5000",
  // baseURL: "https://epicraft-backend.onrender.com"
  // baseURL: process.env.BASE_URL,
});

export default instance;
