import admin from 'firebase-admin'
import fs from 'fs'
import _ from 'lodash'

export default (snap, context) => {
  const bucket = admin.storage().bucket()
  const firestore = admin.firestore()
  const tempFilePath = '/tmp/tempfile.json'
  const versionData = snap.data()
  const destinationPath = `${context.params.projectId}/content.json`

  const jsonFileContent = _.merge(versionData.json, {
    PUBLISHED_AT: versionData.publishedAt,
    VERSION_ID: context.params.versionId,
  })

  const json = JSON.stringify(jsonFileContent, null, 2)

  fs.writeFileSync(tempFilePath, json)

  return bucket
    .upload(tempFilePath, {
      destination: destinationPath,
      metadata: {
        metadata: {
          firebaseStorageDownloadTokens: versionData.token,
        },
      },
    })
    .then(() => {
      console.log('JSON publishing done')

      let updateData = {}
      updateData[`publishedVersion`] = {
        draft: versionData.draft,
        schema: versionData.schema,
        json: json,
        publishedAt: versionData.publishedAt,
        versionId: context.params.versionId,
      }

      firestore
        .collection('projects')
        .doc(context.params.projectId)
        .update(updateData)

      console.log('publishJson done')
      return true
    })
    .catch((error) => console.error('JSON publishing failed', error.message))
}
