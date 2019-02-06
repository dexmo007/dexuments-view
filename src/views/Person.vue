<template>
  <v-container>
    <h1>{{face_id}}</h1>
    <div class="photos">
      <img
        v-for="(p, i) in face"
        :key="i"
        :src="'data:image/jpeg;base64,' + imagesWithFaceLocations[i]"
        :alt="p.uri"
        height="300"
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
  computed: {
    face() {
      return this.getFace(this.face_id);
    },
    ...mapGetters(['getFace']),
    imagesWithFaceLocations() {
      return this.face.map((f) => {
        const image = cv.imread(f.absolutePath);
        image.drawRectangle(
          new cv.Point2(f.faceLocation.right, f.faceLocation.top),
          new cv.Point2(f.faceLocation.left, f.faceLocation.bottom),
          new cv.Vec3(0, 0, 255),
          2,
        );
        return cv.imencode('.jpg', image).toString('base64');
      });
    },
  },
};
</script>

<style scoped>
.photos {
  display: flex;
}
</style>
