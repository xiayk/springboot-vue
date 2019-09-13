import axios from "@/lib/config";

export const login = (data) => {
    return axios.request({
      url: "/g/login",
      data
    })
  }

export const http = (url, data) => {
  return axios.request({
    url: url,
    data
  })
}
  