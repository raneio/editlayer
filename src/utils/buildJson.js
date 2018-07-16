import _ from 'lodash'

const basicToJson = (schema, result = {}) => {
  _.each(schema, (value, key) => {
    if (_.has(value, '_content') && _.has(value, '_path')) {
      _.set(result, value._path, value._content)
    }

    if (_.has(value, '_order') && _.has(value, '_path')) {
      _.set(result, `${value._path}._order`, value._order)
      _.set(result, `${value._path}._key`, key)
    }

    if (_.isPlainObject(value)) {
      basicToJson(value, result)
    }
  })

  return result
}

const arrayToJson = (schema, result = {}, path = false) => {
  if (_.isPlainObject(schema) && _.startsWith(_.findKey(schema), '-')) {
    let array = []
    schema = _.sortBy(schema, '_order')

    _.each(schema, (value, key) => {
      value = _.omit(value, ['_order'])
      array.push(value)
    })

    _.set(result, path, array)
  }

  _.each(schema, (value, key) => {
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
