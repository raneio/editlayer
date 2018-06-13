import admin from 'firebase-admin'
import _ from 'lodash'
import sha1 from 'node-sha1'

export default {
  job (snap, context) {
    const firestore = admin.firestore()
    const auth = admin.auth()
    const storeData = snap.data()

    if (storeData.job !== 'attachRole') return false

    return auth
      .getUserByEmail(storeData.email)
      .then((userRecord) => {
        let userId = userRecord.uid
        let updateData = {}

        if (storeData.role === false) {
          // Delete user if role is false
          updateData[`roles.${userId}`] = admin.firestore.FieldValue.delete()
        }
        else {
          updateData[`roles.${userId}`] = {
            role: storeData.role,
            email: storeData.email,
            userExist: true,
          }
        }

        return firestore
          .collection('projects')
          .doc(context.params.projectId)
          .update(updateData)
      })
      .catch(error => {
        // Add role waiting for register
        if (error.code === 'auth/user-not-found') {
          const emailSha1 = sha1(storeData.email)
          let updateData = {}

          updateData[`roles.${emailSha1}`] = {
            role: storeData.role,
            email: storeData.email,
            userExist: false,
          }

          return firestore
            .collection('projects')
            .doc(context.params.projectId)
            .update(updateData)
        }
        else {
          console.log('Role attach failed', error)
          return false
        }
      })
  },
  whenRegister (userRecord, context) {
    const firestore = admin.firestore()
    const emailSha1 = sha1(userRecord.email)

    return firestore
      .collection('projects')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach((doc) => {
          if (_.has(doc.data().roles, emailSha1)) {
            let permissionData = doc.data().roles[emailSha1]
            let updateData = {}

            updateData[`roles.${userRecord.uid}`] = {
              role: permissionData.role,
              email: userRecord.email,
              userExist: true,
            }

            updateData[`roles.${emailSha1}`] = admin.firestore.FieldValue.delete()

            firestore
              .collection('projects')
              .doc(doc.id)
              .update(updateData)
          }

          return true
        })

        return true
      })
      .catch(error => {
        console.log('Role attach when register failed', error)
        return false
      })
  },
}
