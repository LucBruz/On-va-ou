import { createApp } from 'vue'
import { createPinia } from 'pinia';
import './global.css'
import App from './App.vue'

// Créez votre application Vue
const app = createApp(App);

// Installez Pinia
const pinia = createPinia();
app.use(pinia);

app.mount('#app');
