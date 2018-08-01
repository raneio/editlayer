import admin from 'firebase-admin'

export default (userRecord, context) => {
  const firestore = admin.firestore()

  return firestore
    .collection('users')
    .get()
    .then(snap => {
      // Add to first user premission create new projects
      const allowCreateProject = snap.size === 0

      return firestore
        .collection('users')
        .doc(userRecord.uid)
        .set({
          email: userRecord.email,
          permissions: {
            createProject: allowCreateProject,
          },
        })
    })
    .catch(error => console.error('Create user failed', error))
}
