import Vue from 'vue'
import Vuex from 'vuex'
import auth from '@/store/modules/auth'
import content from '@/store/modules/content'
import firestore from '@/store/modules/firestore'
import notifications from '@/store/modules/notifications'
import projects from '@/store/modules/projects'
import schema from '@/store/modules/schema'
import structure from '@/store/modules/structure'
import uploader from '@/store/modules/uploader'
import utils from '@/store/modules/utils'

Vue.use(Vuex)

let store = {
  strict: true,
  modules: {
    auth,
    content,
    firestore,
    notifications,
    projects,
    schema,
    structure,
    uploader,
    utils,
  },

}

export default new Vuex.Store(store)
