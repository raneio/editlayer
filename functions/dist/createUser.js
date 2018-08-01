'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _firebaseAdmin = require('firebase-admin');

var _firebaseAdmin2 = _interopRequireDefault(_firebaseAdmin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (userRecord, context) => {
  const firestore = _firebaseAdmin2.default.firestore();

  return firestore.collection('users').get().then(snap => {
    // Add to first user premission create new projects
    const allowCreateProject = snap.size === 0;

    return firestore.collection('users').doc(userRecord.uid).set({
      email: userRecord.email,
      permissions: {
        createProject: allowCreateProject
      }
    });
  }).catch(error => console.error('Create user failed', error));
};