import admin from 'firebase-admin'
import fs from 'fs'
import _ from 'lodash'

export default (snap, context) => {
  const bucket = admin.storage().bucket()
  const tempFilePath = '/tmp/tempfile.json'
  const versionData = snap.data()
  const destinationPath = `${context.params.projectId}.json`

  const jsonFileContent = _.merge(versionData.content, {
    PUBLISHED_AT: versionData.publishedAt,
    VERSION_ID: context.params.versionId,
  })

  fs.writeFileSync(tempFilePath, JSON.stringify(jsonFileContent, null, 2))

  return bucket
    .upload(tempFilePath, {
      destination: destinationPath,
      // metadata: {
      //   metadata: {
      //     firebaseStorageDownloadTokens: versionData.downloadToken,
      //   },
      // },
    })
    .then(() => {
      console.log('JSON publishing done')
      return true
    })
    .catch((error) => console.error('JSON publishing failed', error.message))
}
