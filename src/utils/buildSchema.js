import titleCase from 'title-case'

const simpleToAdvance = (schema) => {
  _.each(schema, (value, key) => {
    if (!_.includes(['EDITOR', 'CONTENT', 'PATH', 'NAME', 'DEFAULT', 'TYPE', 'INFO'], key)) {

      if (_.isArray(value)) {
        schema[key] = {
          ARRAY: value[0],
        }

        if (_.has(value[0], 'NAME')) {
          schema[key].NAME = value[0].NAME
        }

        value = simpleToAdvance(value)
      }

      if (_.isString(value)) {
        schema[key] = {
          EDITOR: value,
        }
      }
    }

    if (_.isPlainObject(value)) {
      value = simpleToAdvance(value)
    }
  })

  return schema
}

const addArraysAndPaths = (schema, draft, parentPath = false) => {
  _.each(schema, (value, key) => {
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

    if (_.isPlainObject(value) && key !== 'ARRAY') {
      value.PATH = path
      value = addArraysAndPaths(value, draft, path)
    }
  })

  return schema
}

const addData = (schema, draft) => {
  _.each(schema, (value, key) => {
    if (_.isPlainObject(value) && key !== 'ARRAY') {

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

        if (content) {
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

  return schema
}

export default (schema, draft) => {

  schema = simpleToAdvance(schema)
  schema = addArraysAndPaths(schema, draft)
  schema = addData(schema, draft)

  return schema

}
