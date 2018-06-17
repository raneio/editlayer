import _ from 'lodash'
import firebase from '@/utils/firebase'

export default {

  actions: {

    saveContent ({state, getters}, payload) {
      let updateData = {}
      updateData[`draft.${payload.path}`] = payload.content
      let currentContent = _.get(getters.schema, `${payload.path}._content`)

      if (!_.isEqual(currentContent, payload.content)) {
        firebase.firestore
          .collection('projects')
          .doc(payload.projectId)
          .update(updateData)
          .catch((error) => console.error('Error updating content:', error))
      }
    },
  },
}
