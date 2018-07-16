import _ from 'lodash'
import titleCase from 'title-case'
import isUpperCase from 'is-upper-case'

const parseSimpleSyntax = (source, schema = {}, parentPath = false) => {
  _.each(source, (value, key) => {
    if (isUpperCase(key) || _.startsWith(key, '_')) return true
    let path = parentPath ? `${parentPath}.${key}` : key
    let item = {}

    if (_.isString(value)) {
      item.EDITOR = value

      // Shorten syntax with mode "input:email"
      if (_.includes(value, ':')) {
        item.EDITOR = value.split(':')[0].trim()
        item.MODE = value.split(':')[1].trim()
      }

      // Shorten syntax with options "radio[one,two,three]"
      if (_.includes(value, '[') && _.includes(value, ']')) {
        item.EDITOR = value.split('[')[0].trim()
        item.OPTIONS = []

        let options = value.match(/\[(.*?)\]/)[1].split(',')

        _.each(options, option => {
          item.OPTIONS.push({
            value: option.trim(),
          })
        })
      }
    }
    else {
      item = value
    }

    _.set(schema, path, item)

    if (_.isObject(value)) {
      schema = parseSimpleSyntax(value, schema, path)
    }
  })

  return schema
}

const addArrayItems = (structure, source, draft, parentPath = false) => {
  _.each(source, (value, key) => {
    if (isUpperCase(key) || _.startsWith(key, '_')) return true
    let path = parentPath ? `${parentPath}.${key}` : key

    if (_.isArray(value) && _.isArray(_.get(structure, path))) {
      let schema = value[0]
      let draftItems = _.get(_.cloneDeep(draft), path)
      let arrayItems = {
        _type: 'array',
      }

      if (!_.isPlainObject(draftItems)) {
        draftItems = null
      }

      _.each(draftItems, (draftValue, draftKey) => {
        _.set(arrayItems, draftKey, draftValue)

        _.each(schema, (schemaValue, schemaKey) => {
          _.set(arrayItems, `${draftKey}.${schemaKey}`, schemaValue)
        })
      })

      _.set(structure, path, arrayItems)

      // Recheck if child arrays
      structure = addArrayItems(structure, source, draft, parentPath)
    }

    if (_.isObject(value)) {
      structure = addArrayItems(structure, value, draft, path)
    }
  })

  return structure
}

const addPaths = (structure, source, parentPath = false) => {
  _.each(source, (value, key) => {
    if (isUpperCase(key) || _.startsWith(key, '_')) return true
    let path = parentPath ? `${parentPath}.${key}` : key

    if (_.isPlainObject(value)) {
      let item = {
        ...value,
        _path: path,
      }

      _.set(structure, path, item)
    }

    if (_.isObject(value)) {
      structure = addPaths(structure, value, path)
    }
  })

  return structure
}

const addContent = (structure, source, draft, parentPath = false) => {
  _.each(source, (value, key) => {
    if (isUpperCase(key) || _.startsWith(key, '_')) return true
    let path = parentPath ? `${parentPath}.${key}` : key

    if (_.has(value, 'EDITOR')) {
      let content = _.get(_.cloneDeep(draft), path)

      if (content === undefined) {
        content = value.DEFAULT || null
      }

      _.set(structure, `${path}._content`, content)
    }

    if (_.isObject(value)) {
      structure = addContent(structure, value, draft, path)
    }
  })

  return structure
}

const checkIf = (structure, source, draft, parentPath = false) => {
  _.each(source, (value, key) => {
    if (isUpperCase(key) || _.startsWith(key, '_')) return true
    let path = parentPath ? `${parentPath}.${key}` : key

    if (_.has(value, 'IF') && _.startsWith(value.IF, '@')) {
      let ifPath = value.IF.split('=')[0].replace('@', '').trim()
      let sisterPath = _.chain(path).split('.').slice(0, -1).push(ifPath).join('.').value()
      let draftValue = null
      let condition = value.IF.split('=')[1].trim().split('|')

      if (_.has(structure, sisterPath)) {
        draftValue = _.get(_.cloneDeep(draft), sisterPath)
      }
      else if (_.has(structure, ifPath)) {
        draftValue = _.get(_.cloneDeep(draft), ifPath)
      }

      if (draftValue && !_.includes(condition, draftValue)) {
        delete source[key]
      }
    }

    if (_.isObject(value)) {
      structure = checkIf(structure, value, draft, path)
    }
  })

  return structure
}

const addType = (structure, source, parentPath = false) => {
  _.each(source, (value, key) => {
    if (isUpperCase(key) || _.startsWith(key, '_')) return true
    let path = parentPath ? `${parentPath}.${key}` : key

    if (_.isPlainObject(value) && !_.has(value, '_type')) {
      let type = _.has(value, 'EDITOR') ? 'item' : 'object'

      _.set(structure, `${path}._type`, type)
    }

    if (_.isObject(value)) {
      structure = addType(structure, value, path)
    }
  })

  return structure
}

const addTitle = (structure, source, parentPath = false) => {
  _.each(source, (value, key) => {
    if (isUpperCase(key) || _.startsWith(key, '_')) return true
    let path = parentPath ? `${parentPath}.${key}` : key

    if (_.isPlainObject(value) && !_.has(value, 'TITLE')) {
      let title = titleCase(key)

      _.set(structure, `${path}.TITLE`, title)
    }

    if (_.isObject(value)) {
      structure = addTitle(structure, value, path)
    }
  })

  return structure
}

const getValueFromPath = (structure, source, draft, parentPath = false) => {
  _.each(source, (value, key) => {
    let path = parentPath ? `${parentPath}.${key}` : key

    if (_.isString(value) && _.startsWith(value, '@') && key !== 'IF') {
      let sisterLevel = source._type === 'item' ? -2 : -1
      let valuePath = value.replace('@', '').trim()
      let sisterPath = _.chain(path).split('.').slice(0, sisterLevel).push(valuePath).join('.').value()
      let draftValue = null

      if (_.has(structure, sisterPath) && valuePath !== source._path.split('.').pop()) {
        draftValue = _.get(_.cloneDeep(draft), sisterPath)
      }
      else if (_.has(structure, valuePath)) {
        draftValue = _.get(_.cloneDeep(draft), valuePath)
      }

      if (draftValue) {
        _.set(structure, `${path}`, draftValue)
      }
    }

    if (_.isObject(value)) {
      structure = getValueFromPath(structure, value, draft, path)
    }
  })

  return structure
}

const addStatus = (structure, source, draft, published, parentPath = false) => {
  _.each(source, (value, key) => {
    if (isUpperCase(key) || _.startsWith(key, '_')) return true
    let path = parentPath ? `${parentPath}.${key}` : key

    if (_.isPlainObject(value)) {
      let status = _.isEqual(_.get(_.cloneDeep(draft), value._path), _.get(_.cloneDeep(published), value._path)) ? 'published' : 'draft'

      _.set(structure, `${path}._status`, status)
    }

    if (_.isObject(value)) {
      structure = addStatus(structure, value, draft, published, path)
    }
  })

  return structure
}

export default (rawSchema, draft, published) => {
  // TODO: Change Each to filter, map, reduce
  const schema = parseSimpleSyntax(rawSchema)

  let structure = schema
  addArrayItems(structure, structure, draft)
  addPaths(structure, structure)
  addContent(structure, structure, draft)
  checkIf(structure, structure, draft)
  addType(structure, structure)
  addTitle(structure, structure)
  getValueFromPath(structure, structure, draft)
  addStatus(structure, structure, draft, published)

  return structure
}

// const setTemplates = (schema, template) => {
//   if (!template) return schema
//
//   _.each(schema, (value, key) => {
//     if (key !== 'GET' && _.startsWith(value, '@TEMPLATE.')) {
//       let path = value.replace('@TEMPLATE.', '')
//       let templateValue = _.get(template, path)
//       schema[key] = templateValue
//     }
//
//     if (value && _.startsWith(value.GET, '@TEMPLATE.')) {
//       let path = value.GET.replace('@TEMPLATE.', '')
//       let templateObject = _.get(template, path)
//       schema[key] = _.merge(templateObject, value)
//     }
//
//     if (_.isObject(value)) {
//       value = setTemplates(value, template)
//     }
//   })
//
//   return schema
// }
//
// const simpleToAdvance = (structure, schema) => {
//   _.each(schema, (value, key) => {
//     if (isUpperCase(key) || _.startsWith(key, '_')) return true
//
//     if (_.isString(value)) {
//       schemaValue = {
//         EDITOR: value,
//       }
//
//       // Shorten syntax with mode "input:email"
//       if (_.includes(value, ':')) {
//         schemaValue.EDITOR = value.split(':')[0].trim()
//         schemaValue.MODE = value.split(':')[1].trim()
//       }
//
//       // Shorten syntax with options "radio[one,two,three]"
//       if (_.includes(value, '[') && _.includes(value, ']')) {
//         schemaValue.EDITOR = value.split('[')[0].trim()
//         schemaValue.OPTIONS = []
//
//         let options = value.match(/\[(.*?)\]/)[1].split(',')
//
//         _.each(options, option => {
//           schemaValue.OPTIONS.push({
//             value: option.trim(),
//           })
//         })
//       }
//     }
//
//     if (_.isObject(value)) {
//       schemaValue = simpleToAdvance(schemaValue)
//     }
//   })
//
//   return schema
// }

// const addArrays = (schema, draft, parentPath = false) => {
//   _.each(schema, (schemaValue, key) => {
//     if (isUpperCase(key) || _.startsWith(key, '_')) return true
//     const value = _.cloneDeep(schemaValue)
//
//     let path = (!parentPath) ? key : `${parentPath}.${key}`
//
//     if (_.isArray(value)) {
//       schemaValue = {
//         _type: 'array',
//       }
//
//       let itemsFromDraft = _.get(draft, path)
//
//       _.each(itemsFromDraft, (valueFromDraft, keyFromDraft) => {
//         _.each(value, (arrayValue, arrayKey) => {
//           schemaValue[keyFromDraft] = arrayValue
//           // _.set(schema[key], keyFromDraft, arrayValue)
//         })
//       })
//
//       // addPaths(schema)
//
//       // if (_.has(value[0], 'TITLE')) {
//       //   schema[key].TITLE = value[0].TITLE
//       // }
//
//       // schema[key] = {
//       //   _array: value[0],
//       // }
//
//       // schema[key] = {
//       //   _type: 'array',
//       //   ...items,
//       // }
//
//       // console.log('schema', schema)
//
//       // let itemsFromDraft = _.get(draft, value._path)
//       //
//       // _.each(itemsFromDraft, (valueFromDraft, keyFromDraft) => {
//       //   _.set(schema[key], `${keyFromDraft}._order`, valueFromDraft._order)
//       //
//       //   _.each(value, (arrayValue, arrayKey) => {
//       //     _.set(schema[key], `${keyFromDraft}.${arrayKey}`, _.cloneDeep(arrayValue))
//       //   })
//       // })
//     }
//
//     if (_.isObject(value)) {
//       schemaValue = addArrays(value, draft, path)
//     }
//   })
//
//   return schema
// }
//
// const addPaths = (schema, parentPath = false) => {
//   _.each(schema, (schemaValue, key) => {
//     if (isUpperCase(key) || _.startsWith(key, '_')) return true
//     const value = _.cloneDeep(schemaValue)
//
//     let path = parentPath ? `${parentPath}.${key}` : key
//     if (_.isPlainObject(value)) {
//       schemaValue._path = 'foo' + path
//       // value._path = path
//     }
//
//     if (_.isObject(value)) {
//       schemaValue = addPaths(value, path)
//     }
//   })
//
//   return schema
// }
//
// // const addPaths = (schema, parentPath = false) => {
// //   _.each(schema, (value, key) => {
// //     if (isUpperCase(key) || _.startsWith(key, '_')) return true
// //     let path = (!parentPath) ? key : `${parentPath}.${key}`
// //     console.log('path', path)
// //     schema[key]._path = _.cloneDeep(path)
// //     console.log('schema[key]._path', schema[key]._path)
// //
// //     if (_.isObject(value)) {
// //       value = addPaths(value, path)
// //     }
// //   })
// //
// //   return schema
// // }
//
// // const addArraysAndPaths = (schema, draft, parentPath = false) => {
// //   _.each(schema, (value, key) => {
// //     let path = (!parentPath) ? key : `${parentPath}.${key}`
// //
// //     if (_.has(value, '_array')) {
// //       let items = _.get(draft, path)
// //
// //       _.each(items, (itemValue, itemKey) => {
// //         _.set(value, `${itemKey}._order`, itemValue._order)
// //
// //         _.each(value._array, (arrayValue, arrayKey) => {
// //           _.set(value, `${itemKey}.${arrayKey}`, _.cloneDeep(arrayValue))
// //         })
// //       })
// //     }
// //
// //     if (_.isPlainObject(value) && key !== _.upperCase(key) && !_.startsWith(key, '_')) {
// //       value._path = path
// //       value = addArraysAndPaths(value, draft, path)
// //     }
// //   })
// //
// //   return schema
// // }
//
// const addData = (schema, draft) => {
//   _.each(schema, (value, key) => {
//     if (!_.isPlainObject(value) || key === _.upperCase(key) || _.startsWith(key, '_')) return true
//
//     if (!_.has(value, 'TITLE')) {
//       value.TITLE = titleCase(key)
//     }
//
//     if (_.has(value, 'EDITOR')) {
//       value._type = 'item'
//     }
//     // else if (_.has(value, '_array')) {
//     //   value._type = 'array'
//     // }
//     else if (!value._type) {
//       value._type = 'object'
//     }
//
//     if (_.has(value, 'EDITOR')) {
//       let content = _.get(draft, value._path)
//
//       if (content !== null && content !== undefined) {
//         value._content = content
//       }
//       else if (_.has(value, 'DEFAULT')) {
//         value._content = value.DEFAULT
//       }
//       else {
//         value._content = null
//       }
//     }
//
//     // OPTIONS item require value data
//     if (_.has(value, 'OPTIONS') && _.isArray(value.OPTIONS)) {
//       _.each(value.OPTIONS, (option, index) => {
//         if (!_.has(option, 'value')) {
//           value.OPTIONS[index].value = null
//         }
//       })
//     }
//
//     value = addData(value, draft)
//   })
//
//   return schema
// }
//
// const removeIfNot = (schema) => {
//   _.each(schema, (value, key) => {
//     if (_.has(value, 'IF')) {
//       let path = value.IF.split('=')[0].trim().replace('@', '')
//       let content = _.get(schema, `${path}._content`)
//       let condition = value.IF.split('=')[1].trim()
//
//       if (_.includes(condition, '|')) {
//         condition = condition.split('|')
//       }
//
//       if ((_.isString(condition) && condition !== content) || (_.isArray(condition) && !_.includes(condition, content))) {
//         delete schema[key]
//       }
//     }
//
//     if (_.isObject(value)) {
//       value = removeIfNot(value)
//     }
//   })
//
//   return schema
// }
//
// const getDataFromPath = (schema, draft) => {
//   _.each(schema, (value, key) => {
//     if (_.startsWith(value, '@TEMPLATE.')) return true
//
//     if (key !== 'GET' && key !== 'IF' && _.startsWith(value, '@')) {
//       let path = value.replace('@', '')
//       let draftValue = _.has(schema, `${path}.`) ? _.get(schema, `${path}._content`) : _.get(draft, path)
//       schema[key] = draftValue
//     }
//
//     if (_.isObject(value)) {
//       value = getDataFromPath(value, draft)
//     }
//   })
//
//   return schema
// }
//
// const addStatus = (schema, draft, published) => {
//   _.each(schema, (value, key) => {
//     if (!_.isPlainObject(value) || key === _.upperCase(key) || _.startsWith(key, '_')) return true
//
//     value._status = _.isEqual(_.get(draft, value._path), _.get(published, value._path)) ? 'published' : 'draft'
//     value = addStatus(value, draft, published)
//   })
//
//   return schema
// }

// const removeUnusedDraftValues = (draft, source, schema, parentPath = false) => {
//   _.each(source, (value, key) => {
//     let path = parentPath ? `${parentPath}.${key}` : key
//
//     if (!_.has(schema, path)) {
//       draft = _.omit(draft, path)
//     }
//
//     if (_.isObject(value)) {
//       draft = removeUnusedDraftValues(draft, value, schema, path)
//     }
//   })
//
//   return draft
// }
