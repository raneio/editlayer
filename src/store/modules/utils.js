import Vue from 'vue'
import _ from 'lodash'

export default {

  state: {
    activeModal: null,
    editorContentIsValid: true,
    windowHeight: window.innerWidth,
    windowWidth: window.innerHeight,
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

  },

  actions: {

    resizeListener ({commit}) {
      window.addEventListener('resize', _.debounce(function () {
        commit('setwWindowSize')
      }, 250))
    },

  },

}
