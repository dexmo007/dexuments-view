<template>
  <v-container>
    <div class="explorer">
      <v-breadcrumbs :items="pathcrumbs" divider="/">
        <template slot="item" slot-scope="props">
          <v-icon v-if="props.item.home" @click="goto($store.state.root)">home</v-icon>
          <span v-else @click="goto(props.item.path)">{{ props.item.text }}</span>
        </template>
      </v-breadcrumbs>
      <span v-for="f in files" :key="f.name" @click="cdOrOpen(f)">
        <v-icon v-if="f.isDirectory()">folder</v-icon>
        {{f.name}}
      </span>
    </div>
  </v-container>
</template>
<script>
import fs from 'fs';
import path from 'path';

export default {
  name: 'documents',
  data() {
    return {
      path: this.$store.state.root,
    };
  },
  computed: {
    files() {
      return fs.readdirSync(this.path, { withFileTypes: true });
    },
    pathcrumbs() {
      return [
        {
          home: true,
        },
      ].concat(
        path
          .relative(this.$store.state.root, this.path)
          .split(path.sep)
          .filter(p => !!p)
          .map((p, i, a) => ({
            text: p,
            path: path.resolve(
              this.$store.state.root,
              a.slice(0, i + 1).join(path.sep),
            ),
          })),
      );
    },
  },
  methods: {
    goto(target) {
      this.path = target;
    },
    cdOrOpen(f) {
      if (f.isDirectory()) {
        this.path = path.resolve(this.path, f.name);
      } else {
        console.log('opening', f);
      }
    },
  },
};
</script>

<style scoped>
.explorer {
  display: flex;
  flex-direction: column;
}
.explorer > * {
  cursor: pointer;
  margin: 0.2em;
  padding: 0.1em;
  border-radius: 0.2em;
}
.explorer > *:hover {
  background-color: #212121;
}
</style>
