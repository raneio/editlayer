import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import uuid from 'uuid/v4'
import firebase from './firebase'
import router from './router'

Vue.use(Vuex)
Vue.use(firebase)

Vue.use(Vuex)

const simpleToAdvanceInSchema = (schema) => {
  _.each(schema, (value, key) => {
    if (!_.includes(['EDITOR', 'CONTENT', 'PATH', 'NAME', 'DEFAULT', 'TYPE'], key)) {

      if (_.isArray(value)) {
        schema[key] = {
          ARRAY: value[0],
        }

        value = simpleToAdvanceInSchema(value)
      }

      if (_.isString(value)) {
        schema[key] = {
          EDITOR: value,
        }
      }
    }

    if (_.isPlainObject(value)) {
      value = simpleToAdvanceInSchema(value)
    }
  })

  return schema
}

const addArraysAndPathsToSchema = (schema, draft, parentPath = false) => {
  _.each(schema, (value, key) => {
    let path = (!parentPath) ? key : `${parentPath}.${key}`

    if (_.has(value, 'ARRAY')) {
      let items = _.get(draft, path)

      _.each(items, (itemValue, itemKey) => {
        _.set(value, `${itemKey}.ORDER`, itemValue.ORDER)

        _.each(value.ARRAY, (arrayValue, arrayKey) => {
          _.set(value, `${itemKey}.${arrayKey}`, _.cloneDeep(arrayValue))
        })
      })
    }

    if (_.isPlainObject(value) && key !== 'ARRAY') {
      value.PATH = path
      value = addArraysAndPathsToSchema(value, draft, path)
    }
  })

  return schema
}

const addDataToSchema = (schema, draft) => {
  _.each(schema, (value, key) => {
    if (_.isPlainObject(value) && key !== 'ARRAY') {

      if (!_.has(value, 'NAME')) {
        value.NAME = key
      }

      if (_.has(value, 'EDITOR')) {
        value.TYPE = 'value'
      } else if (_.has(value, 'ARRAY')) {
        value.TYPE = 'array'
      } else {
        value.TYPE = 'object'
      }

      if (_.has(value, 'EDITOR')) {
        let content = _.get(draft, value.PATH)

        if (content) {
          value.CONTENT = content
        } else if (_.has(value, 'DEFAULT')) {
          value.CONTENT = value.DEFAULT
        } else {
          value.CONTENT = null
        }
      }

      value = addDataToSchema(value, draft)
    }
  })

  return schema
}


export default new Vuex.Store({

  state: {
    files: {},
    user: {
      isLoggedIn: false,
      id: null,
      email: null,
    },
  },

  getters: {

    files (state) {
      return _.chain(state.files).map((value, key) => {
        value.fileId = key
        return value
      }).orderBy(['filename']).value()
    },

    schema (state) {
      if (!state.route.params.id || !state.files || !state.files[state.route.params.id]) return {}

      let schema = {}

      try {
      	schema = JSON.parse(state.files[state.route.params.id].schema)
      } catch (err) {
        console.warn('Schema Syntax Error')
        return {}
      }

      schema = simpleToAdvanceInSchema(schema)
      schema = addArraysAndPathsToSchema(schema, state.files[state.route.params.id].draft)
      // schema = addNamesTypesToSchema(schema)
      schema = addDataToSchema(schema, state.files[state.route.params.id].draft)

      return schema
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

    authLogin ({state, commit}, payload) {
      firebase.auth.signInWithEmailAndPassword(payload.email, payload.password)
    },

    authLogout ({state, commit}) {
      firebase.auth.signOut()
    },

    authRegister ({state, commit}, payload) {
      firebase.auth.createUserWithEmailAndPassword(payload.email, payload.password)
      .then(user => {

        firebase.db.collection('users').doc(user.uid).set({
          email: user.email,
        })
        .then(() => console.log('Added user:', user.email))
        .catch((error) => console.log('Adding user error:', error))

      })
      .catch(error => console.log('register error', error.message))
    },

    getFilesFromDatabase ({state, commit, dispatch}) {
      firebase.db.collection('files').where(`roles.${state.user.id}`, '==', 'admin').onSnapshot((querySnapshot) => {
        let files = {}
        querySnapshot.forEach((doc) => {
          files[doc.id] = {
            fileId: doc.id,
            role: 'admin',
            filename: doc.data().filename,
            schema: doc.data().schema,
            draft: doc.data().draft,
            downloadToken: doc.data().downloadToken,
          }
        })
        commit('setFile', files)
      })
    },

    newFile ({state, dispatch}, filename) {
      let defaultSchema = {
        title: {
          EDITOR: "text"
        },
        description: {
          EDITOR: "textarea"
        }
      }

      let newFile = {
        filename: `${filename}.json`,
        schema: JSON.stringify(defaultSchema, '', '\t'),
        roles: {},
        downloadToken: uuid(),
      }

      newFile.roles[state.user.id] = 'admin'

      firebase.db.collection('files').add(newFile)
      .then((docRef) => {
        console.log('File added:', docRef.id)

        dispatch('publishJson', {
          fileId: docRef.id,
          content: {},
          filename: newFile.filename,
          downloadToken: newFile.downloadToken,
        })

        router.push({ name: 'admin', params: { id: docRef.id, tab: 'schema' }})
      })
      .catch(error => console.log('File adding error:', error))
    },

    saveSchema ({state}, payload) {
      firebase.db.collection('files').doc(payload.fileId).update({
        schema: payload.schema,
      })
      .then(() => console.log('Schema successfully written!'))
      .catch((error) => console.error('Error writing schema:', error))
    },

    updateContent ({state}, payload) {
      let updateData = {}
      updateData[`draft.${payload.path}`] = payload.content

      firebase.db.collection('files').doc(payload.fileId).update(updateData)
      .then(() => console.log('Content successfully updated!'))
      .catch((error) => console.error('Error updating content:', error))
    },

    newArrayItem ({state, dispatch}, payload) {
      console.log('payload', payload)
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

      firebase.db.collection('files').doc(payload.fileId).update(updateData)
      .then(() => console.log('New item added!'))
      .catch((error) => console.error('Error new item:', error))

      let pathUrl = _.replace(`${payload.path}.${randomKey}`, /\./g, '>')
      router.push({ name: 'edit', params: { id: payload.fileId, path: pathUrl }})
    },

    publishJson ({state}, payload) {
      firebase.db.collection('files').doc(payload.fileId).collection('versions').add({
        publishedBy: state.user.id,
        content: payload.content,
        filename: payload.filename,
        downloadToken: payload.downloadToken,
      })
      .then((docRef) => console.log('Added version:', docRef.id))
      .catch((error) => console.log('Error adding version:', error))
    },

  },

})
