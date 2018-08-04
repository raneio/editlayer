import admin from 'firebase-admin'

export default async (userRecord, context) => {
  const firestore = admin.firestore()

  const settings = await firestore
    .collection('settings')
    .doc('general')
    .get()
    .then(snap => snap.data())
    .catch(error => console.error('Settings getting failed', error))

  const firstUser = await firestore
    .collection('users')
    .get()
    .then(snap => snap.size === 0)
    .catch(error => console.error('Users getting failed', error))

  const allowCreateProject = settings.allowNewUsersCreateProject === true || firstUser === true

  await firestore
    .collection('users')
    .doc(userRecord.uid)
    .set({
      email: userRecord.email,
      permissions: {
        createProject: allowCreateProject,
      },
    })
    .catch(error => console.error('User added failed', error))

  console.log('createUser done')
  return true
}
