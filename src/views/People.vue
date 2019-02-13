<template>
  <div class="tiles">
    <router-link
      class="tile"
      v-for="(face, face_id) in faces"
      :key="face_id"
      :to="{name:'person',params:{face_id}}"
    >
      <span :class="{unknown: !face[0].name}">{{face[0].name || 'Unknown person'}}</span>
      <div class="thumbnails">
        <img v-for="(p,i) in face.slice(0,6)" :key="i" :src="p.url" height="66">
      </div>
    </router-link>
  </div>
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
  margin: 20px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
.tiles > * {
  margin: 0.5em;
}
.tile {
  background-color: #d3d3d3;
  border-radius: 10px;
  height: 200px;
  width: 200px;
}
.tile {
  text-decoration: none;
  padding: 5px;
}
.tile span {
  color: black;
  font-weight: bold;
}
.tile span.unknown {
  font-style: italic;
  font-weight: normal;
}
.thumbnails {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
