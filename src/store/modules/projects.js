import Vue from 'vue'
import _ from 'lodash'
import slugg from 'slugg'
import axios from 'axios'
import Chance from 'chance'
import firebase from '@/utils/firebase'
import webhook from '@/utils/webhook'

const chance = new Chance()

export default {

  state: {
    processes: {},
  },

  mutations: {

    setPublishProcess (state, payload) {
      Vue.set(state.processes, payload.projectId, {
        status: 'publishing',
        message: null,
      })
    },

    updatePublishProcess (state, payload) {
      let currentPublishProcess = _.get(state.processes, payload.projectId)
      let updatedPublishProcess = _.merge(currentPublishProcess, {
        versionId: payload.versionId,
        status: payload.status,
        message: payload.message,
      })

      Vue.set(state.processes, payload.projectId, updatedPublishProcess)
    },

  },

  getters: {

    projects (state, getters, rootState) {
      if (rootState.firestore.editorProjects === null || rootState.firestore.adminProjects === null) return null
      const editorProjects = _.cloneDeep(rootState.firestore.editorProjects)
      const adminProjects = _.cloneDeep(rootState.firestore.adminProjects)
      const firestoreProjects = _.merge(editorProjects, adminProjects)
      let projects = {}

      _.each(firestoreProjects, (value, key) => {
        projects[key] = {
          draft: value.draft || {},
          id: key,
          jsonUrl: `https://firebasestorage.googleapis.com/v0/b/${process.env.VUE_APP__FIREBASE_PROJECT_ID}.appspot.com/o/${key}.json?alt=media`,
          name: value.name || null,
          published: value.published || {},
          role: value.users[rootState.auth.id].role || null,
          users: value.users || {},
          schema: value.schema || null,
          settings: value.settings || {},
          status: value.published && _.isEqual(value.draft, value.published.draft) && value.schema === value.published.schema ? 'published' : 'draft',
        }
      })

      return projects
    },

    activeProject (state, getters, rootState) {
      return _.find(getters.projects, {id: rootState.route.params.projectId}) || null
    },

  },

  actions: {

    newProject ({state, dispatch, rootState}, payload) {
      payload.name = payload.name ? payload.name : `Project ${chance.first()}`
      payload.id = payload.id ? payload.id : slugg(payload.name)
      // payload.filename = payload.filename ? payload.filename : 'content'
      payload.schema = payload.schema ? payload.schema : {
        title: 'input',
        description: 'rich-text',
        photo: 'image',
      }

      let newProject = {
        // filename: payload.filename,
        name: payload.name,
        schema: JSON.stringify(payload.schema, '', '\t'),
        users: {},
        // downloadToken: chance.guid(),
      }

      newProject.users[rootState.auth.id] = {
        role: 'admin',
        email: rootState.auth.email,
        userExist: true,
      }

      dispatch('newProjectToFirestore', {
        newProject,
        payload,
      })
    },

    deleteProject ({dispatch}, payload) {
      dispatch('deleteProjectFromFirestore', payload)
    },

    async publishJson ({state, commit, dispatch}, payload) {
      commit('setPublishProcess', {
        projectId: payload.projectId,
      })

      let docRef = await dispatch('newProjectVersionToFirestore', {
        projectId: payload.projectId,
        publishedBy: payload.publishedBy,
        publishedAt: firebase.firestoreTimestamp,
        content: payload.content,
        // filename: payload.filename,
        // downloadToken: payload.downloadToken,
      })

      payload.versionId = docRef.id

      commit('updatePublishProcess', {
        projectId: payload.projectId,
        versionId: payload.versionId,
      })

      dispatch('isPublishReady', payload)
    },

    async isPublishReady ({state, commit, dispatch}, payload) {
      payload.versionCheck = payload.versionCheck === undefined ? 1 : payload.versionCheck + 1

      let response = await axios({
        method: 'GET',
        url: payload.jsonUrl,
        responseType: 'json',
      })
        .catch(() => false)

      if (response === false || payload.versionId !== response.data.VERSION_ID) {
        dispatch('tryPublishAgain', payload)
        return null
      }

      dispatch('setProjectPublished', payload)

      if (payload.webhookEnabled === true) {
        webhook(payload.webhookConfig, payload.jsonUrl, payload.email)
      }

      commit('updatePublishProcess', {
        projectId: payload.projectId,
        status: 'done',
      })

      let link = {}

      if (payload.role === 'admin') {
        link.url = payload.jsonUrl
        link.target = payload.projectId
        link.text = 'Open JSON'
      }

      commit('setNotification', {
        mode: 'success',
        message: `Project "${payload.projectName}" is published.`,
        link: link,
      })
    },

    tryPublishAgain ({commit, dispatch}, payload) {
      if (payload.versionCheck > 10) {
        commit('setNotification', {
          mode: 'danger',
          message: `Publishing "${payload.projectName}" failed. Try again.`,
        })

        commit('updatePublishProcess', {
          projectId: payload.projectId,
          status: 'done',
        })
        return null
      }

      console.warn(`Publishing not ready, please wait...`, payload.versionCheck)

      _.delay(() => {
        dispatch('isPublishReady', payload)
      }, 1000)

      return null
    },

    newPermission ({commit, dispatch}, payload) {
      commit('setNotification', {
        mode: 'info',
        message: `Adding user "${payload.email}", please wait...`,
      })

      dispatch('newPermissionToFirestore', payload)
    },

    removePermission ({dispatch}, payload) {
      dispatch('removePermissionToFirestore', payload)
    },

    updatePermission ({dispatch}, payload) {
      dispatch('updatePermissionToFirestore', payload)
    },

  },

}
