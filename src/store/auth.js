import _ from 'lodash'
import router from '@/router'
import firebase from '@/utils/firebase'

export default {

  getters: {

    activeRole (state, getters) {
      if (!_.has(getters, `activeProject.roles[${state.user.id}].role`)) return null
      return getters.activeProject.roles[state.user.id].role
    },

  },

  mutations: {

    setUser (state, user) {
      state.user = user
    },

  },

  actions: {

    authState ({state, commit, dispatch}) {
      firebase.auth.onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
          commit('setUser', {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            isLoggedIn: true,
          })

          dispatch('getProjectsFromDatabase')

          if (state.route.name === 'Register') {
            router.push({name: 'Dashboard'})
          }
        }
        else {
          commit('resetState')
        }
      })
    },
  },
}
