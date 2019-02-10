import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from './locale/en';

Vue.use(VueI18n);

// Ready translated locale messages
const translations = {
  en,
};

// Create and export VueI18n instance with options
export default new VueI18n({
  messages: translations,
  locale: 'en',
  fallbackLocale: 'en',
});
