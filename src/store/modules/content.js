// import _ from 'lodash'
//
// export default {
//
//   actions: {
//     updateContent ({getters, dispatch}, payload) {
//       let currentContent = _.get(getters.structure, `${payload.path}._content`)
//
//       if (!_.isEqual(currentContent, payload.content)) {
//         dispatch('updateDraftToFirestore', payload)
//       }
//     },
//   },
// }
