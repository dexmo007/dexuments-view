import Vue from 'vue';
import Router from 'vue-router';
import Documents from './views/Documents.vue';
import Photos from './views/Photos.vue';
import People from './views/People.vue';
import Person from './views/Person.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/people',
    },
    {
      path: '/documents',
      component: Documents,
    },
    {
      path: '/photos',
      component: Photos,
    },
    {
      path: '/people',
      component: People,
    },
    {
      path: '/people/:face_id',
      name: 'person',
      component: Person,
      props: true,
    },
  ],
});
