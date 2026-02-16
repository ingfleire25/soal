import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from "axios";

// Importar CSS locales
import '@/assets/css/bootstrap.min.css'
import '@/assets/css/bootstrap-icons.css'
import '@/assets/css/material-icons.css'
import '@/assets/css/style.css'

// Importar JS locales
import '@/assets/js/bootstrap.bundle.js'
//import './assets/js/script.js'

const app = createApp(App);
app.use(createPinia())
app.config.globalProperties.$axios = axios;
app.use(router);
app.mount("#app");