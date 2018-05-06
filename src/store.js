import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import slugg from 'slugg'
import axios from 'axios'
import ImageCompressor from 'image-compressor.js'
import firebase from '@/firebase'
import router from '@/router'
import buildStructure from '@/utils/buildStructure'
import webhook from '@/utils/webhook'

Vue.use(Vuex)
Vue.use(firebase)

export default new Vuex.Store({

  state: {
    projects: {
      admin: null,
      editor: null
    },
    user: {
      isLoggedIn: null,
      id: null,
      email: null
    },
    notifications: {},
    publishProcesses: {},
    editors: [
      'text',
      'textarea',
      'richtext',
      'image',
      'color',
      'time',
      'date',
      'datetime',
      'week',
      'month',
      'email',
      'number',
      'password',
      'range',
      'tel',
      'url'
    ]
  },

  getters: {

    projects (state) {
      if (state.projects.admin === null && state.projects.editor === null) return null
      let projectsEditor = _.cloneDeep(state.projects.editor)
      let projectsAdmin = _.cloneDeep(state.projects.admin)

      let project = _.merge(projectsEditor, projectsAdmin)

      return _.chain(project).map((value, key) => {
        value.projectId = key
        return value
      }).orderBy(['filename']).value()
    },

    activeProject (state, getters) {
      let activeProject = _.find(getters.projects, { projectId: state.route.params.projectId })

      if (getters.projects !== null && state.route.params.projectId && !activeProject) {
        router.push({ name: state.route.name })
      }

      return (activeProject) || null
    },

    activeRole (state, getters) {
      if (!_.has(getters, `activeProject.roles[${state.user.id}].role`)) return null
      return getters.activeProject.roles[state.user.id].role
    },

    structure (state, getters) {
      if (!state.route.params.projectId || !getters.activeProject) return {}

      let structure = {}

      try {
        structure = JSON.parse(getters.activeProject.structure)
      } catch (err) {
        return structure
      }

      return buildStructure(structure, getters.activeProject.draft)
    },

    activeStructure (state, getters) {
      let path = _.replace(state.route.params.path, />/g, '.')

      if (_.has(getters.structure, path)) {
        return _.get(getters.structure, path)
      } else {
        return {}
      }
    },

    jsonUrl (state, getters) {
      if (!getters.activeProject) return false
      return `https://cdn.editlayer.com/${getters.activeProject.projectId}/${getters.activeProject.filename}.json`
    }

  },

  mutations: {

    resetAll (state) {
      state.projects.admin = null
      state.projects.editor = null
      state.user.isLoggedIn = false
      state.user.id = null
      state.user.email = null
      state.notifications = {}
      state.publishProcesses = {}
    },

    setUser (state, user) {
      state.user = user
    },

    setProjects (state, payload) {
      let projects = {}

      payload.querySnapshot.forEach((doc) => {
        projects[doc.id] = {
          projectId: doc.id,
          roles: doc.data().roles,
          filename: doc.data().filename,
          name: (doc.data().name) ? doc.data().name : doc.data().filename,
          structure: (doc.data().structure) ? doc.data().structure : null,
          draft: (doc.data().draft) ? doc.data().draft : null,
          published: (doc.data().published) ? doc.data().published : null,
          settings: (doc.data().settings) ? doc.data().settings : null
        }
      })

      state.projects[payload.myRole] = projects
    },

    setContent (state, payload) {
      Vue.set(state.contents, payload.contentId, {
        content: payload.content,
        projectId: payload.projectId,
        path: payload.path
      })
    },

    setNotification (state, payload) {
      let currentNotification = {}

      if (!payload.id) {
        payload.id = Math.random().toString(36).slice(-8)
      }

      if (_.has(state.notifications, payload.id)) {
        currentNotification = _.get(state.notifications, payload.id)
      }

      let notification = _.merge(currentNotification, {
        status: payload.status,
        message: payload.message,
        progress: payload.progress,
        image: payload.image
      })

      console.log('setNotification', notification)

      Vue.set(state.notifications, payload.id, notification)
    },

    setPublishProcess (state, payload) {
      Vue.set(state.publishProcesses, payload.projectId, {
        status: 'publishing',
        message: null
      })
    },

    updatePublishProcess (state, payload) {
      let currentPublishProcess = _.get(state.publishProcesses, payload.projectId)
      let updatedPublishProcess = _.merge(currentPublishProcess, {
        versionId: payload.versionId,
        status: payload.status,
        message: payload.message
      })

      Vue.set(state.publishProcesses, payload.projectId, updatedPublishProcess)
    },

    deleteNotification (state, id) {
      console.log('deleteNotification', id)
      Vue.delete(state.notifications, id)
    }

  },

  actions: {

    authState ({state, commit, dispatch}) {
      firebase.auth.onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
          commit('setUser', {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            isLoggedIn: true
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
        .where(`roles.${state.user.id}.role`, '==', 'admin')
        .onSnapshot((querySnapshot) => {
          commit('setProjects', {
            myRole: 'admin',
            querySnapshot: querySnapshot
          })
        })

      firebase.firestore
        .collection('projects')
        .where(`roles.${state.user.id}.role`, '==', 'editor')
        .onSnapshot((querySnapshot) => {
          commit('setProjects', {
            myRole: 'editor',
            querySnapshot: querySnapshot
          })
        })
    },

    newProject ({state, dispatch}, payload) {
      let projectId = slugg(payload.name)

      if (payload.tries > 0) {
        projectId = `${projectId}-${Math.random().toString(36).slice(-3)}`
      }

      let defaultStructure = {
        title: 'text',
        description: 'textarea',
        photo: 'image'
      }

      let structure = (payload.structure) ? payload.structure : defaultStructure

      let newProject = {
        filename: 'content',
        name: payload.name,
        structure: JSON.stringify(structure, '', '\t'),
        roles: {}
      }

      newProject.roles[state.user.id] = {
        role: 'admin',
        email: state.user.email,
        userExist: true
      }

      firebase.firestore
        .collection('projects')
        .doc(projectId)
        .set(newProject)
        .then((docRef) => {
          console.log('File added:', projectId)
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

    updateContent ({state, getters}, payload) {
      let updateData = {}
      updateData[`draft.${payload.path}`] = payload.content
      let currentContent = _.get(getters.structure, `${payload.path}.CONTENT`)

      if (!_.isEqual(currentContent, payload.content)) {
        console.log('updateContent', updateData)

        firebase.firestore
          .collection('projects')
          .doc(payload.projectId)
          .update(updateData)
          .then(() => console.log('Content successfully updated!'))
          .catch((error) => console.error('Error updating content:', error))
      }
    },

    publishJson ({state, commit, dispatch}, payload) {
      payload.publishTries = (payload.publishTries) ? payload.publishTries : 0
      payload.versionCheck = 0

      if (payload.publishTries > 3) {
        console.error('Publishing failed, try again.')
        commit('updatePublishProcess', {
          projectId: payload.projectId,
          status: 'error'
        })
      }

      commit('setPublishProcess', {
        projectId: payload.projectId
      })

      firebase.firestore
        .collection('projects')
        .doc(payload.projectId)
        .collection('versions')
        .add({
          publishedBy: payload.publishedBy,
          publishedAt: firebase.firestoreTimestamp,
          content: payload.content,
          filename: payload.filename
        })
        .then((docRef) => {
          let versionId = docRef.id

          commit('updatePublishProcess', {
            projectId: payload.projectId,
            versionId: versionId
          })

          dispatch('isPublishReady', _.merge(payload, {
            versionId: versionId
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
        url: `https://cdn.editlayer.com/${payload.projectId}/${payload.filename}.json`,
        responseType: 'json'
      })
        .then((response) => {
          if (payload.versionId !== response.data.VERSION_ID) throw new Error('Publishing not ready')

          return firebase.firestore
            .collection('projects')
            .doc(payload.projectId)
            .update({
              'published.draft': payload.draft,
              'published.structure': payload.structure
            })
        })
        .then(() => {
          console.log('Published successfully updated!')

          // Webhook here
          if (_.get(getters, 'activeProject.settings.webhook.enabled') === true) {
            webhook(getters.activeProject.settings.webhook.config, getters.jsonUrl)
          }

          commit('updatePublishProcess', {
            projectId: payload.projectId,
            status: 'done'
          })
        })
        .catch((error) => {
          console.warn('Try again', payload.versionCheck, error.message)

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

      commit('setNotification', {
        id: `${payload.projectId}>${payload.path}>upload`,
        status: 'info',
        message: filenameWithoutExt,
        image: blobUrl,
        progress: 0
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
          quality: 0.8,
          convertSize: 1000000,
          maxWidth: maxWidth,
          maxHeight: maxHeight
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
        commit('setNotification', {
          id: `${payload.projectId}>${payload.path}>upload`,
          status: 'error',
          message: 'Max image size 1 MB, try another image.',
          image: blobUrl
        })

        console.error('Max image size 1 MB, try another image.')
        return false
      }

      let filename = `${filenameWithoutExt}-${randomId}`

      if (uploadImage.type === 'image/jpeg') {
        filename = `${filename}.jpg`
      } else if (uploadImage.type === 'image/png') {
        filename = `${filename}.png`
      } else if (uploadImage.type === 'image/gif') {
        filename = `${filename}.gif`
      } else if (uploadImage.type === 'image/svg+xml') {
        filename = `${filename}.svg`
      } else {
        commit('setNotification', {
          id: `${payload.projectId}>${payload.path}>upload`,
          status: 'error',
          message: `Unsupported file type. Send jpg, png, gif or svg.`
        })
        console.error('Unsupported file type', uploadImage.type)
        return false
      }

      let uploadTask = firebase.storage.ref().child(`${payload.projectId}/${filename}`).put(uploadImage)

      uploadTask.on('state_changed', (snapshot) => {
        let percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

        commit('setNotification', {
          id: `${payload.projectId}>${payload.path}>upload`,
          progress: percent
        })

        console.log('Upload is ' + percent + '% done')
      }, (error) => {
        commit('setNotification', {
          id: `${payload.projectId}>${payload.path}>upload`,
          status: 'error',
          message: 'Upload failer, try again later.'
        })
        console.error('Upload failed', error)
      }, () => {
        console.log('Uploade done')

        _.delay(() => {
          commit('deleteNotification', `${payload.projectId}>${payload.path}>upload`)
        }, 1000)

        dispatch('updateContent', {
          projectId: payload.projectId,
          path: _.replace(payload.path, />/g, '.'),
          content: `https://cdn.editlayer.com/${payload.projectId}/${filename}`
        })
      })
    }

  }

})
