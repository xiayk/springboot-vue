import HttpRequest from "./api"

const baseURL = "http://192.168.0.110:8080";
const axios = new HttpRequest(baseURL);

export default axios