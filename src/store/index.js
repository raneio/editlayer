import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import parseJson from 'parse-json'
import buildStructure from '@/utils/buildStructure'
import firestore from '@/store/modules/firestore'
import notifications from '@/store/modules/notifications'
import projects from '@/store/modules/projects'
import uploader from '@/store/modules/uploader'
import utils from '@/store/modules/utils'

Vue.use(Vuex)

let store = {
  strict: true,
  modules: {
    firestore,
    notifications,
    projects,
    uploader,
    utils,
  },

  getters: {

    isLoggedIn (state) {
      if (state.firestore.user === null) {
        return null
      }
      else if (state.firestore.user === false || !state.firestore.user.email) {
        return false
      }
      else {
        return true
      }
    },

    auth (state) {
      return state.firestore.user
    },

    structure (state, getters) {
      if (!getters.activeProject) return {}

      const schema = parseJson(getters.activeProject.schema)
      const draft = getters.activeProject.draft
      const published = _.has(getters.activeProject, 'publishedVersion.draft') ? getters.activeProject.publishedVersion.draft : {}

      return buildStructure(schema, draft, published)
    },

    activeItem (state, getters, rootState) {
      if (!getters.activeProject) return {}

      let path = _.replace(rootState.route.params.path, />/g, '.')

      if (_.has(getters.structure, path)) {
        return _.get(getters.structure, path)
      }
      else {
        return {}
      }
    },
  },

  actions: {
    updateContent ({getters, dispatch}, payload) {
      let currentContent = _.get(getters.structure, `${payload.path}._content`)

      if (!_.isEqual(currentContent, payload.content)) {
        dispatch('updateDraftToFirestore', payload)
      }
    },

    updateSchema ({dispatch}, payload) {
      dispatch('updateSchemaToFirestore', payload)
    },
  },

}

export default new Vuex.Store(store)
