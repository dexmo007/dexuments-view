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
        src=""
        :height="imageHeight"
        :width="p.imgSize.width * imageHeight / p.imgSize.height"
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

        <v-list-tile @click="reportNoFace(clickedFace)">
          <v-list-tile-title>
            Ain't no face
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <reassign-face :choices="reassignChoices" v-model="reassignShow"></reassign-face>
  </v-container>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { loadImageMarkFaceAsBase64 } from '@/util/ImageUtils';
import sizeOf from 'image-size';
import ReassignFace from '@/components/ReassignFace.vue';

export default {
  props: {
    face_id: String,
  },
  components: {
    ReassignFace,
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
      observer: null,
      reassignChoices: null,
      reassignShow: false,
    };
  },
  computed: {
    face() {
      return this.getFace(this.face_id).map(face => ({ ...face, imgSize: sizeOf(face.absolutePath) }));
    },
    ...mapGetters(['getFace']),
  },
  methods: {
    ...mapActions(['changeName', 'reportNoFace']),
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
      this.reassignChoices = Object
        .keys(this.$store.state.faces)
        .filter(id => id !== this.face_id)
        .map(id => ({ name: this.$store.state.faces[id][0].name, faceId: id, face: this.clickedFace }));
      this.reassignShow = true;
      // console.log('reassign face',
      //   `${this.clickedFace.uri}(${Object.values(this.clickedFace.faceLocation).join(',')})`,
      //   'to any of',
      //   Object
      //     .keys(this.$store.state.faces)
      //     .filter(id => id !== this.face_id)
      //     .map(id => this.$store.state.faces[id][0].name || id));
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
  mounted() {
    const targets = this.$el.querySelectorAll('.photos img');

    const lazyLoad = (target, i) => {
      const io = new IntersectionObserver((entries, observer) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          const f = this.face[i];
          const image = loadImageMarkFaceAsBase64(f.absolutePath, f.faceLocation, this.imageHeight);
          entry.target.setAttribute('src', `data:image/jpeg;base64,${image}`);
          observer.disconnect();
        }
      });

      io.observe(target);
    };

    targets.forEach(lazyLoad);
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
