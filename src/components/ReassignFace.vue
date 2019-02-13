<template>
    <v-dialog v-model="show" scrollable max-width="300px">
      <v-card>
        <v-card-title>Reassign Face</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          <v-radio-group v-model="chosen" column>
            <v-radio v-for="(choice, index) in choices" :key="choice.faceId"
            :label="choice.name || choice.faceId" :value="index"></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click.stop="show = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="save()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
import { mapActions } from 'vuex';

export default {
  props: {
    choices: Array,
    value: Boolean,
  },
  data() {
    return {
      chosen: null,
    };
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
  methods: {
    ...mapActions(['reassignFace']),
    save() {
      const chosen = this.choices[this.chosen];
      console.log(chosen);
      this.reassignFace({ newFaceId: chosen.faceId, face: chosen.face })
        .then(() => {
          this.show = false;
        });
    },
  },
};
</script>
