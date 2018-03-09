import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import slugg from 'slugg'
import axios from 'axios'
import ImageCompressor from 'image-compressor.js'
import firebase from '@/firebase'
import router from '@/router'
import buildSchema from '@/utils/buildSchema'

Vue.use(Vuex)
Vue.use(firebase)

export default new Vuex.Store({

  state: {
    // storageUrlPrefix: 'https://cdn.editlayer.com/',
    projects: null,
    user: {
      isLoggedIn: null,
      id: null,
      email: null,
    },
    publishProcesses: {},
    uploadProcesses: {},
  },

  getters: {

    projects (state) {
      if (state.projects === null) return null

      return _.chain(state.projects).map((value, key) => {
        value.projectId = key
        return value
      }).orderBy(['filename']).value()
    },

    activeProject (state, getters) {
      let activeProject = _.find(getters.projects, { projectId: state.route.params.id })

      if (getters.projects !== null && state.route.params.id && !activeProject) {
        router.push({ name: state.route.name })
      }

      return (activeProject) ? activeProject : null
    },

    schema (state) {
      if (!state.route.params.id || !state.projects || !state.projects[state.route.params.id]) return {}

      let schema = {}

      try {
      	schema = JSON.parse(state.projects[state.route.params.id].schema)
      } catch (err) {
        return schema
      }

      return buildSchema(schema, state.projects[state.route.params.id].draft)
    },

    activeSchema (state, getters) {
      let path = _.replace(state.route.params.path, />/g, '.')

      if (_.has(getters.schema, path)) {
        return _.get(getters.schema, path)
      } else {
        return {}
      }
    },

  },

  mutations: {

    resetAll (state) {
      state.project = null
      state.user = {
        isLoggedIn: false,
        id: null,
        email: null,
      }
      state.publishProcesses = {}
      state.uploadProcesses = {}
    },

    setUser (state, user) {
      state.user = user
    },

    setProjects (state, projects) {
      state.projects = projects
    },

    setContent (state, payload) {
      Vue.set(state.contents, payload.contentId, {
        content: payload.content,
        projectId: payload.projectId,
        path: payload.path,
      })
    },

    setUploadProcess (state, payload) {
      console.log('setUploadProcess', state.uploadProcesses, payload.projectId, payload.path)
      Vue.set(state.uploadProcesses, `${payload.projectId}>${payload.path}`, {
        projectId: payload.projectId,
        path: payload.path,
        filename: payload.filename,
        blobUrl: payload.blobUrl,
        percent: 0,
        status: 'started',
        message: null,
      })
    },

    updateUploadProcess (state, payload) {
      let currentUploadProcess = _.get(state.uploadProcesses, `${payload.projectId}>${payload.path}`)
      let updatedUploadProcess = _.merge(currentUploadProcess, {
        percent: payload.percent,
        status: payload.status,
        message: payload.message,
      })

      Vue.set(state.uploadProcesses, `${payload.projectId}>${payload.path}`, updatedUploadProcess)
    },

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

    authState ({state, commit, dispatch}) {
      firebase.auth.onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
          commit('setUser', {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            isLoggedIn: true,
          })

          dispatch('getProjectsFromDatabase')
        } else {
          commit('resetAll')
        }
      })
    },

    getProjectsFromDatabase ({state, commit, dispatch}) {
      firebase.firestore
        .collection('projects')
        .where(`roles.${state.user.id}`, '==', 'admin')
        .onSnapshot((querySnapshot) => {
          let projects = {}
          querySnapshot.forEach((doc) => {
            projects[doc.id] = {
              projectId: doc.id,
              role: 'admin',
              filename: doc.data().filename,
              name: (doc.data().name) ? doc.data().name : doc.data().filename,
              schema: (doc.data().schema) ? doc.data().schema : null,
              draft: (doc.data().draft) ? doc.data().draft : null,
              published: (doc.data().published) ? doc.data().published : null,
            }
          })
          commit('setProjects', projects)
        })
    },

    newProject ({state, dispatch}, payload) {
      let projectId = slugg(payload.name)

      if (payload.tries > 0) {
        projectId = `${projectId}-${Math.random().toString(36).slice(-3)}`
      }

      let defaultSchema = {
        title: "text",
        description: "textarea",
        photo: "image",
      }

      let schema = (payload.schema) ? payload.schema : defaultSchema

      let newProject = {
        filename: 'content',
        name: payload.name,
        schema: JSON.stringify(schema, '', '\t'),
        roles: {},
      }

      newProject.roles[state.user.id] = 'admin'

      firebase.firestore
        .collection('projects')
        .doc(projectId)
        .set(newProject)
        .then((docRef) => {
          console.log('File added:', projectId)

          if (payload.redirect !== false) {
            router.push({ name: 'schema', params: { id: projectId }})
          }
        })
        .catch(error => {
          payload.tries = (!payload.tries) ? 1 : payload.tries + 1

          if (payload.tries < 5) {
            console.log('Retry', payload.tries)
            dispatch('newProject', payload)
          } else {
            console.error('File adding error:', error)
          }
        })
    },

    updateContent ({state}, payload) {
      let updateData = {}
      updateData[`draft.${payload.path}`] = payload.content

      console.log('updateContent', updateData)

      firebase.firestore
        .collection('projects')
        .doc(payload.projectId)
        .update(updateData)
        .then(() => console.log('Content successfully updated!'))
        .catch((error) => console.error('Error updating content:', error))
    },

    publishJson ({state, commit, dispatch}, payload) {
      payload.publishTries = (payload.publishTries) ? payload.publishTries : 0
      payload.versionCheck = 0

      if (payload.publishTries > 3) {
        console.error('Publishing failed, try again.')
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
        })
        .then((docRef) => {
          let versionId = docRef.id
          // this.publish.versionId = versionId
          console.log('Added version:', versionId)

          commit('updatePublishProcess', {
            projectId: payload.projectId,
            versionId: versionId,
            // status: 'done',
          })

          // _.delay(() => {
            dispatch('isPublishReady', _.merge(payload, {
              versionId: versionId,
            }))
          // }, 10000)
        })
        .catch((error) => console.error('Error adding version:', error))

    },

    isPublishReady ({state, commit, dispatch}, payload)  {
      payload.versionCheck = payload.versionCheck + 1

      if (payload.versionCheck > 15) {
        console.log('Purge faild.', payload.publishTries)
        payload.publishTries = payload.publishTries + 1
        dispatch('publishJson', payload)
        return false
      }

      let random = Math.random().toString(36).slice(-4)

      axios({
        method: 'GET',
        url: `https://cdn.editlayer.com/${payload.projectId}/${payload.filename}.json`,
        responseType: 'json',
      })
      .then((response) => {

        // console.log('version', payload.versionId, response.data.VERSION_ID)

        if (payload.versionId !== response.data.VERSION_ID) {
          console.log('Try again', payload.versionCheck)
          _.delay(() => {
            dispatch('isPublishReady', payload)
          }, 1000)
        } else {

          let publishedData = {
            'published.draft': payload.draft,
            'published.schema': payload.schema,
          }

          firebase.firestore
            .collection('projects')
            .doc(payload.projectId)
            .update(publishedData)
            .then(() => {
              // this.publish.running = false
              commit('updatePublishProcess', {
                projectId: payload.projectId,
                status: 'done',
              })
              console.log('Published successfully updated!')
            })
            .catch((error) => console.error('Publishing failed', error))
        }

      })
      .catch((error) => {
        // console.error('Getting published JSON failed try again', error.response)
        _.delay(() => {
          dispatch('isPublishReady', payload)
        }, 1000)
      })

    },

    async uploadImage ({state, commit, dispatch}, payload) {
      if (!_.startsWith(payload.image.type, 'image/')) return false

      console.log('payload', payload)

      let maxWidth = (_.has(payload, 'config.width')) ? payload.config.width : 800
      let maxHeight = (_.has(payload, 'config.height')) ? payload.config.height : 800
      let filenameWithoutExt = slugg(payload.image.name.replace(/\.[^/.]+$/, ''))
      let randomId = Math.random().toString(36).slice(-5)
      let blobUrl = URL.createObjectURL(payload.image)

      commit('setUploadProcess', {
        projectId: payload.projectId,
        path: payload.path,
        filename: filenameWithoutExt,
        blobUrl: blobUrl,
        percent: 0,
      })

      // let dimensions = await new Promise(function(resolve, reject) {
      //
      //   let img = new Image()
      //
      //   img.onload = function () {
      //     resolve({
      //       width: this.width,
      //       height: this.height
      //     })
      //   };
      //
      //   img.src = blobUrl
      //
      // })

      let uploadImage = payload.image

      if (_.includes(['image/jpeg', 'image/png'], payload.image.type)) {

        const imageCompressor = new ImageCompressor()
        let optimizedImage = await imageCompressor.compress(payload.image, {
          quality: .8,
          convertSize: 1000000,
          maxWidth: maxWidth,
          maxHeight: maxHeight,
        })
        .then((result) => {
          console.log('Image optimized')
          return result
        })
        .catch((error) => console.error('Image optimize failed', error.message))

        // let savedSize = 100 - (optimizedImage.size / payload.image.size * 100)
        // if (savedSize > 10) {
        //   uploadImage = optimizedImage
        // }

        uploadImage = optimizedImage

      }

      if (uploadImage.size > 1 * 1024 * 1024) {
        commit('updateUploadProcess', {
          projectId: payload.projectId,
          path: payload.path,
          status: 'error',
          message: 'Max image size 1 MB, try another image.'
        })
        console.error('Max image size 1 MB, try another image.')
        return false
      }

      let filename = null
      if (uploadImage.type === 'image/jpeg') {
        filename = `${filenameWithoutExt}-${randomId}.jpg`
      } else if (uploadImage.type === 'image/png') {
        filename = `${filenameWithoutExt}-${randomId}.png`
      } else if (uploadImage.type === 'image/gif') {
        filename = `${filenameWithoutExt}-${randomId}.gif`
      } else if (uploadImage.type === 'image/svg+xml') {
        filename = `${filenameWithoutExt}-${randomId}.svg`
      } else {
        commit('updateUploadProcess', {
          projectId: payload.projectId,
          path: payload.path,
          status: 'error',
          message: `Unsupported file type. Send jpg, png, gif or svg.`
        })
        console.error('Unsupported file type', uploadImage.type)
        return false
      }

      let uploadTask = firebase.storage.ref().child(`${payload.projectId}/${filename}`).put(uploadImage)

      uploadTask.on('state_changed', (snapshot) => {
        let percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

        commit('updateUploadProcess', {
          projectId: payload.projectId,
          path: payload.path,
          percent: percent,
          status: 'updating',
        })

        console.log('Upload is ' + percent + '% done')
      }, (error) => {
        commit('updateUploadProcess', {
          projectId: payload.projectId,
          path: payload.path,
          status: 'error',
          message: 'Upload failer, try again later.'
        })
        console.error('Upload failed', error)
      }, () => {
        console.log('Uploade done')

        commit('updateUploadProcess', {
          projectId: payload.projectId,
          path: payload.path,
          status: 'uploaded',
        })

        _.delay(() => {
          commit('updateUploadProcess', {
            projectId: payload.projectId,
            path: payload.path,
            status: 'done',
          })
        }, 1000)

        dispatch('updateContent', {
          projectId: payload.projectId,
          path: _.replace(payload.path, />/g, '.'),
          content: `https://cdn.editlayer.com/${payload.projectId}/${filename}`,
        })

      })

    },

  },

})
