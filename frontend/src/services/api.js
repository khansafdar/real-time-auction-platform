import axios from 'axios'

const base = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

const instance = axios.create({
  baseURL: base,
  headers: {
    'Content-Type': 'application/json'
  }
})

// helper to set token
function setToken(token) {
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete instance.defaults.headers.common['Authorization']
  }
}

export default {
  get: (url, config) => instance.get(url, config),
  post: (url, data, config) => instance.post(url, data, config),
  put: (url, data, config) => instance.put(url, data, config),
  delete: (url, config) => instance.delete(url, config),
  setToken
}