import axios from 'axios'
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const api = axios.create( {
    // baseURL: process.env.REACT_APP_API || 'http://localhost:3001',
    baseURL: baseURL
    // timeout: 1500
} );
// instance.defaults.headers.common['x-api-key'] = process.env.API_KEY;

export const apiPrivada = axios.create( {
    baseURL: baseURL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
} );