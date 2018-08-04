// import Vue from 'vue'
// import dayjs from 'dayjs'
import generate from 'nanoid/generate'
import router from '@/router'
import firebase from '@/utils/firebase'

export default {

  state: {
    projects: null,
    user: null,
  },

  mutations: {

    setUser (state, user) {
      state.user = user
    },

    setProjects (state, projects) {
      state.projects = projects
    },

  },

  actions: {
    authState ({state, commit, dispatch, rootState}) {
      firebase.auth.onAuthStateChanged(firebaseUser => {
        if (!firebaseUser) {
          commit('setUser', false)
          commit('setProjects', false)
          return null
        }

        dispatch('getUserFromFirestore', firebaseUser.uid)
        dispatch('getProjectsFromFirestore', {
          id: firebaseUser.uid,
          email: firebaseUser.email,
        })

        if (rootState.route.name === 'Register') {
          router.push({name: 'Dashboard'})
        }
      })
    },

    getUserFromFirestore ({state, commit}, userId) {
      firebase.firestore
        .collection('users')
        .doc(userId)
        .onSnapshot(docSnapshot => {
          commit('setUser', {
            id: userId,
            ...docSnapshot.data(),
          })
        })
    },

    getProjectsFromFirestore ({state, commit}, payload) {
      firebase.firestore
        .collection('projects')
        .where(`users.${payload.id}.email`, '==', payload.email)
        .onSnapshot(querySnapshot => {
          let projects = {}
          querySnapshot.forEach(doc => {
            projects[doc.id] = doc.data()
          })

          commit('setProjects', projects)
        })
    },

    newProjectToFirestore ({state, dispatch}, payload) {
      // console.log('newProjectToFirestore', payload)
      let newProject = payload.newProject
      payload = payload.payload

      firebase.firestore
        .collection('projects')
        .doc(payload.id)
        .set(newProject)
        .catch(error => {
          payload.tries = !payload.tries ? 1 : payload.tries + 1

          if (payload.tries < 5) {
            const orginalId = payload.tries > 1 ? payload.id.slice(0, -5) : payload.id
            const randomId = generate('abcdefghijklmnopqrstuvwxyz', 4)
            payload.id = `${orginalId}-${randomId}`
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
          // publishedAt: null,
          publishedAt: firebase.firestoreTimestamp,
          json: payload.json,
          // filename: payload.filename,
          token: payload.token,
          schema: payload.schema,
          draft: payload.draft,
        })
        .catch((error) => console.error('Error adding version:', error))
    },

    setProjectPublished ({state}, payload) {
      let updateData = {}
      updateData['published'] = {
        draft: payload.draft,
        schema: payload.schema,
        publishedAt: firebase.firestoreTimestamp,
        versionId: payload.versionId,
      }

      firebase.firestore
        .collection('projects')
        .doc(payload.projectId)
        .update(updateData)
    },

    updateDraftToFirestore ({state, getters}, payload) {
      let updateContent = {}
      updateContent[`draft.${payload.path}`] = payload.content

      firebase.firestore
        .collection('projects')
        .doc(payload.projectId)
        .update(updateContent)
        .catch((error) => console.error('Error updating content:', error))
    },

    updateSchemaToFirestore ({state}, payload) {
      firebase.firestore
        .collection('projects')
        .doc(payload.projectId)
        .update({
          schema: payload.schema,
        })
        .catch((error) => console.error('Error writing schema:', error))
    },

    newPermissionToFirestore ({commit, getters}, payload) {
      firebase.firestore
        .collection('projects')
        .doc(payload.projectId)
        .collection('jobs')
        .add({
          job: 'addUserToProject',
          email: payload.email,
          permissions: {
            publish: true,
            updateDraft: true,
          },
        })
        .catch(error => console.error('Add user job adding failed', error))
    },

    async addUserToProjectToFirestore ({commit, getters}, payload) {
      let userData = {}
      userData[`users.${payload.awaitId}`] = payload.user

      // console.log('addUserToProjectToFirestore', payload)

      await firebase.firestore
        .collection('projects')
        .doc(payload.projectId)
        .update(userData)
        .catch(error => console.error('Add user job adding failed', error))

      firebase.firestore
        .collection('projects')
        .doc(payload.projectId)
        .collection('jobs')
        .add({
          job: 'attachUserToProject',
          email: payload.email,
          awaitId: payload.awaitId,
          projectId: payload.projectId,
        })
        .catch(error => console.error('Add user job adding failed', error))
    },

    updatePermissionToFirestore ({state}, payload) {
      // console.log('updatePermissionToFirestore', payload)
      let newRole = {}
      newRole[`users.${payload.userId}.permissions`] = payload.permissions

      firebase.firestore
        .collection('projects')
        .doc(payload.projectId)
        .update(newRole)
        .catch((error) => console.error('Permission updating failed', error))
    },

    removeUserFromProjectToFirestore ({state}, payload) {
      // console.log('removeUserFromProjectToFirestore', payload)
      let removeUser = {}
      removeUser[`users.${payload.userId}`] = firebase.firestoreDelete

      // console.log('removeUser', removeUser)

      firebase.firestore
        .collection('projects')
        .doc(payload.projectId)
        .update(removeUser)
        .catch(error => console.error('Permission deleting failed', error))
    },

  },

}
