import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import vEN from './locale/en';

Vue.use(Vuetify, {
  lang: {
    locales: { vEN },
    current: 'en',
  },
});
