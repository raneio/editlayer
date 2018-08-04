import admin from 'firebase-admin'
import _ from 'lodash'
import { Base64 } from 'js-base64'

export default {
  async whenAdded (snap, context) {
    const firestore = admin.firestore()
    const auth = admin.auth()
    const jobData = snap.data()

    if (jobData.job !== 'attachUserToProject') return false

    const userId = await auth
      .getUserByEmail(jobData.email)
      .then(userRecord => userRecord.uid)
      .catch(error => {
        console.error(error)
        return false
      })

    if (userId === false) return false

    const project = await firestore
      .collection('projects')
      .doc(jobData.projectId)
      .get()

    const projectData = project.data()
    const user = projectData.users[jobData.awaitId]

    let updateData = {}

    // Create new user with real id
    updateData[`users.${userId}`] = {
      email: user.email,
      permissions: user.permissions,
      userExist: true,
    }

    // Remove await user
    updateData[`users.${jobData.awaitId}`] = admin.firestore.FieldValue.delete()

    firestore
      .collection('projects')
      .doc(context.params.projectId)
      .update(updateData)

    console.log('attachUserToProjectWhenAdded done')
    return true
  },

  whenRegister (userRecord, context) {
    const firestore = admin.firestore()
    const awaitId = `await-${Base64.encodeURI(userRecord.email)}`

    return firestore
      .collection('projects')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach((doc) => {
          if (_.has(doc.data().users, awaitId)) {
            const user = doc.data().users[awaitId]
            let updateData = {}

            // Create new user with real id
            updateData[`users.${userRecord.uid}`] = {
              email: user.email,
              permissions: user.permissions,
              userExist: true,
            }

            // Remove await user
            updateData[`users.${awaitId}`] = admin.firestore.FieldValue.delete()

            firestore
              .collection('projects')
              .doc(doc.id)
              .update(updateData)
          }
        })

        console.log('attachUserToProjectWhenRegister done')
        return true
      })
      .catch(error => console.error('User adding when register failed', error))
  },
}
