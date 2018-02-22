const basicToJson = (schema, result = {}) => {
  _.each(schema, (value, key) => {
    if (_.has(value, 'CONTENT') && _.has(value, 'PATH')) {
      _.set(result, value.PATH, value.CONTENT)
    }

    if (_.has(value, 'ORDER') && _.has(value, 'PATH')) {
      _.set(result, `${value.PATH}.ORDER`, value.ORDER)
    }

    if (_.has(value, 'DELETED') && _.has(value, 'PATH')) {
      _.set(result, `${value.PATH}.DELETED`, value.DELETED)
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
    schema = _.sortBy(schema, 'ORDER')

    _.each(schema, (value, key) => {
      if (value.DELETED !== true) {
        value = _.omit(value, ['ORDER', 'DELETED'])
        array.push(value)
      }
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
  console.log('buildJson')

  content = basicToJson(content)
  content = _.merge(content, arrayToJson(content))


  console.log('content', content)

  return content
}
