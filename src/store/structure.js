import _ from 'lodash'
import buildStructure from '@/utils/buildStructure'

export default {

  getters: {

    structure (state, getters) {
      if (!state.route.params.projectId || !getters.activeProject) return {}

      let structure = {}

      try {
        structure = JSON.parse(getters.activeProject.structure)
      }
      catch (err) {
        return structure
      }

      let draft = getters.activeProject.draft
      let published = _.has(getters, 'activeProject.published.draft') ? getters.activeProject.published.draft : {}

      return buildStructure(structure, draft, published)
    },

    activeStructure (state, getters) {
      let path = _.replace(state.route.params.path, />/g, '.')

      if (_.has(getters.structure, path)) {
        return _.get(getters.structure, path)
      }
      else {
        return {}
      }
    },
  },
}
