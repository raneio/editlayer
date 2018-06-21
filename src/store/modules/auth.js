import Vue from 'vue'
import router from '@/router'
import firebase from '@/utils/firebase'

export default {

  state: {
    id: null,
    email: null,
  },

  getters: {
    isLoggedIn (state) {
      return !!(state.id && state.email)
    },
  },

  mutations: {
    setUser (state, user) {
      Vue.set(state, 'id', user.id)
      Vue.set(state, 'email', user.email)
    },

    // logout (state) {
    //   // state.notifications = {}
    //   // state.projects.admin = null
    //   // state.projects.editor = null
    //   // state.processes = {}
    //   // state.isLoggedIn = false
    //   state.id = null
    //   state.email = null
    // },
  },

  actions: {
    authState ({state, commit, dispatch, rootState}) {
      firebase.auth.onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
          commit('setUser', {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            // isLoggedIn: true,
          })

          dispatch('getProjectsFromFirestore')

          if (rootState.route.name === 'Register') {
            router.push({name: 'Dashboard'})
          }
        }
        else {
          commit('setUser', {
            id: false,
            email: false,
          })
        }
      })
    },
  },
}
