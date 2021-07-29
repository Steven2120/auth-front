//imports axios
import axios from "axios";

//sets to dev mode
const Axios = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8080"
      : "DEPLOY CLOUD ADDRESS",
  timeout: 50000,
});

export default Axios;
