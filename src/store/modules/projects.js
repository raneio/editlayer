import Vue from 'vue'
import _ from 'lodash'
import slugg from 'slugg'
// import axios from 'axios'
import generate from 'nanoid/generate'
import { Base64 } from 'js-base64'
import firebase from '@/utils/firebase'
import webhook from '@/utils/webhook'

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
      if (rootState.firestore.projects === null) return null

      return _.map(rootState.firestore.projects, (value, key) => {
        const users = _.map(value.users, (user, userId) => {
          let role = 'editor'

          if (_.has(user, 'permissions') && user.permissions.publish && user.permissions.updateDraft && user.permissions.createJob && user.permissions.updateSchema && user.permissions.updateSettings && user.permissions.updateUsers) {
            role = 'admin'
          }

          return {
            ...user,
            role: role,
            id: userId,
          }
        })

        return {
          draft: value.draft || {},
          id: key,
          jsonUrl: `https://firebasestorage.googleapis.com/v0/b/${process.env.VUE_APP_FIREBASE_STORAGE_BUCKET}/o/${key}%2Fcontent.json?alt=media&token=${value.token}`,
          name: value.name || null,
          publishedVersion: value.publishedVersion || {},
          auth: _.find(users, {id: getters.auth.id}) || null,
          users: users,
          schema: value.schema || null,
          settings: value.settings || {},
          status: value.publishedVersion && _.isEqual(value.draft, value.publishedVersion.draft) && value.schema === value.publishedVersion.schema ? 'published' : 'draft',
          token: value.token || null,
        }
      })
    },

    activeProject (state, getters, rootState) {
      const projects = _.cloneDeep(getters.projects)
      return _.find(projects, {id: rootState.route.params.projectId}) || null
    },

  },

  actions: {

    newProject ({state, dispatch, getters}, payload) {
      payload.name = payload.name || `Project ${generate('abcdefghijklmnopqrstuvwxyz', 4)}`
      payload.id = payload.id || slugg(payload.name)
      payload.schema = payload.schema || {
        title: 'text',
        description: 'textarea',
        photo: 'image',
      }

      let newProject = {
        // filename: payload.filename,
        name: payload.name,
        schema: JSON.stringify(payload.schema, '', '\t'),
        users: {},
        token: generate('abcdefghijklmnopqrstuvwxyz0123456789', 24),
      }

      newProject.users[getters.auth.id] = {
        email: getters.auth.email,
        userExist: true,
        permissions: {
          updateDraft: true,
          updateSchema: true,
          updateSettings: true,
          updateUsers: true,
          publish: true,
          createJob: true,
        },
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
        json: payload.json,
        // filename: payload.filename,
        token: payload.token,
        schema: payload.schema,
        draft: payload.draft,
      })

      payload.versionId = docRef.id

      commit('updatePublishProcess', {
        projectId: payload.projectId,
        versionId: payload.versionId,
      })

      // dispatch('isPublishReady', payload)

      dispatch('isPublishReady', payload)
    },

    isPublishReady ({commit, getters, dispatch}, payload) {
      const project = _.find(getters.projects, {id: payload.projectId})

      if (project.publishedVersion.versionId === payload.versionId) {
        commit('updatePublishProcess', {
          projectId: payload.projectId,
          status: 'done',
        })

        if (payload.webhookEnabled === true) {
          webhook({
            configString: payload.webhookConfig,
            email: payload.email,
            json: payload.json,
            versionId: payload.versionId,
          })
        }

        let link = {}

        if (payload.showLink === true) {
          link.url = payload.jsonUrl
          link.target = payload.projectId
          link.text = 'Open JSON'
        }

        commit('setNotification', {
          mode: 'success',
          message: `Project "${payload.projectName}" is published.`,
          link: link,
        })

        return true
      }

      _.delay(() => {
        dispatch('isPublishReady', payload)
      }, 1000)
    },

    // async isPublishReady ({state, commit, dispatch}, payload) {
    //   payload.versionCheck = payload.versionCheck === undefined ? 1 : payload.versionCheck + 1
    //
    //   let response = await axios({
    //     method: 'GET',
    //     url: payload.jsonUrl,
    //     responseType: 'json',
    //   })
    //     .catch(() => false)
    //
    //   if (response === false || payload.versionId !== response.data.VERSION_ID) {
    //     dispatch('tryPublishAgain', payload)
    //     return null
    //   }
    //
    //   dispatch('setProjectPublished', payload)
    //
    //   if (payload.webhookEnabled === true) {
    //     webhook(payload.webhookConfig, payload.jsonUrl, payload.email)
    //   }
    //
    //   commit('updatePublishProcess', {
    //     projectId: payload.projectId,
    //     status: 'done',
    //   })
    //
    //   let link = {}
    //
    //   if (payload.showLink === true) {
    //     link.url = payload.jsonUrl
    //     link.target = payload.projectId
    //     link.text = 'Open JSON'
    //   }
    //
    //   commit('setNotification', {
    //     mode: 'success',
    //     message: `Project "${payload.projectName}" is published.`,
    //     link: link,
    //   })
    // },

    // tryPublishAgain ({commit, dispatch}, payload) {
    //   if (payload.versionCheck > 10) {
    //     commit('setNotification', {
    //       mode: 'danger',
    //       message: `Publishing "${payload.projectName}" failed. Try again.`,
    //     })
    //
    //     commit('updatePublishProcess', {
    //       projectId: payload.projectId,
    //       status: 'done',
    //     })
    //     return null
    //   }
    //
    //   console.warn(`Publishing not ready, please wait...`, payload.versionCheck)
    //
    //   _.delay(() => {
    //     dispatch('isPublishReady', payload)
    //   }, 1000)
    //
    //   return null
    // },

    addUserToProject ({dispatch}, payload) {
      payload.awaitId = `await-${Base64.encodeURI(payload.email)}`
      payload.user = {
        email: payload.email,
        userExist: false,
        permissions: {
          publish: true,
          updateDraft: true,
          updateSchema: false,
          updateSettings: false,
          updateUsers: false,
          createJob: false,
        },
      }

      dispatch('addUserToProjectToFirestore', payload)
    },

    removeUserFromProject ({dispatch}, payload) {
      dispatch('removeUserFromProjectToFirestore', payload)
    },

    updatePermission ({dispatch}, payload) {
      dispatch('updatePermissionToFirestore', payload)
    },

  },

}
