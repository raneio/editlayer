// import parseJson from 'parse-json'
// import _ from 'lodash'
// import buildStructure from '@/utils/buildStructure'
//
// export default {
//
//   getters: {
//
//     structure (state, getters) {
//       if (!getters.activeProject) return {}
//
//       const schema = parseJson(getters.activeProject.schema)
//       const draft = getters.activeProject.draft
//       const published = _.has(getters.activeProject, 'publishedVersion.draft') ? getters.activeProject.publishedVersion.draft : {}
//
//       return buildStructure(schema, draft, published)
//     },
//
//     activeItem (state, getters, rootState) {
//       if (!getters.activeProject) return {}
//
//       let path = _.replace(rootState.route.params.path, />/g, '.')
//
//       if (_.has(getters.structure, path)) {
//         return _.get(getters.structure, path)
//       }
//       else {
//         return {}
//       }
//     },
//   },
// }
