import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';

// estilos y scripts comunes
import '@/assets/css/bootstrap.min.css'
import '@/assets/css/bootstrap-icons.css'
import '@/assets/css/material-icons.css'
import '@/assets/css/style.css'
import '@/assets/js/bootstrap.bundle.js'

const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.use(router);
app.mount('#app');