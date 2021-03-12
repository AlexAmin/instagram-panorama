import Vue from 'vue';
import router from './router';

import App from './App.vue';
import VueCompositionAPI from '@vue/composition-api';

Vue.config.productionTip = false;

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue';

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueCompositionAPI);

import VuexStore from "@/store";

new Vue({
  store: VuexStore,
  router,
  render: h => h(App)
}).$mount('#app');
