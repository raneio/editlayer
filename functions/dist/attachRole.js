'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _firebaseAdmin = require('firebase-admin');

var _firebaseAdmin2 = _interopRequireDefault(_firebaseAdmin);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _nodeSha = require('node-sha1');

var _nodeSha2 = _interopRequireDefault(_nodeSha);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  job(snap, context) {
    const firestore = _firebaseAdmin2.default.firestore();
    const auth = _firebaseAdmin2.default.auth();
    const storeData = snap.data();

    if (storeData.job !== 'attachRole') return false;

    console.log('storeData', storeData);

    return auth.getUserByEmail(storeData.email).then(userRecord => {
      let userId = userRecord.uid;
      let updateData = {};

      // if (storeData.role === false) {
      //   // Delete user if role is false
      //   updateData[`users.${userId}`] = admin.firestore.FieldValue.delete()
      // }
      // else {
      //   updateData[`users.${userId}`] = {
      //     role: storeData.role,
      //     email: storeData.email,
      //     userExist: true,
      //   }
      // }

      updateData[`users.${userId}`] = {
        email: storeData.email,
        userExist: true,
        allowPublish: true,
        allowUpdateDraft: true
      };

      return firestore.collection('projects').doc(context.params.projectId).update(updateData);
    }).catch(error => {
      // Add role waiting for register
      if (error.code === 'auth/user-not-found') {
        const emailSha1 = (0, _nodeSha2.default)(storeData.email);
        let updateData = {};

        updateData[`users.${emailSha1}`] = {
          email: storeData.email,
          userExist: false
        };

        return firestore.collection('projects').doc(context.params.projectId).update(updateData);
      } else {
        console.log('Role attach failed', error);
        return false;
      }
    });
  },
  whenRegister(userRecord, context) {
    const firestore = _firebaseAdmin2.default.firestore();
    const emailSha1 = (0, _nodeSha2.default)(userRecord.email);

    return firestore.collection('projects').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        if (_lodash2.default.has(doc.data().users, emailSha1)) {
          let permissionData = doc.data().users[emailSha1];
          let updateData = {};

          updateData[`users.${userRecord.uid}`] = {
            email: userRecord.email,
            userExist: true,
            allowPublish: true,
            allowUpdateDraft: true
          };

          updateData[`users.${emailSha1}`] = _firebaseAdmin2.default.firestore.FieldValue.delete();

          firestore.collection('projects').doc(doc.id).update(updateData);
        }
      });

      return true;
    }).catch(error => {
      console.log('Role attach when register failed', error);
      return false;
    });
  }
};