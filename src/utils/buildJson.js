import _ from 'lodash'

const basicToJson = (structure, result = {}) => {
  _.each(structure, (value, key) => {
    if (_.has(value, 'CONTENT') && _.has(value, 'PATH')) {
      _.set(result, value.PATH, value.CONTENT)
    }

    if (_.has(value, 'ORDER') && _.has(value, 'PATH')) {
      _.set(result, `${value.PATH}.ORDER`, value.ORDER)
    }

    // if (_.has(value, 'DELETED') && _.has(value, 'PATH')) {
    //   _.set(result, `${value.PATH}.DELETED`, value.DELETED)
    // }

    if (_.isPlainObject(value)) {
      basicToJson(value, result)
    }
  })

  return result
}

const arrayToJson = (structure, result = {}, path = false) => {
  if (_.isPlainObject(structure) && _.startsWith(_.findKey(structure), '-')) {
    let array = []
    structure = _.sortBy(structure, 'ORDER')

    _.each(structure, (value, key) => {
      value = _.omit(value, ['ORDER'])
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
  console.log('buildJson')

  content = basicToJson(content)
  content = _.merge(content, arrayToJson(content))

  console.log('content', content)

  return content
}
