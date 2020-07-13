import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import VueCompositionAPI from '@vue/composition-api'
import VueCarousel from 'vue-carousel';

//Load bootstrap
import "bootstrap"
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import {BootstrapVue} from 'bootstrap-vue'

Vue.use(BootstrapVue);

Vue.use(VueCompositionAPI)
Vue.use(VueCarousel);


new Vue({
  render: h => h(App),
}).$mount('#app')
