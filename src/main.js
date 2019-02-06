import '@babel/polyfill';
import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import lang from './lang';
import './registerServiceWorker';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.config.productionTip = false;

new Vue({
  i18n: lang,
  router,
  store,
  render: h => h(App),
}).$mount('#app');
