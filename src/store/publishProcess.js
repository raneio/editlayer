import Vue from 'vue'
import _ from 'lodash'
import axios from 'axios'
import firebase from '@/utils/firebase'
import webhook from '@/utils/webhook'

export default {

  mutations: {

    setPublishProcess (state, payload) {
      Vue.set(state.publishProcesses, payload.projectId, {
        status: 'publishing',
        message: null,
      })
    },

    updatePublishProcess (state, payload) {
      let currentPublishProcess = _.get(state.publishProcesses, payload.projectId)
      let updatedPublishProcess = _.merge(currentPublishProcess, {
        versionId: payload.versionId,
        status: payload.status,
        message: payload.message,
      })

      Vue.set(state.publishProcesses, payload.projectId, updatedPublishProcess)
    },

  },

  actions: {

    publishJson ({state, commit, dispatch}, payload) {
      payload.publishTries = (payload.publishTries) ? payload.publishTries : 0
      payload.versionCheck = 0

      if (payload.publishTries > 3) {
        // console.error('Publishing failed, try again.')
        commit('updatePublishProcess', {
          projectId: payload.projectId,
          status: 'error',
        })
      }

      commit('setPublishProcess', {
        projectId: payload.projectId,
      })

      firebase.firestore
        .collection('projects')
        .doc(payload.projectId)
        .collection('versions')
        .add({
          publishedBy: payload.publishedBy,
          publishedAt: firebase.firestoreTimestamp,
          content: payload.content,
          filename: payload.filename,
          downloadToken: payload.downloadToken,
        })
        .then((docRef) => {
          let versionId = docRef.id

          commit('updatePublishProcess', {
            projectId: payload.projectId,
            versionId: versionId,
          })

          dispatch('isPublishReady', _.merge(payload, {
            versionId: versionId,
          }))
        })
        .catch((error) => console.error('Error adding version:', error))
    },

    isPublishReady ({state, getters, commit, dispatch}, payload) {
      payload.versionCheck = payload.versionCheck + 1

      if (payload.versionCheck > 15) {
        console.log('Purge faild.', payload.publishTries)
        payload.publishTries = payload.publishTries + 1
        dispatch('publishJson', payload)
        return false
      }

      axios({
        method: 'GET',
        url: payload.jsonUrl,
        responseType: 'json',
      })
        .then((response) => {
          if (payload.versionId !== response.data.VERSION_ID) throw new Error('Publishing not ready')

          return firebase.firestore
            .collection('projects')
            .doc(payload.projectId)
            .update({
              'published.draft': payload.draft,
              'published.schema': payload.schema,
              'published.publishedAt': firebase.firestoreTimestamp,
              'published.versionId': payload.versionId,
            })
        })
        .then(() => {
          // console.log('Published successfully updated!', payload)

          // Webhook here
          if (payload.webhookEnabled === true) {
            webhook(payload.webhookConfig, payload.jsonUrl, payload.email)
          }

          commit('updatePublishProcess', {
            projectId: payload.projectId,
            status: 'done',
          })

          let link = {}

          if (payload.activeRole === 'admin') {
            link.url = payload.jsonUrl
            link.target = payload.projectId
            link.text = 'Open JSON'
          }

          commit('setNotification', {
            status: 'success',
            message: `Project "${payload.projectName}" is published.`,
            link: link,
            deleteTime: 20,
          })
        })
        .catch((error) => {
          console.warn('Try again', payload.versionCheck, error.message)

          _.delay(() => {
            dispatch('isPublishReady', payload)
          }, 1000)
        })
    },

  },

}
