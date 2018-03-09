import firebase from 'firebase'
import 'firebase/firestore'

firebase.initializeApp({
  apiKey: 'AIzaSyAhxxZZPDdlZViXMDyHOlKwHUexNgN7qtI',
  authDomain: 'editlayerapp.firebaseapp.com',
  databaseURL: 'https://editlayerapp.firebaseio.com',
  projectId: 'editlayerapp',
  storageBucket: 'editlayerapp.appspot.com',
  messagingSenderId: '859710668845',
})

export default {
  firestore: firebase.firestore(),
  firestoreDelete: firebase.firestore.FieldValue.delete(),
  firestoreTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
  auth: firebase.auth(),
  storage: firebase.storage(),
}
