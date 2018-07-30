import _ from 'lodash'
import axios from 'axios'
import { Base64 } from 'js-base64'

const errorHandler = (message) => {
  console.error(message)
  console.groupEnd()
  return false
}

export default (configString, jsonUrl, email) => {
  console.group('Webhook started')

  console.log('jsonUrl', jsonUrl)

  return axios.get(jsonUrl)
    .then((response) => {
      let publishedContent = response.data
      let config = {}

      if (_.includes(configString, '{{VERSION_ID}}')) {
        configString = _.replace(configString, '{{VERSION_ID}}', publishedContent.VERSION_ID)
      }

      if (_.includes(configString, '{{BASE64_CONTENT}}')) {
        let base64Content = Base64.encode(JSON.stringify(publishedContent))
        configString = _.replace(configString, '{{BASE64_CONTENT}}', base64Content)
      }

      if (_.includes(configString, '{{PUBLISHER_EMAIL}}')) {
        configString = _.replace(configString, '{{PUBLISHER_EMAIL}}', email)
      }

      try {
        config = JSON.parse(configString)
      }
      catch (e) {
        return errorHandler('Syntax error: Webhook config is not valid JSON', configString)
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
    })
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
