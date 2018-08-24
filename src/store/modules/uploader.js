import _ from 'lodash'
import slugg from 'slugg'
import generate from 'nanoid/generate'
import firebase from '@/utils/firebase'
import { blobToDataURL } from 'blob-util'
import ImageCompressor from 'image-compressor.js'

const imageCompressor = new ImageCompressor()

export default {

  actions: {

    // TODO: Move this function to utils folder
    async uploadImage ({commit, dispatch}, payload) {
      if (!_.startsWith(payload.image.type, 'image/')) return false
      let filenameWithoutExt = slugg(payload.image.name.replace(/\.[^/.]+$/, ''))
      let randomId = generate('abcdefghijklmnopqrstuvwxyz', 4)

      let maxWidth = 960
      let maxHeight = 960

      if (_.isNumber(payload.downscale)) {
        maxWidth = payload.downscale
        maxHeight = payload.downscale
      }

      if (_.isPlainObject(payload.downscale) && _.isNumber(payload.downscale.width)) {
        maxWidth = payload.downscale.width
      }

      if (_.isPlainObject(payload.downscale) && _.isNumber(payload.downscale.height)) {
        maxHeight = payload.downscale.height
      }

      commit('setNotification', {
        id: `${payload.projectId}>${payload.path}>upload`,
        mode: 'info',
        message: filenameWithoutExt,
      })

      let uploadImage = payload.image

      if (_.includes(['image/jpeg', 'image/png'], payload.image.type)) {
        let optimizedImage = await imageCompressor.compress(payload.image, {
          quality: 0.8,
          convertSize: 1000000,
          maxWidth: maxWidth,
          maxHeight: maxHeight,
        })
          .then((result) => {
            return result
          })
          .catch((error) => console.error('Image optimize failed', error.message))

        uploadImage = optimizedImage
      }

      if (uploadImage.size > 5 * 1024 * 1024) {
        commit('setNotification', {
          id: `${payload.projectId}>${payload.path}>upload`,
          mode: 'danger',
          message: 'Max image size 5 MB, try another image.',
        })

        console.error('Max image size 5 MB, try another image.')
        return false
      }

      let filename = `${filenameWithoutExt}-${randomId}`

      if (uploadImage.type === 'image/jpeg') {
        filename = `${filename}.jpg`
      }
      else if (uploadImage.type === 'image/png') {
        filename = `${filename}.png`
      }
      else if (uploadImage.type === 'image/gif') {
        filename = `${filename}.gif`
      }
      else if (uploadImage.type === 'image/svg+xml') {
        filename = `${filename}.svg`
      }
      else {
        commit('setNotification', {
          id: `${payload.projectId}>${payload.path}>upload`,
          mode: 'danger',
          message: `Unsupported file type. Send jpg, png, gif or svg.`,
        })
        console.error('Unsupported file type', uploadImage.type)
        return false
      }

      // TODO: Move this to storage.js
      let uploadTask = firebase.storage
        .ref()
        .child(`${payload.projectId}/${filename}`)
        .put(uploadImage)

      uploadTask.on('state_changed', (snapshot) => {
        commit('setNotification', {
          id: `${payload.projectId}>${payload.path}>upload`,
          progress: snapshot.bytesTransferred / snapshot.totalBytes * 100,
        })
      })

      let downloadURL = await uploadTask
        .then((data) => {
          return uploadTask
            .snapshot
            .ref
            .getDownloadURL()
            .then(downloadURL => downloadURL)
        })
        .catch((error) => console.error('Upload task faild', error))

      let thumbnail = null

      if (payload.projectId && payload.path && downloadURL) {
        if (_.includes(['image/jpeg', 'image/png', 'image/gif'], payload.image.type)) {
          const thumbnailBlob = await imageCompressor.compress(payload.image, {
            quality: 0.2,
            convertSize: 0,
            maxWidth: 64,
            maxHeight: 64,
          })
            .catch((error) => console.error('Image optimize failed', error.message))

          thumbnail = await blobToDataURL(thumbnailBlob)
            .catch((error) => console.error('Blob to base64 failed', error))
        }

        let img = new Image()
        img.src = URL.createObjectURL(uploadImage)
        img.onload = () => {
          dispatch('updateContent', {
            projectId: payload.projectId,
            path: payload.path,
            content: {
              url: downloadURL,
              height: img.height,
              width: img.width,
              size: uploadImage.size,
              type: uploadImage.type,
              thumbnail: thumbnail,
            },
          })
        }
      }

      return {
        downloadURL: downloadURL,
        filename: filenameWithoutExt,
        projectId: payload.projectId,
        path: payload.path,
        size: uploadImage.size,
        type: uploadImage.type,
        thumbnail: thumbnail,
      }
    },
  },
}
