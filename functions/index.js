const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
const fs = require('fs')
const _ = require('lodash')
const axios = require('axios')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.publishJson = functions.firestore.document('files/{fileId}/versions/{versionId}').onCreate((event) => {
  const tempFilePath = '/tmp/tempfile.json'
  const bucket = admin.storage().bucket()
  const db = admin.firestore()
  const versionData = event.data.data()
  const destinationFilePath = `imgix/${event.params.fileId}/${versionData.filename}.json`

  const jsonFileContent = _.merge(versionData.content, {
    PUBLISHED_AT: versionData.publishedAt,
  })

  fs.writeFileSync(tempFilePath, JSON.stringify(jsonFileContent))

  bucket.upload(tempFilePath, {
    destination: destinationFilePath,
    // metadata: {
    //   metadata: {
    //     firebaseStorageDownloadTokens: versionData.downloadToken,
    //   },
    // },
  })
  .then((data) => console.log('Publishing done'))
  .catch((error) => console.error('Publishing faild', error))

  // axios({
  //   method: 'post',
  //   url: 'https://api.imgix.com/v2/image/purger',
  //   auth: {
  //     username: 'jRj2WRDWN5ED3TkdGJUEHFfUMHhjbA8j',
  //     password: '',
  //   },
  //   data: {
  //     url: `https://editlayer.imgix.net/${event.params.fileId}/${versionData.filename}.json`,
  //   },
  // })
  // .then((response) => console.log('Imgix purge done', response))
  // .catch((error) => console.error('Imgix purge faild', error))

})
