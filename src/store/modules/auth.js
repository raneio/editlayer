// import Vue from 'vue'
// import _ from 'lodash'
// import router from '@/router'
// import firebase from '@/utils/firebase'
//
// export default {
//   state: {
//     id: null,
//     email: null,
//   },
//
//   getters: {
//
//     userSettings (rootState) {
//       return _.get(rootState, 'firestoreuserSettings')
//     },
//
//   },
//
//   mutations: {
//     setUser (state, user) {
//       Vue.set(state, 'id', user.id)
//       Vue.set(state, 'email', user.email)
//     },
//   },
//
//   actions: {
//     authState ({state, commit, dispatch, rootState}) {
//       firebase.auth.onAuthStateChanged(firebaseUser => {
//         if (firebaseUser) {
//           commit('setUser', {
//             id: firebaseUser.uid,
//             email: firebaseUser.email,
//           })
//
//           dispatch('getUserFromFirestore', firebaseUser.uid)
//
//           dispatch('getProjectsFromFirestore', {
//             id: firebaseUser.uid,
//             email: firebaseUser.email,
//           })
//
//           if (rootState.route.name === 'Register') {
//             router.push({name: 'Dashboard'})
//           }
//         }
//         else {
//           commit('setUser', {
//             id: false,
//             email: false,
//           })
//         }
//       })
//     },
//   },
// }
