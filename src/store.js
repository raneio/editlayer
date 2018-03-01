import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import slugg from 'slugg'
import axios from 'axios'
import firebase from './firebase'
import router from './router'
import buildSchema from './utils/buildSchema'

Vue.use(Vuex)
Vue.use(firebase)

export default new Vuex.Store({

  state: {
    files: null,
    user: {
      isLoggedIn: null,
      id: null,
      email: null,
    },
  },

  getters: {

    files (state) {
      if (state.files === null) return null

      return _.chain(state.files).map((value, key) => {
        value.fileId = key
        return value
      }).orderBy(['filename']).value()
    },

    activeFile (state, getters) {
      let activeFile = _.find(getters.files, { fileId: state.route.params.id })

      if (getters.files !== null && state.route.params.id && !activeFile) {
        router.push({ name: state.route.name })
      }

      return activeFile
    },

    schema (state) {
      if (!state.route.params.id || !state.files || !state.files[state.route.params.id]) return {}

      let schema = {}

      try {
      	schema = JSON.parse(state.files[state.route.params.id].schema)
      } catch (err) {
        return schema
      }

      return buildSchema(schema, state.files[state.route.params.id].draft)
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

    setUser (state, user) {
      state.user = user
    },

    setFile (state, files) {
      state.files = files
    },

    setContent (state, payload) {
      Vue.set(state.contents, payload.contentId, {
        content: payload.content,
        fileId: payload.fileId,
        path: payload.path,
      })
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

          dispatch('getFilesFromDatabase')
        } else {
          commit('setUser', {
            id: null,
            email: null,
            isLoggedIn: false,
          })
        }
      })
    },

    // authLogin ({state, commit}, payload) {
    //   firebase.auth.signInWithEmailAndPassword(payload.email, payload.password)
    // },

    authLogout ({state, commit}) {
      firebase.auth.signOut()
    },

    // authRegister ({state, commit}, payload) {
    //   firebase.auth.createUserWithEmailAndPassword(payload.email, payload.password)
    //   .then(user => {
    //
    //     firebase.firestore.collection('users').doc(user.uid).set({
    //       email: user.email,
    //     })
    //     .then(() => console.log('Added user:', user.email))
    //     .catch((error) => console.log('Adding user error:', error))
    //
    //   })
    //   .catch(error => console.log('register error', error.message))
    // },

    getFilesFromDatabase ({state, commit, dispatch}) {
      firebase.firestore.collection('files').where(`roles.${state.user.id}`, '==', 'admin').onSnapshot((querySnapshot) => {
        let files = {}
        querySnapshot.forEach((doc) => {
          files[doc.id] = {
            fileId: doc.id,
            role: 'admin',
            filename: doc.data().filename,
            name: (doc.data().name) ? doc.data().name : doc.data().filename,
            schema: (doc.data().schema) ? doc.data().schema : null,
            draft: (doc.data().draft) ? doc.data().draft : null,
            // downloadToken: (doc.data().downloadToken) ? doc.data().downloadToken : null,
            published: (doc.data().published) ? doc.data().published : null,
          }
        })
        commit('setFile', files)
      })
    },

    newFile ({state, dispatch}, payload) {
      let fileId = Math.random().toString(36).slice(-5)
      let filename = slugg(payload.name)

      let defaultSchema = {
        title: "text",
        description: "textarea",
        photo: "image",
      }

      let schema = (payload.schema) ? payload.schema : defaultSchema

      let newFile = {
        filename: filename,
        name: payload.name,
        schema: JSON.stringify(schema, '', '\t'),
        roles: {},
        // downloadToken: uuid(),
      }

      newFile.roles[state.user.id] = 'admin'

      firebase.firestore.collection('files').doc(fileId).set(newFile)
      .then((docRef) => {
        console.log('File added:', fileId)

        if (payload.redirect !== false) {
          router.push({ name: 'schema', params: { id: fileId }})
        }
      })
      .catch(error => {
        payload.tries = (!payload.tries) ? 1 : payload.tries + 1

        if (payload.tries < 5) {
          console.log('Retry', payload.tries)
          dispatch('newFile', payload)
        } else {
          console.error('File adding error:', error)
        }
      })
    },

    saveSchema ({state}, payload) {

      try {
      	JSON.parse(payload.schema)
      } catch (err) {
        console.error('Not Saved: Schema Syntax Error')
        return false
      }

      // console.log('saveSchema', payload)

      firebase.firestore.collection('files').doc(payload.fileId).update({
        schema: payload.schema,
      })
      .then(() => console.log('Schema successfully written!'))
      .catch((error) => console.error('Error writing schema:', error))
    },

    updateContent ({state}, payload) {
      let updateData = {}
      updateData[`draft.${payload.path}`] = payload.content

      console.log('updateContent', updateData)

      firebase.firestore.collection('files').doc(payload.fileId).update(updateData)
      .then(() => console.log('Content successfully updated!'))
      .catch((error) => console.error('Error updating content:', error))
    },

    delteArrayItem ({state}, payload) {
      let updateData = {}
      updateData[`draft.${payload.path}`] = firebase.firestoreDelete

      console.log('deleteValue', updateData)

      firebase.firestore.collection('files').doc(payload.fileId).update(updateData)
      .then(() => console.log('Value successfully deleted!'))
      .catch((error) => console.error('Error deleting value:', error))
    },

    // updateStatus ({state}, payload) {
    //   let updateData = {
    //     status: payload.status,
    //   }
    //
    //   console.log('updateStatus', updateData)
    //
    //   firebase.firestore.collection('files').doc(payload.fileId).update(updateData)
    //   .then(() => console.log('Status successfully updated!'))
    //   .catch((error) => console.error('Error updating Status:', error))
    // },

    newArrayItem ({state, dispatch}, payload) {
      let randomKey = `-${Math.random().toString(36).slice(-4)}`
      let path = `draft.${payload.path}`
      let newPath = `${path}.${randomKey}`
      let items = _.get(state.files[payload.fileId], path)
      let order = 0

      if (_.has(state.files[payload.fileId], newPath)) {
        dispatch('newArrayItem', payload)
        return false
      }

      _.each(items, (item, key) => {
        if (order >= item.ORDER) {
          order = item.ORDER - 1
        }
      })

      let updateData = {}
      updateData[newPath] = {
        ORDER: order,
      }

      firebase.firestore.collection('files').doc(payload.fileId).update(updateData)
      .then(() => console.log('New item added!'))
      .catch((error) => console.error('Error new item:', error))

      let pathUrl = _.replace(`${payload.path}.${randomKey}`, /\./g, '>')
      router.push({ name: 'edit', params: { id: payload.fileId, path: pathUrl }})
    },

    publishJson ({state, dispatch, getters}, payload) {

      firebase.firestore.collection('files').doc(payload.fileId).collection('versions').add({
        publishedBy: state.user.id,
        publishedAt: firebase.firestoreTimestamp,
        content: payload.content,
        filename: payload.filename,
        // downloadToken: payload.downloadToken,
      })
      .then((docRef) => console.log('Added version:', docRef.id))
      .catch((error) => console.error('Error adding version:', error))

      let publishedData = {
        'published.draft': getters.activeFile.draft,
        'published.schema': getters.activeFile.schema,
      }

      console.log('publishedData', publishedData)

      firebase.firestore.collection('files').doc(payload.fileId).update(publishedData)
      .then(() => console.log('Published successfully updated!'))
      .catch((error) => console.error('Error updating published:', error))

      // TODO: Move this to the firebase functions
      _.delay(() => {
        axios({
          method: 'post',
          url: 'https://api.imgix.com/v2/image/purger',
          auth: {
            username: 'jRj2WRDWN5ED3TkdGJUEHFfUMHhjbA8j',
            password: '',
          },
          data: {
            url: `https://editlayer.imgix.net/${payload.fileId}/${payload.filename}.json`,
          },
        })
        .then((response) => console.log('Imgix purge done', response))
        .catch((error) => console.error('Imgix purge faild', error))
      }, 3000)

    },

    // uploadImages ({state, dispatch}, images) {
    //   let file = images[0]
    //   let randomKey = Math.random().toString(36).slice(-4)
    //   let path = `${randomKey}/${file.name}`
    //   let storageRef = firebase.storage.ref().child(`images/${path}`)
    //
    //   storageRef.put(file)
    //   .then((snapshot) => {
    //     console.log('Uploaded a blob or file!', snapshot)
    //   })
    //   .catch((error) => {
    //     dispatch('uploadImages', images)
    //   })
    //
    // },

  },

})
