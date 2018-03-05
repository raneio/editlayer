const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
const fs = require('fs')
const _ = require('lodash')
const axios = require('axios')
const B2 = require('backblaze-b2')
// const path = require('path')

const b2 = new B2({
  accountId: '83a484a0ac5e',
  applicationKey: '00163b960dd3c1105cdb01d9d1892f0a1d65885d5a'
})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.publishJson = functions.firestore.document('files/{fileId}/versions/{versionId}').onCreate((event) => {
  const tempFilePath = '/tmp/tempfile.json'
  const bucket = admin.storage().bucket('editlayer')
  const versionData = event.data.data()
  const destinationFilePath = `${event.params.fileId}/${versionData.filename}.json`

  console.log('versionId', event.params.versionId)

  const jsonFileContent = _.merge(versionData.content, {
    // ASSETS_FOLDER: `https://cdn.editlayer.com/${event.params.fileId}/`,
    PUBLISHED_AT: versionData.publishedAt,
    VERSION_ID: event.params.versionId,
  })

  fs.writeFileSync(tempFilePath, JSON.stringify(jsonFileContent, null, 2))

  return bucket.upload(tempFilePath, {
    destination: destinationFilePath,
  })
  .then(() => {
    console.log('Json file publishing done')
    return true
  })
  .catch((error) => console.error('Json file publishing faild', error))

})

exports.purgeJson = functions.storage.bucket('editlayer').object().onChange((event) => {
  const object = event.data

  if (!_.startsWith(object.contentType, 'application/json')) return false

  const url = encodeURI(`https://cdn.editlayer.com/${object.name}`)

  return axios({
    method: 'POST',
    url: `https://bunnycdn.com/api/purge?url=${url}`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      AccessKey: '3af506e7-573c-4563-9b62-a3ec872ba87ca6225606-efa0-427a-baf8-45b53319d0d5',
    }
  })
  .then(() => {
    console.log('Json purge done')
    return true
  })
  .catch((error) => console.error('Json purge faild', error))

})

// exports.purgeImgix = functions.storage.bucket('editlayer').object().onChange((event) => {
//   const object = event.data
//
//   if (!_.startsWith(object.contentType, 'application/json')) {
//     return false
//   }
//
//   let filePath = object.name
//
//   return axios({
//     method: 'post',
//     url: 'https://api.imgix.com/v2/image/purger',
//     auth: {
//       username: 'tCrZGEXPaZszHhFQckWre2ubWbN2P9g5',
//       password: '',
//     },
//     data: {
//       url: `https://editlayer.imgix.net/${filePath}`,
//     },
//   })
//   .then(() => {
//     console.log('Json purge done')
//     return true
//   })
//   .catch((error) => console.error('Json purge faild', error))
//
// })

// exports.uploadFileToB2 = functions.storage.bucket('editlayer').object().onChange((event) => {
//   const bucket = admin.storage().bucket('editlayer')
//   const object = event.data
//   let filePath = object.name
//   // let filename = path.basename(filePath)
//   let authToken = null
//   let uploadUrl = null
//
//   if (object.resourceState === 'not_exists') return false
//
//   return b2.authorize()
//   .then((response) => {
//     return b2.getUploadUrl('e8737a5408146ab06a1c051e')
//   })
//   .then((response) => {
//     uploadUrl = response.data.uploadUrl
//     authToken = response.data.authorizationToken
//     return bucket.file(filePath).download()
//   })
//   .then((response) => {
//     let file = response[0]
//
//     return b2.uploadFile({
//       uploadUrl: uploadUrl,
//       uploadAuthToken: authToken,
//       filename: filePath,
//       data: file,
//     })
//   })
//   .then((response) => {
//     console.log('File uploaded to B2', response)
//     return true
//   })
//   .catch((error) => console.error('Upload file to B2 failed', error.message))
//
// })
