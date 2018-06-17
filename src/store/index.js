import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import firebase from '@/utils/firebase'
import projects from '@/store/projects'
import publishProcess from '@/store/publishProcess'
import schema from '@/store/schema'
import notifications from '@/store/notifications'
import auth from '@/store/auth'
import uploadImage from '@/store/uploadImage'
import content from '@/store/content'
import windowSize from '@/store/windowSize'
import jsonUrl from '@/store/jsonUrl'

Vue.use(Vuex)
Vue.use(firebase)

let store = {

  state: {
    editorContentIsValid: true,
    notifications: {},
    projects: {
      admin: null,
      editor: null,
    },
    publishProcesses: {},
    route: {},
    user: {
      isLoggedIn: null,
      id: null,
      email: null,
    },
    windowSize: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  },

  mutations: {

    resetState (state) {
      state.notifications = {}
      state.projects.admin = null
      state.projects.editor = null
      state.publishProcesses = {}
      state.user.isLoggedIn = null
      state.user.id = null
      state.user.email = null
    },

    setEditorContentValid (state, boolean) {
      state.editorContentIsValid = boolean
    },

  },

}

_.merge(store, projects)
_.merge(store, publishProcess)
_.merge(store, schema)
_.merge(store, notifications)
_.merge(store, auth)
_.merge(store, uploadImage)
_.merge(store, content)
_.merge(store, windowSize)
_.merge(store, jsonUrl)

export default new Vuex.Store(store)
