import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

firebase.initializeApp({
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
})

const firestore = firebase.firestore()
firestore.settings({timestampsInSnapshots: true})

export default {
  firestore: firestore,
  firestoreDelete: firebase.firestore.FieldValue.delete(),
  firestoreTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
  auth: firebase.auth(),
  storage: firebase.storage(),
}
