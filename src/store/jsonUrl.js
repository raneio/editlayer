export default {

  getters: {

    jsonUrl (state, getters) {
      if (!getters.activeProject) return false
      return `https://firebasestorage.googleapis.com/v0/b/${process.env.VUE_APP__FIREBASE_PROJECT_ID}.appspot.com/o/${getters.activeProject.projectId}%2F${getters.activeProject.filename}.json?alt=media&token=${getters.activeProject.downloadToken}`
    },

  },

}
