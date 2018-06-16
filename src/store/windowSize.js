export default {

  getters: {

    isMobile (state) {
      return state.windowSize.width <= 900
    },

  },

  mutations: {

    setwWindowSize (state) {
      state.windowSize.width = window.innerWidth
      state.windowSize.height = window.innerHeight
    },

  },

  actions: {

    resizeListener ({commit}) {
      window.addEventListener('resize', () => {
        commit('setwWindowSize')
      })
    },

  },

}
