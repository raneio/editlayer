import Vue from 'vue'
import _ from 'lodash'

export default {

  state: {
    activeModal: null,
    editorContentIsValid: true,
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
    invalidSchemas: {},
    editlayerUrl: 'https://alpha5.editlayer.org',
  },

  mutations: {

    setEditorContentValid (state, boolean) {
      Vue.set(state, 'editorContentIsValid', boolean)
    },

    setwWindowSize (state) {
      Vue.set(state, 'windowWidth', window.innerWidth)
      Vue.set(state, 'windowHeight', window.innerHeight)
    },

    setActiveModal (state, modal) {
      Vue.set(state, 'activeModal', modal)
    },

    setInvalidSchema (state, payload) {
      state.invalidSchemas[payload.projectId] = payload.schema
      // Vue.set(state, 'invalidSchemas', payload.schema)
    },

    removeInvalidSchema (state, projectId) {
      let invalidSchemas = state.invalidSchemas
      delete invalidSchemas[projectId]
      state.invalidSchemas = invalidSchemas
    },

  },

  actions: {

    resizeListener ({commit}) {
      window.addEventListener('resize', _.debounce(function () {
        commit('setwWindowSize')
      }, 250))
    },

  },

}
