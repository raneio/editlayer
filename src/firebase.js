import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

console.log('VUE_APP__FIREBASE_API_KEY', process.env.VUE_APP__FIREBASE_API_KEY)
console.log('VUE_APP__FIREBASE_PROJECT_ID', process.env.VUE_APP__FIREBASE_PROJECT_ID)

firebase.initializeApp({
  apiKey: process.env.VUE_APP__FIREBASE_API_KEY,
  authDomain: `${process.env.VUE_APP__FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${process.env.VUE_APP__FIREBASE_PROJECT_ID}.firebaseio.com`,
  projectId: process.env.VUE_APP__FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.VUE_APP__FIREBASE_PROJECT_ID}.appspot.com`,
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
