import axios from "axios";

const instance = axios.create({
  baseURL: "http://192.53.163.251:5000"
});

export default instance;