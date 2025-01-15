import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_KEY = import.meta.env.VITE_API_KEY

const api = axios.create({
  baseURL: BASE_URL,
})

api.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem('access_token')
    if (access) config.headers.Authorization = `Bearer ${access}`
    config.headers.apikey = API_KEY
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('access_token')
      setTimeout(() => location.reload(), 3000)
    }
    return Promise.reject(error)
  },
)

export const signIn = async (data) => {
  return await api.post('/auth/v1/token?grant_type=password', data)
}

export const getTable = async () => {
  return await api.get('/rest/v1/kmg_senim?select=*')
}

export const editCell = async (rowParams, cell) => {
  return await api.patch('/rest/v1/kmg_senim', cell, { params: rowParams })
}

export const downloadFile = async (filename) => {
  return await api.get(`/storage/v1/object/testmb/${filename}`, { responseType: 'blob' })
}
