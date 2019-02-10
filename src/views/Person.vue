<template>
  <v-container>
    <v-layout row>
      <v-text-field ref="nameField" :readonly="!editingName"
      class="person-name" @dblclick="edit()" @keyup.enter="doChangeName()"
      v-model="name">
      </v-text-field>
      <v-icon v-if="!editingName" @click="edit()">
        edit
        </v-icon>
      <v-progress-circular indeterminate color="white" v-else-if="savingName" />
      <v-icon v-else @click="doChangeName()">check</v-icon>
    </v-layout>
    <div class="photos">
      <img
        v-for="(p, i) in face"
        :key="i"
        :src="'data:image/jpeg;base64,' + imagesWithFaceLocations[i]"
        :height="imageHeight"
        @contextmenu="showContextMenu($event, i)"
      >
    </div>
    <v-menu v-model="showMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y>
      <v-list>
        <v-list-tile @click="reassignFace()">
          <v-list-tile-title>
            Reassign face
          </v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="reportNoFace()">
          <v-list-tile-title>
            Ain't no face
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-container>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import cv from 'opencv4nodejs';

export default {
  props: {
    face_id: String,
  },
  data() {
    return {
      imageHeight: 300,
      editingName: false,
      savingName: false,
      name: this.face_id,
      showMenu: false,
      x: 0,
      y: 0,
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
    ...mapActions(['changeName']),
    doChangeName() {
      // todo check it actually changed
      this.savingName = true;
      this.changeName({ faceId: this.face_id, name: this.name })
        .then(() => {
          this.savingName = false;
          this.editingName = false;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    edit() {
      this.$refs.nameField.$refs.input.select();
      this.editingName = true;
    },
    showContextMenu(e, i) {
      e.preventDefault();
      this.x = e.clientX;
      this.y = e.clientY;
      this.clickedFace = this.face[i];
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },
    reassignFace() {
      console.log('reassign face',
        `${this.clickedFace.uri}(${Object.values(this.clickedFace.faceLocation).join(',')})`,
        'to any of',
        Object
          .keys(this.$store.state.faces)
          .filter(id => id !== this.face_id)
          .map(id => this.$store.state.faces[id][0].name || id));
    },
    reportNoFace() {
      console.log(`${this.clickedFace.uri}(${Object.values(this.clickedFace.faceLocation).join(',')})`,
        'is not face');
    },
  },
  watch: {
    face: {
      immediate: true,
      handler(v) {
        const faceName = v[0].name;
        if (faceName) {
          this.name = faceName;
        }
      },
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
