import _ from 'lodash'
import slugg from 'slugg'
import shortid from 'shortid'
import firebase from '@/utils/firebase'
import router from '@/router'

export default {

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
        router.push({name: state.route.name})
      }

      return (activeProject) || null
    },

  },

  mutations: {

    setProjects (state, payload) {
      let projects = {}

      payload.querySnapshot.forEach((doc) => {
        projects[doc.id] = {
          projectId: doc.id,
          roles: doc.data().roles,
          filename: doc.data().filename,
          downloadToken: doc.data().downloadToken,
          name: (doc.data().name) ? doc.data().name : doc.data().filename,
          schema: (doc.data().schema) ? doc.data().schema : null,
          draft: (doc.data().draft) ? doc.data().draft : null,
          published: (doc.data().published) ? doc.data().published : null,
          settings: (doc.data().settings) ? doc.data().settings : null,
        }
      })

      state.projects[payload.myRole] = projects
    },

  },

  actions: {

    getProjectsFromDatabase ({state, commit, dispatch}) {
      firebase.firestore
        .collection('projects')
        .where(`roles.${state.user.id}.role`, '==', 'admin')
        .onSnapshot((querySnapshot) => {
          commit('setProjects', {
            myRole: 'admin',
            querySnapshot: querySnapshot,
          })
        })

      firebase.firestore
        .collection('projects')
        .where(`roles.${state.user.id}.role`, '==', 'editor')
        .onSnapshot((querySnapshot) => {
          commit('setProjects', {
            myRole: 'editor',
            querySnapshot: querySnapshot,
          })
        })
    },

    newProject ({state, dispatch}, payload) {
      let projectId = slugg(payload.name)

      if (payload.tries > 0) {
        projectId = `${projectId}-${shortid.generate()}`
      }

      let defaultSchema = {
        title: 'text',
        description: 'textarea',
        photo: 'image',
      }

      let schema = (payload.schema) ? payload.schema : defaultSchema

      let newProject = {
        filename: 'content',
        name: payload.name,
        schema: JSON.stringify(schema, '', '\t'),
        roles: {},
        downloadToken: shortid.generate(),
      }

      newProject.roles[state.user.id] = {
        role: 'admin',
        email: state.user.email,
        userExist: true,
      }

      firebase.firestore
        .collection('projects')
        .doc(projectId)
        .set(newProject)
        .then((docRef) => {
          // console.log('File added:', projectId)
        })
        .catch(error => {
          payload.tries = (!payload.tries) ? 1 : payload.tries + 1

          if (payload.tries < 5) {
            // console.log('Retry', payload.tries)
            dispatch('newProject', payload)
          }
          else {
            console.error('File adding error:', error)
          }
        })
    },

  },

}
