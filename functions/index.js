const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
const fs = require('fs')
const _ = require('lodash')
const axios = require('axios')
const sha1 = require('node-sha1')
const url = require('url')
const validator = require('validator')

const firestore = admin.firestore()
const bucket = admin.storage().bucket('editlayerapp.appspot.com')
const bunnyCdnHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  AccessKey: '3af506e7-573c-4563-9b62-a3ec872ba87ca6225606-efa0-427a-baf8-45b53319d0d5',
}


exports.publishJson = functions.firestore.document('projects/{projectId}/versions/{versionId}').onCreate((event) => {
  const tempFilePath = '/tmp/tempfile.json'
  // const bucket = admin.storage().bucket(bucketName)
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
      const cdnUrl = encodeURI(`https://cdn.editlayer.com/${destinationPath}`)

      return axios({
        method: 'POST',
        url: `https://bunnycdn.com/api/purge?url=${cdnUrl}`,
        headers: bunnyCdnHeaders,
      })
    })
    .then(() => {
      console.log('JSON publishing done')
    //   if (!_.has(versionData, 'trigger.method') || !_.has(versionData, 'trigger.url')) return false
    //   if (!_.isString(versionData.trigger.url) || !validator.isURL(versionData.trigger.url)) return false
    //
    //   let urlWithoutParams = versionData.trigger.url.split('?').shift()
    //   let urlParts = url.parse(versionData.trigger.url, true)
    //   let params = urlParts.query
    //   params.PUBLISHED_AT = versionData.publishedAt
    //   params.VERSION_ID = event.params.versionId
    //   params.CONTENT_JSON = JSON.stringify(jsonFileContent, null, 2)
    //
    //   console.log('Trigger', versionData.trigger.method, urlWithoutParams, params)
    //
    //   return axios({
    //     method: versionData.trigger.method,
    //     url: urlWithoutParams,
    //     params: params,
    //   })
    // })
    // .then((response) => {
    //   if (response === false) return true
    //
    //   console.log('Triggered done', response.data)
      return true
    })
    .catch((error) => console.error('JSON publishing failed', error.message))

})

exports.attachRole = functions.firestore.document('projects/{projectId}/permissionJobs/{permissionId}').onCreate((event) => {
  // const firestore = admin.firestore()
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
  // const firestore = admin.firestore()

  console.log('userEventId', event.data.uid)
  console.log('userEventData', event.data)

  const user = event.data
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


exports.deleteProject = functions.firestore.document('projects/{projectId}/deleteJobs/{permissionId}').onCreate((event) => {
  const storeData = event.data.data()

  if (storeData.deleteProjectId !== event.params.projectId) return false

  return bucket
    .getFiles({ prefix: event.params.projectId })
    .then((result) => {
      let files = result[0]

      files.forEach((file) => {
        console.log('file', file.name)

        bucket.file(file.name).delete()

        let cdnUrl = encodeURI(`https://cdn.editlayer.com/${file.name}`)
        axios({
          method: 'POST',
          url: `https://bunnycdn.com/api/purge?url=${cdnUrl}`,
          headers: bunnyCdnHeaders
        })

      })

      return true
    })
    .then(() => {
      return firestore
        .collection('projects')
        .doc(event.params.projectId)
        .collection('versions')
        .get()
    })
    .then((versions) => {
      versions.forEach(doc => {
        firestore
          .collection('projects')
          .doc(event.params.projectId)
          .collection('versions')
          .doc(doc.id)
          .delete()
      })

      return firestore
        .collection('projects')
        .doc(event.params.projectId)
        .collection('permissionJobs')
        .get()
    })
    .then((permissionJobs) => {
      permissionJobs.forEach(doc => {
        firestore
          .collection('projects')
          .doc(event.params.projectId)
          .collection('permissionJobs')
          .doc(doc.id)
          .delete()
      })

      return firestore
        .collection('projects')
        .doc(event.params.projectId)
        .collection('deleteJobs')
        .get()
    })
    .then((deleteJobs) => {
      deleteJobs.forEach(doc => {
        firestore
          .collection('projects')
          .doc(event.params.projectId)
          .collection('deleteJobs')
          .doc(doc.id)
          .delete()
      })

      return firestore
        .collection('projects')
        .doc(event.params.projectId)
        .delete()
    })
    .catch(error => {
      console.log('Project deleting failed', error)
      return false
    })

})
