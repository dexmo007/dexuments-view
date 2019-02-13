import Vue from 'vue';
import Vuex from 'vuex';
import sqlite3 from 'sqlite3';
import path from 'path';

Vue.use(Vuex);
/* eslint-disable no-param-reassign */
export default new Vuex.Store({
  state: {
    root: '/home/dexmo/code/dexuments/.docs/',
    configDir: '/home/dexmo/.dexuments/',
    dbFilename: 'index.db',
    db: null,
    faces: null,
  },
  getters: {
    getFace: state => faceId => state.faces[faceId],
  },
  mutations: {
    initDb(state) {
      if (state.db) {
        return;
      }
      state.db = new sqlite3.Database(path.resolve(state.configDir, state.dbFilename));
    },
    setFaces(state, faces) {
      state.faces = faces;
    },
    setFaceName(state, faceId, name) {
      state.faces[faceId].name = name;
    },
    cleanFaces(state) {
      state.faces = null;
    },
  },
  actions: {
    loadPeople({ commit, state }) {
      if (state.faces) {
        return;
      }
      commit('initDb');
      state.db.serialize(() => {
        state.db.all('SELECT fm.*, fn.name FROM face_mapping fm LEFT JOIN face_names fn ON fn.face_id = fm.face_id', (error, rows) => {
          if (error) {
            console.error(error);
            return;
          }
          const faces = rows.reduce((a, row) => {
            (a[row.face_id] = a[row.face_id] || []).push({
              uri: row.img_path,
              url: `file://${path.resolve(state.root, row.img_path)}`,
              absolutePath: path.resolve(state.root, row.img_path),
              name: row.name,
              faceId: row.face_id,
              faceLocation: {
                top: row.top,
                right: row.right,
                bottom: row.bottom,
                left: row.left,
              },
            });
            return a;
          }, {});
          commit('setFaces', faces);
        });
      });
    },
    changeName({ commit, state }, { faceId, name }) {
      return new Promise((resolve, reject) => {
        state.db.serialize(() => {
          state.db.run('INSERT INTO face_names(face_id, name) VALUES (?, ?) ON CONFLICT(face_id) DO UPDATE SET name = ?',
            [faceId, name, name],
            (error) => {
              if (error) {
                console.error(error);
                reject(error);
              }
              commit('setFaceName', faceId, name);
              setTimeout(resolve, 1000);
            });
        });
      });
    },
    reportNoFace({ commit, state, dispatch }, face) {
      return new Promise((resolve, reject) => {
        state.db.serialize(() => {
          const loc = face.faceLocation;
          state.db.run(`DELETE FROM face_mapping 
          WHERE face_id = ? 
          AND img_path = ? 
          AND top = ? AND right = ? AND bottom = ? AND left = ?
          `, [face.faceId, face.uri, loc.top, loc.right, loc.bottom, loc.left],
          (error) => {
            if (error) {
              console.log(error);
              reject(error);
            } else {
              commit('cleanFaces');
              dispatch('loadPeople');
              resolve();
            }
          });
        });
      });
    },
    reassignFace({ commit, state, dispatch }, { face, newFaceId }) {
      console.log(face, newFaceId);
      return new Promise((resolve, reject) => {
        state.db.serialize(() => {
          const loc = face.faceLocation;
          state.db.run(`UPDATE face_mapping 
          SET face_id = ?
          WHERE face_id = ? 
          AND img_path = ? 
          AND top = ? AND right = ? AND bottom = ? AND left = ?
          `, [newFaceId, face.faceId, face.uri, loc.top, loc.right, loc.bottom, loc.left],
          (error) => {
            if (error) {
              console.log(error);
              reject(error);
            } else {
              commit('cleanFaces');
              dispatch('loadPeople');
              resolve();
            }
          });
        });
      });
    },
  },
});
