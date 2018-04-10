import _ from 'lodash'
import titleCase from 'title-case'

const simpleToAdvance = (structure) => {
  _.each(structure, (value, key) => {
    if (!_.includes(['EDITOR', 'CONTENT', 'PATH', 'NAME', 'DEFAULT', 'TYPE', 'INFO', 'CONFIG'], key)) {
      if (_.isArray(value)) {
        structure[key] = {
          ARRAY: value[0]
        }

        if (_.has(value[0], 'NAME')) {
          structure[key].NAME = value[0].NAME
        }

        value = simpleToAdvance(value)
      }

      if (_.isString(value)) {
        structure[key] = {
          EDITOR: value
        }
      }
    }

    if (_.isPlainObject(value)) {
      value = simpleToAdvance(value)
    }
  })

  return structure
}

const addArraysAndPaths = (structure, draft, parentPath = false) => {
  _.each(structure, (value, key) => {
    let path = (!parentPath) ? key : `${parentPath}.${key}`

    if (_.has(value, 'ARRAY')) {
      let items = _.get(draft, path)

      _.each(items, (itemValue, itemKey) => {
        _.set(value, `${itemKey}.ORDER`, itemValue.ORDER)
        // _.set(value, `${itemKey}.DELETED`, itemValue.DELETED)

        _.each(value.ARRAY, (arrayValue, arrayKey) => {
          _.set(value, `${itemKey}.${arrayKey}`, _.cloneDeep(arrayValue))
        })
      })
    }

    if (_.isPlainObject(value) && !_.includes(['ARRAY', 'CONFIG'], key)) {
      value.PATH = path
      value = addArraysAndPaths(value, draft, path)
    }
  })

  return structure
}

const addData = (structure, draft) => {
  _.each(structure, (value, key) => {
    if (_.isPlainObject(value) && !_.includes(['ARRAY', 'CONFIG'], key)) {
      if (!_.has(value, 'NAME')) {
        value.NAME = titleCase(key)
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

        // console.log('content', value.NAME, content !== null, content !== undefined)

        if (content !== null && content !== undefined) {
          value.CONTENT = content
        } else if (_.has(value, 'DEFAULT')) {
          value.CONTENT = value.DEFAULT
        } else {
          value.CONTENT = null
        }
      }

      value = addData(value, draft)
    }
  })

  return structure
}

export default (structure, draft) => {
  structure = simpleToAdvance(structure)
  structure = addArraysAndPaths(structure, draft)
  structure = addData(structure, draft)

  return structure
}
