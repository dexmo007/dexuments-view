import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from './locale/en';
import fr from './locale/fr';

Vue.use(VueI18n);

// Ready translated locale messages
const translations = {
  en,
  fr,
};

// Create and export VueI18n instance with options
export default new VueI18n({
  messages: translations,
  locale: 'en',
  fallbackLocale: 'en',
});
