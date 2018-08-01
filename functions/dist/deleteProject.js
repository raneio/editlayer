'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _firebaseAdmin = require('firebase-admin');

var _firebaseAdmin2 = _interopRequireDefault(_firebaseAdmin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (snap, context) => {
  const firestore = _firebaseAdmin2.default.firestore();
  const bucket = _firebaseAdmin2.default.storage().bucket();
  const storeData = snap.data();

  if (storeData.job !== 'deleteProject') return false;
  if (storeData.deleteProjectId !== context.params.projectId) return false;

  return bucket.getFiles({ prefix: context.params.projectId }).then(result => {
    let files = result[0];

    files.forEach(file => {
      bucket.file(file.name).delete();
    });

    return true;
  }).then(() => {
    return firestore.collection('projects').doc(context.params.projectId).collection('versions').get();
  }).then(versions => {
    versions.forEach(doc => {
      firestore.collection('projects').doc(context.params.projectId).collection('versions').doc(doc.id).delete();
    });

    return firestore.collection('projects').doc(context.params.projectId).collection('jobs').get();
  }).then(jobs => {
    jobs.forEach(doc => {
      firestore.collection('projects').doc(context.params.projectId).collection('jobs').doc(doc.id).delete();
    });

    return firestore.collection('projects').doc(context.params.projectId).delete();
  }).catch(error => {
    console.log('Project deleting failed', error);
    return false;
  });
};