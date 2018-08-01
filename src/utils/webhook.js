import _ from 'lodash'
import axios from 'axios'
import { Base64 } from 'js-base64'

const errorHandler = (message) => {
  console.error(message)
  console.groupEnd()
  return false
}

export default (payload) => {
  console.group('Webhook started')

  console.log('jsonUrl', payload.jsonUrl)

  let config = {}

  if (_.includes(payload.configString, '{{VERSION_ID}}')) {
    payload.configString = _.replace(payload.configString, '{{VERSION_ID}}', payload.versionId)
  }

  if (_.includes(payload.configString, '{{BASE64_CONTENT}}')) {
    let base64Content = Base64.encode(JSON.stringify(payload.json))
    payload.configString = _.replace(payload.configString, '{{BASE64_CONTENT}}', base64Content)
  }

  if (_.includes(payload.configString, '{{PUBLISHER_EMAIL}}')) {
    payload.configString = _.replace(payload.configString, '{{PUBLISHER_EMAIL}}', payload.email)
  }

  try {
    config = JSON.parse(payload.configString)
  }
  catch (e) {
    return errorHandler('Syntax error: Webhook config is not valid JSON', payload.configString)
  }

  if (!_.isString(config.url)) {
    return errorHandler('"url" is required')
  }

  if (config.method !== 'post' && config.method !== 'get') {
    return errorHandler('"method" is required and it should be "post" or "get"')
  }

  if (config.method === 'post' && _.has(config, 'params')) {
    return errorHandler('With a method "post" you should use "data" insted of "params"')
  }

  if (config.method === 'get' && _.has(config, 'data')) {
    return errorHandler('With a method "get" you should use "params" insted of "data"')
  }

  // if (config.method === 'get' && config.data && !config.params) {
  //   config.params = config.data
  //   delete config.data
  // }

  console.log('Config:')
  console.log(config)

  return axios(config)
    .then((response) => {
      console.log('Response:')
      console.log(response)
      console.groupEnd()
      return true
    })
    .catch((error) => {
      return errorHandler(error)
    })
}
