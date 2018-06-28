import Vue from 'vue'
import firebase from '@/utils/firebase'
import Chance from 'chance'

const chance = new Chance()

export default {

  state: {
    adminProjects: null,
    editorProjects: null,
  },

  mutations: {

    setProjects (state, payload) {
      let projects = {}

      payload.querySnapshot.forEach((doc) => {
        projects[doc.id] = doc.data()
        projects[doc.id].fetchedAt = Date.now()
      })

      Vue.set(state, payload.group, projects)
    },

  },

  actions: {

    getProjectsFromFirestore ({state, commit, dispatch, rootState}) {
      firebase.firestore
        .collection('projects')
        .where(`users.${rootState.auth.id}.role`, '==', 'admin')
        .onSnapshot((querySnapshot) => {
          commit('setProjects', {
            group: 'adminProjects',
            querySnapshot: querySnapshot,
          })
        })

      firebase.firestore
        .collection('projects')
        .where(`users.${rootState.auth.id}.role`, '==', 'editor')
        .onSnapshot((querySnapshot) => {
          commit('setProjects', {
            group: 'editorProjects',
            querySnapshot: querySnapshot,
          })
        })
    },

    newProjectToFirestore ({state, dispatch, rootState}, payload) {
      let newProject = payload.newProject
      payload = payload.payload

      firebase.firestore
        .collection('projects')
        .doc(payload.id)
        .set(newProject)
        // .then((docRef) => console.log('File added:', projectId))
        .catch(error => {
          payload.tries = !payload.tries ? 1 : payload.tries + 1

          if (payload.tries < 5) {
            // TODO: Change hash to random string
            payload.id = `${payload.id}-${chance.hash({length: 4})}`
            dispatch('newProject', payload)
          }
          else {
            console.error('Creating new project failed', error)
          }
        })
    },

    deleteProjectFromFirestore ({state}, payload) {
      firebase.firestore
        .collection('projects')
        .doc(payload.id)
        .collection('jobs')
        .add({
          job: 'deleteProject',
          deleteProjectId: payload.id,
        })
        .catch((error) => console.error('Project deleting failed', error))
    },

    newProjectVersionToFirestore ({state}, payload) {
      return firebase.firestore
        .collection('projects')
        .doc(payload.projectId)
        .collection('versions')
        .add({
          publishedBy: payload.publishedBy,
          publishedAt: firebase.firestoreTimestamp,
          content: payload.content,
          // filename: payload.filename,
          // downloadToken: payload.downloadToken,
        })
        .catch((error) => console.error('Error adding version:', error))
    },

    setProjectPublished ({state}, payload) {
      firebase.firestore
        .collection('projects')
        .doc(payload.projectId)
        .update({
          'published.draft': payload.draft,
          'published.schema': payload.schema,
          'published.publishedAt': firebase.firestoreTimestamp,
          'published.versionId': payload.versionId,
        })
    },

    updateContentToFirestore ({state, getters}, payload) {
      let updateContent = {}
      updateContent[`draft.${payload.path}`] = payload.content

      firebase.firestore
        .collection('projects')
        .doc(payload.projectId)
        .update(updateContent)
        .catch((error) => console.error('Error updating content:', error))
    },

    updateSchemaToFirestore ({getters}, newSchema) {
      firebase.firestore
        .collection('projects')
        .doc(getters.activeProject.id)
        .update({
          schema: newSchema,
        })
        // .then(() => console.log('Schema successfully written!'))
        .catch((error) => console.error('Error writing schema:', error))
    },

    newPermissionToFirestore ({commit, getters}, payload) {
      firebase.firestore
        .collection('projects')
        .doc(payload.projectId)
        .collection('jobs')
        .add({
          job: 'attachRole',
          role: 'editor',
          email: payload.email,
        })
        // .then(() => console.log('Permission job added')})
        .catch(error => console.error('Permission job adding failed', error))
    },

    updatePermissionToFirestore ({getters}, payload) {
      let newRole = {}
      newRole[`users.${payload.userId}.role`] = payload.role

      firebase.firestore
        .collection('projects')
        .doc(getters.activeProject.id)
        .update(newRole)
        // .then(() => console.log('Permission updated!'))
        .catch((error) => console.error('Permission updating failed', error))
    },

    removePermissionToFirestore ({getters}, payload) {
      let removeUser = {}
      removeUser[`users.${payload.userId}`] = firebase.firestoreDelete

      firebase.firestore
        .collection('projects')
        .doc(getters.activeProject.id)
        .update(removeUser)
        .then(() => console.log('Permission deleted'))
        .catch((error) => console.error('Permission deleting failed', error))
    },

  },

}
