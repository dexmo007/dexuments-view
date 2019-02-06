<template>
  <v-container class="tiles">
    <router-link
      class="tile"
      v-for="(face, face_id) in faces"
      :key="face_id"
      :to="{name:'person',params:{face_id}}"
    >
      <span>{{face_id}}</span>
      <ul>
        <li v-for="(p,i) in face" :key="i">{{p.uri}}</li>
      </ul>
    </router-link>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'people',
  computed: {
    ...mapState(['faces']),
  },
  created() {
    this.$store.dispatch('loadPeople');
  },
};
</script>


<style scoped>
.tiles {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
.tiles > * {
  margin: 0.5em;
}
.tile {
  background-color: #d3d3d3;
  border: 1px solid black;
  height: 200px;
  width: 200px;
}
</style>
