import _ from 'lodash'
import titleCase from 'title-case'

const simpleToAdvance = (schema) => {
  _.each(schema, (value, key) => {
    if (key === _.upperCase(key) || _.startsWith(key, '_')) return true

    if (_.isArray(value)) {
      schema[key] = {
        _array: value[0],
      }

      if (_.has(value[0], 'TITLE')) {
        schema[key].TITLE = value[0].TITLE
      }

      value = simpleToAdvance(value)
    }

    if (_.isString(value)) {
      schema[key] = {
        EDITOR: value,
      }

      // Shorten syntax with options "radio[one,two,three]"
      if (_.includes(value, '[') && _.includes(value, ']')) {
        schema[key].EDITOR = value.split('[')[0].trim()
        schema[key].OPTIONS = []

        let options = value.match(/\[(.*?)\]/)[1].split(',')

        _.each(options, option => {
          schema[key].OPTIONS.push({
            VALUE: option.trim(),
          })
        })
      }

      // Shorten syntax with mode "input:email"
      if (_.includes(value, ':')) {
        schema[key].EDITOR = value.split(':')[0].trim()
        schema[key].MODE = value.split(':')[1].trim()
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

  return schema
}

const addData = (schema, draft) => {
  _.each(schema, (value, key) => {
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

    // OPTIONS item require VALUE data
    if (_.has(value, 'OPTIONS')) {
      _.each(value.OPTIONS, (option, index) => {
        if (!_.has(option, 'VALUE')) {
          value.OPTIONS[index].VALUE = null
        }
      })
    }

    value = addData(value, draft)
  })

  return schema
}

const addStatus = (schema, draft, published) => {
  _.each(schema, (value, key) => {
    if (!_.isPlainObject(value) || key === _.upperCase(key) || _.startsWith(key, '_')) return true

    value._status = _.isEqual(_.get(draft, value._path), _.get(published, value._path)) ? 'published' : 'draft'
    value = addStatus(value, draft, published)
  })

  return schema
}

export default (schema, draft, published) => {
  schema = simpleToAdvance(schema)
  schema = addArraysAndPaths(schema, draft)
  schema = addData(schema, draft)
  schema = addStatus(schema, draft, published)

  return schema
}
