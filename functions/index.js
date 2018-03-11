const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
const fs = require('fs')
const _ = require('lodash')
const axios = require('axios')
const uuid = require('uuid/v4')
const sha1 = require('node-sha1')
// const B2 = require('backblaze-b2')
// const path = require('path')
// const cors = require('cors')({origin: true})
const bucketName = 'editlayerapp.appspot.com'

// const b2 = new B2({
//   accountId: '83a484a0ac5e',
//   applicationKey: '00163b960dd3c1105cdb01d9d1892f0a1d65885d5a'
// })

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// const purgeJson = (versionId, url, tries = 0) => {
//   const uncodedUrl = encodeURI(url)
//
//   console.log('try', tries)
//
//   if (tries > 10) {
//     return false
//   }
//
//   return axios({
//     method: 'POST',
//     url: `https://bunnycdn.com/api/purge?url=${uncodedUrl}`,
//     headers: {
//       'Content-Type': 'application/json',
//       Accept: 'application/json',
//       AccessKey: '3af506e7-573c-4563-9b62-a3ec872ba87ca6225606-efa0-427a-baf8-45b53319d0d5',
//     }
//   })
//   .then(() => {
//     console.log('Json purge done', url)
//     return axios({
//       method: 'GET',
//       url: url,
//       responseType: 'json',
//     })
//   })
//   .then((response) => {
//     console.log('Json get done', response.data)
//
//     if (response.data.VERSION_ID !== versionId) {
//       console.log('versions', response.data.versionId, versionId)
//       return _.delay(() => {
//         return purgeJson(versionId, url, tries + 1)
//       }, 3000)
//     }
//
//     return true
//
//   })
//   .catch((error) => console.error('Json purge failed', error))
//
// }

exports.uploadJson = functions.firestore.document('projects/{projectId}/versions/{versionId}').onCreate((event) => {
  const tempFilePath = '/tmp/tempfile.json'
  const bucket = admin.storage().bucket(bucketName)
  const versionData = event.data.data()
  const destinationPath = `${event.params.projectId}/${versionData.filename}.json`

  console.log('Upload JSON with versionId', event.params.versionId)

  const jsonFileContent = _.merge(versionData.content, {
    PUBLISHED_AT: versionData.publishedAt,
    VERSION_ID: event.params.versionId,
  })

  fs.writeFileSync(tempFilePath, JSON.stringify(jsonFileContent, null, 2))

  return bucket
    .upload(tempFilePath, { destination: destinationPath })
    .then(() => {
      console.log('JSON upload done')
      const cdnUrl = encodeURI(`https://cdn.editlayer.com/${destinationPath}`)
      const purgeSettings = {
        method: 'POST',
        url: `https://bunnycdn.com/api/purge?url=${cdnUrl}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          AccessKey: '3af506e7-573c-4563-9b62-a3ec872ba87ca6225606-efa0-427a-baf8-45b53319d0d5',
        }
      }

      axios(purgeSettings)

      _.delay(() => {
        axios(purgeSettings)
      }, 4000)

      axios(purgeSettings)
      _.delay(() => {
        axios(purgeSettings)
      }, 8000)

      return true
    })
    .then(() => {
      console.log('JSON publishing done')
      return true
    })
    .catch((error) => console.error('JSON upload failed', error))

})

exports.attachRole = functions.firestore.document('projects/{projectId}/permissionJobs/{permissionId}').onCreate((event) => {
  const firestore = admin.firestore()
  const storeData = event.data.data()

  return firestore
    .collection('users')
    .where('email', '==', storeData.email)
    .get()
    .then(querySnapshot => {
      let userExist = (querySnapshot.size === 1) ? true : false
      let updateData = {}

      if (userExist) {
        let doc = querySnapshot.docs[0]
        let userId = doc.id
        // let userData = doc.data()

        if (storeData.role === false) {
          updateData[`roles.${userId}`] = admin.firestore.FieldValue.delete()
        } else {
          updateData[`roles.${userId}`] = {
            role: storeData.role,
            email: storeData.email,
            userExist: true,
          }
        }

      }
      else if (!userExist) {
        const emailSha1 = sha1(storeData.email)

        updateData[`roles.${emailSha1}`] = {
          role: storeData.role,
          email: storeData.email,
          userExist: false,
        }

      }

      return firestore
        .collection('projects')
        .doc(event.params.projectId)
        .update(updateData)

    })
    .catch(error => {
      console.log('Role attach failed', error)
      return false
    })
})

// exports.attachRolesWhenRegister = functions.https.onRequest((request, response) => {
exports.attachRolesAfterRegister = functions.auth.user().onCreate((event) => {
  const firestore = admin.firestore()

  console.log('userEventId', event.data.uid)
  console.log('userEventData', event.data)

  const user = event.data
  // const user = {
  //   id: 'foobar',
  //   email: 'boo@example.com',
  // }


  const emailSha1 = sha1(user.email)

  return firestore
    .collection('projects')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach((doc) => {

        if (_.has(doc.data().roles, emailSha1)) {
          console.log('email', doc.data().roles[emailSha1])
          let permissionData = doc.data().roles[emailSha1]

          let updateData = {}

          updateData[`roles.${user.uid}`] = {
            role: permissionData.role,
            email: user.email,
            userExist: true,
          }

          updateData[`roles.${emailSha1}`] = admin.firestore.FieldValue.delete()

          firestore
            .collection('projects')
            .doc(doc.id)
            .update(updateData)

        } else {
          console.log('no email', doc.id, emailSha1)
        }

        return true
      })
      console.log('Role attach when register SUCCESS')
      // response.send('Role attach when register SUCCESS')
      return true
    })
    .catch(error => {
      console.log('Role attach when register failed', error)
      // response.send('Role attach when register failed')
      return false
    })

})

// exports.attachRoleWhenLogin

// exports.purge = functions.https.onRequest((request, response) => {
//
//   if (!_.has(request.query, 'file')) {
//     response.send('Purge need "file" attribute.')
//     return false
//   }
//
//   if (!_.endsWith(request.query.file, '.json')) {
//     response.send(`You can purge only JSON files, not "${request.query.file}".`)
//     return false
//   }
//
//   const cdnUrl = encodeURI(`https://cdn.editlayer.com/${request.query.file}`)
//
//   axios({
//     method: 'POST',
//     url: `https://bunnycdn.com/api/purge?url=${cdnUrl}`,
//     headers: {
//       'Content-Type': 'application/json',
//       Accept: 'application/json',
//       AccessKey: '3af506e7-573c-4563-9b62-a3ec872ba87ca6225606-efa0-427a-baf8-45b53319d0d5',
//     }
//   })
//   .then((res) => {
//     console.log('Json purge done')
//     response.send('OK')
//     return true
//   })
//   .catch((error) => console.error('Json purge failed', error))
//
//   return true
//
// })


// exports.purgeJson = functions.storage.bucket(bucketName).object().onChange((event) => {
//   const bucket = admin.storage().bucket(bucketName)
//   const object = event.data
//   if (!_.startsWith(object.contentType, 'application/json')) return false
//
//   console.log('purgeJson started')
//
//   const cdnUrl = encodeURI(`https://cdn.editlayer.com/${object.name}`)
//
//   return bucket.file(object.name).download()
//     .then((response) => {
//       let file = response[0]
//       console.log('file', file.toString('utf8'))
//
//       return axios({
//         method: 'POST',
//         url: `https://bunnycdn.com/api/purge?url=${cdnUrl}`,
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//           AccessKey: '3af506e7-573c-4563-9b62-a3ec872ba87ca6225606-efa0-427a-baf8-45b53319d0d5',
//         }
//       })
//     })
//     .then(() => {
//       console.log('Json purge done')
//       return true
//     })
//     .catch((error) => console.error('Json purge failed', error))
//
// })

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
