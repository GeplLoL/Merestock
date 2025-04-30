import axios from 'axios';
import { Platform } from 'react-native';   // võime siia lisada platvormispetsiifilisi lahendusi
import { store } from '../redux/store';    // pääseme ligi Redux’i salvestusele

// Loome axios’i eksemplari baasaadressiga ja lubame küpsiseid
const api = axios.create({
  baseURL: 'http://localhost:7023/api',     // siin on backend’i baas-URL
  withCredentials: true,                    // saadame CORS’i jaoks küpsised kaasa
  headers: { 'Content-Type': 'application/json' } // ootame ja saadame JSON’i
});

// Lisame interceptor’i, et igale päringule lisada Authorization päis
api.interceptors.request.use(config => {
  const token = store.getState().user.token;  // võetakse token Redux’ist
  if (token) {
    // Kui token olemas, paneme selle päisesse
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;  // tagastame muudetud konfiguratsiooni
});

export default api; // ekspordime valmiskonfigureeritud axios’i eksemplari
