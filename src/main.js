import "./assets/main.css";
import "vuetify/styles";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-bootstrap.css';

const app = createApp(App);

const vuetify = createVuetify({
  components,
  directives,
});
app.use(ToastPlugin);
app.use(router);
app.use(vuetify);
app.mount("#app");
