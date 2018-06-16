import _ from 'lodash'
import titleCase from 'title-case'

const simpleToAdvance = (structure) => {
  _.each(structure, (value, key) => {
    if (key === _.upperCase(key) || _.startsWith(key, '_')) return true

    if (_.isArray(value)) {
      structure[key] = {
        _array: value[0],
      }

      if (_.has(value[0], 'TITLE')) {
        structure[key].TITLE = value[0].TITLE
      }

      value = simpleToAdvance(value)
    }

    if (_.isString(value)) {
      structure[key] = {
        EDITOR: value,
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

    if (_.has(value, '_array')) {
      let items = _.get(draft, path)

      _.each(items, (itemValue, itemKey) => {
        _.set(value, `${itemKey}._order`, itemValue._order)

        _.each(value._array, (arrayValue, arrayKey) => {
          _.set(value, `${itemKey}.${arrayKey}`, _.cloneDeep(arrayValue))
        })
      })
    }

    if (_.isPlainObject(value) && key !== _.upperCase(key) && !_.startsWith(key, '_')) {
      value._path = path
      value = addArraysAndPaths(value, draft, path)
    }
  })

  return structure
}

const addData = (structure, draft) => {
  _.each(structure, (value, key) => {
    if (!_.isPlainObject(value) || key === _.upperCase(key) || _.startsWith(key, '_')) return true

    if (!_.has(value, 'TITLE')) {
      value.TITLE = titleCase(key)
    }

    if (_.has(value, 'EDITOR')) {
      value._type = 'value'
    }
    else if (_.has(value, '_array')) {
      value._type = 'array'
    }
    else {
      value._type = 'object'
    }

    if (_.has(value, 'EDITOR')) {
      let content = _.get(draft, value._path)

      if (content !== null && content !== undefined) {
        value._content = content
      }
      else if (_.has(value, 'DEFAULT')) {
        value._content = value.DEFAULT
      }
      else {
        value._content = null
      }
    }

    value = addData(value, draft)
  })

  return structure
}

const addStatus = (structure, draft, published) => {
  _.each(structure, (value, key) => {
    if (!_.isPlainObject(value) || key === _.upperCase(key) || _.startsWith(key, '_')) return true

    value._status = _.isEqual(_.get(draft, value._path), _.get(published, value._path)) ? 'published' : 'draft'
    value = addStatus(value, draft, published)
  })

  return structure
}

export default (structure, draft, published) => {
  structure = simpleToAdvance(structure)
  structure = addArraysAndPaths(structure, draft)
  structure = addData(structure, draft)
  structure = addStatus(structure, draft, published)

  return structure
}
