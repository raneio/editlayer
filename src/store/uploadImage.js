import _ from 'lodash'
import slugg from 'slugg'
import ImageCompressor from 'image-compressor.js'
import shortid from 'shortid'
import firebase from '@/utils/firebase'

export default {

  actions: {

    async uploadImage ({state, commit, dispatch}, payload) {
      if (!_.startsWith(payload.image.type, 'image/')) return false

      let maxWidth = payload.maxWidth ? payload.maxWidth : 800
      let maxHeight = payload.maxHeight ? payload.maxHeight : 800
      let filenameWithoutExt = slugg(payload.image.name.replace(/\.[^/.]+$/, ''))
      let randomId = shortid.generate()
      let blobUrl = URL.createObjectURL(payload.image)

      commit('setNotification', {
        id: `${payload.projectId}>${payload.path}>upload`,
        status: 'info',
        message: filenameWithoutExt,
        image: blobUrl,
        progress: 0,
      })

      let uploadImage = payload.image

      if (_.includes(['image/jpeg', 'image/png'], payload.image.type)) {
        const imageCompressor = new ImageCompressor()
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
          status: 'error',
          message: 'Max image size 5 MB, try another image.',
          image: blobUrl,
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
          status: 'error',
          message: `Unsupported file type. Send jpg, png, gif or svg.`,
        })
        console.error('Unsupported file type', uploadImage.type)
        return false
      }

      let uploadTask = firebase.storage.ref().child(`${payload.projectId}/${filename}`).put(uploadImage)

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
            .then((downloadURL) => downloadURL)
        })
        .catch((error) => console.error('Upload task faild', error))

      return {
        downloadURL: downloadURL,
        filename: filenameWithoutExt,
      }

      // let downloadURL = uploadTask.on('state_changed', (snapshot) => {
      //   let percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      //
      //   commit('setNotification', {
      //     id: `${payload.projectId}>${payload.path}>upload`,
      //     progress: percent,
      //   })
      // },
      // (error) => {
      //   commit('setNotification', {
      //     id: `${payload.projectId}>${payload.path}>upload`,
      //     status: 'error',
      //     message: 'Upload failer, try again later.',
      //   })
      //   console.error('Upload failed', error)
      // },
      // () => {
      //   uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
      //     _.delay(() => {
      //       commit('deleteNotification', `${payload.projectId}>${payload.path}>upload`)
      //     }, 1000)
      //
      //     console.log('downloadURL', downloadURL)
      //     return downloadURL
      //
      //     // dispatch('saveContent', {
      //     //   projectId: payload.projectId,
      //     //   path: _.replace(payload.path, />/g, '.'),
      //     //   content: downloadURL,
      //     // })
      //   })
      // })
    },
  },
}
