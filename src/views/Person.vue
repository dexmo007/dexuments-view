<template>
  <v-container>
    <v-layout row>
      <v-text-field :readonly="!editingName" class="person-name" :value="face_id" v-model="name">
      </v-text-field>
      <v-icon v-if="!editingName" @click="editingName = true">edit</v-icon>
      <v-icon v-else @click="changeName()">check</v-icon>
    </v-layout>
    <div class="photos">
      <img
        v-for="(p, i) in face"
        :key="i"
        :src="'data:image/jpeg;base64,' + imagesWithFaceLocations[i]"
        :alt="p.uri"
        :height="imageHeight"
      >
    </div>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import cv from 'opencv4nodejs';

export default {
  props: {
    face_id: String,
  },
  data() {
    return {
      imageHeight: 300,
      editingName: false,
      name: this.face_id,
    };
  },
  computed: {
    face() {
      return this.getFace(this.face_id);
    },
    ...mapGetters(['getFace']),
    imagesWithFaceLocations() {
      return this.face.map((f) => {
        let image = cv.imread(f.absolutePath);
        const scalar = this.imageHeight / image.rows;
        image = image.resize(this.imageHeight, Math.round(image.cols * scalar));
        image.drawRectangle(
          new cv.Point2(f.faceLocation.right * scalar, f.faceLocation.top * scalar),
          new cv.Point2(f.faceLocation.left * scalar, f.faceLocation.bottom * scalar),
          new cv.Vec3(0, 0, 255),
          2,
        );
        return cv.imencode('.jpg', image).toString('base64');
      });
    },
  },
  methods: {
    changeName() {
      console.log(this.name);
    },
  },
};
</script>

<style scoped>
.person-name {
  font-weight: bold;
  font-size: 2em;
}
.photos {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
