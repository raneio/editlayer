const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
const fs = require('fs')
const uuid = require('uuid/v4')
const _ = require('lodash')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// exports.uploadTest = functions.https.onRequest((request, response) => {
//   const bucket = admin.storage().bucket()
//   const tempFilePath = '/tmp/tempfile.json'
//
//   fs.writeFileSync(tempFilePath, '{"foo": "bar"}')
//
//   bucket.upload(tempFilePath)
//   .then(() => response.send('Upload Done'))
//   .catch(() => response.send('Upload Faild'))
//
// })

exports.publishJson = functions.firestore.document('files/{fileId}/versions/{versionId}').onCreate((event) => {
  const tempFilePath = '/tmp/tempfile.json'
  const bucket = admin.storage().bucket()
  const db = admin.firestore()
  const versionData = event.data.data()
  const jsonFileContent = JSON.stringify(versionData.content)
  const destinationFilePath = `files/${event.params.fileId}/${versionData.filename}`

  fs.writeFileSync(tempFilePath, jsonFileContent)

  bucket.upload(tempFilePath, {
    destination: destinationFilePath,
    metadata: {
      metadata: {
        firebaseStorageDownloadTokens: versionData.downloadToken,
      },
    },
  })
  .then((data) => console.log('Upload Done'))
  .catch((error) => console.error('Upload faild', error))

})
