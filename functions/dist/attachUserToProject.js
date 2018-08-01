'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _firebaseAdmin = require('firebase-admin');

var _firebaseAdmin2 = _interopRequireDefault(_firebaseAdmin);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsBase = require('js-base64');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
  whenAdded(snap, context) {
    return _asyncToGenerator(function* () {
      const firestore = _firebaseAdmin2.default.firestore();
      const auth = _firebaseAdmin2.default.auth();
      const jobData = snap.data();

      if (jobData.job !== 'attachUserToProject') return false;

      const userId = yield auth.getUserByEmail(jobData.email).then(function (userRecord) {
        return userRecord.uid;
      }).catch(function (error) {
        console.error(error);
        return false;
      });

      if (userId === false) return false;

      const project = yield firestore.collection('projects').doc(jobData.projectId).get();

      const projectData = project.data();
      const user = projectData.users[jobData.awaitId];

      let updateData = {};

      // Create new user with real id
      updateData[`users.${userId}`] = {
        email: user.email,
        permissions: user.permissions,
        userExist: true

        // Remove await user
      };updateData[`users.${jobData.awaitId}`] = _firebaseAdmin2.default.firestore.FieldValue.delete();

      firestore.collection('projects').doc(context.params.projectId).update(updateData);

      return true;
    })();
  },

  whenRegister(userRecord, context) {
    const firestore = _firebaseAdmin2.default.firestore();
    const awaitId = `await-${_jsBase.Base64.encodeURI(userRecord.email)}`;

    return firestore.collection('projects').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        if (_lodash2.default.has(doc.data().users, awaitId)) {
          const user = doc.data().users[awaitId];
          let updateData = {};

          // Create new user with real id
          updateData[`users.${userRecord.uid}`] = {
            email: user.email,
            permissions: user.permissions,
            userExist: true

            // Remove await user
          };updateData[`users.${awaitId}`] = _firebaseAdmin2.default.firestore.FieldValue.delete();

          firestore.collection('projects').doc(doc.id).update(updateData);
        }
      });

      return true;
    }).catch(error => console.error('User adding when register failed', error));
  }
};