import admin from 'firebase-admin'

export default async (userRecord, context) => {
  const firestore = admin.firestore()

  const isSettingsExsist = await firestore
    .collection('settings')
    .get()
    .then(snap => snap.size > 0)
    .catch(error => console.error('Settings failed', error))

  if (isSettingsExsist === false) {
    await firestore
      .collection('settings')
      .doc('general')
      .set({
        allowNewUsersCreateProject: false,
      })
  }

  console.log('initSettings done')
  return false
}
