import _ from 'lodash'
import buildSchema from '@/utils/buildSchema'

export default {

  getters: {

    schema (state, getters) {
      if (!state.route.params.projectId || !getters.activeProject) return {}

      let schema = {}

      try {
        schema = JSON.parse(getters.activeProject.schema)
      }
      catch (err) {
        return schema
      }

      let draft = getters.activeProject.draft
      let published = _.has(getters, 'activeProject.published.draft') ? getters.activeProject.published.draft : {}

      return buildSchema(schema, draft, published)
    },

    activeSchema (state, getters) {
      let path = _.replace(state.route.params.path, />/g, '.')

      if (_.has(getters.schema, path)) {
        return _.get(getters.schema, path)
      }
      else {
        return {}
      }
    },
  },
}
