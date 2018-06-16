import Vue from 'vue'
import _ from 'lodash'
import shortid from 'shortid'

export default {

  mutations: {

    setNotification (state, payload) {
      let currentNotification = {}

      if (!payload.id) {
        payload.id = shortid.generate()
      }

      if (_.has(state.notifications, payload.id)) {
        currentNotification = _.get(state.notifications, payload.id)
      }

      let notification = _.merge(currentNotification, {
        status: payload.status,
        message: payload.message,
        link: payload.link,
        progress: payload.progress,
        image: payload.image,
        deleteTime: payload.deleteTime,
      })

      // console.log('setNotification', notification)

      Vue.set(state.notifications, payload.id, notification)
    },

    deleteNotification (state, id) {
      // console.log('deleteNotification', id)
      Vue.delete(state.notifications, id)
    },

  },

}
