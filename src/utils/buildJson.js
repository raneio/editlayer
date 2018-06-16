import _ from 'lodash'

const basicToJson = (structure, result = {}) => {
  _.each(structure, (value, key) => {
    if (_.has(value, '_content') && _.has(value, '_path')) {
      _.set(result, value._path, value._content)
    }

    if (_.has(value, '_order') && _.has(value, '_path')) {
      _.set(result, `${value._path}._order`, value._order)
    }

    if (_.isPlainObject(value)) {
      basicToJson(value, result)
    }
  })

  return result
}

const arrayToJson = (structure, result = {}, path = false) => {
  if (_.isPlainObject(structure) && _.startsWith(_.findKey(structure), '-')) {
    let array = []
    structure = _.sortBy(structure, '_order')

    _.each(structure, (value, key) => {
      value = _.omit(value, ['_order'])
      array.push(value)
    })

    _.set(result, path, array)
  }

  _.each(structure, (value, key) => {
    if (_.isPlainObject(value)) {
      let newPath = (!path) ? key : `${path}.${key}`
      arrayToJson(value, result, newPath)
    }
  })

  return result
}

export default (content) => {
  content = basicToJson(content)
  content = _.merge(content, arrayToJson(content))

  return content
}
