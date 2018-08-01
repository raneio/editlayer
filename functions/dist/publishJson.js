'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _firebaseAdmin = require('firebase-admin');

var _firebaseAdmin2 = _interopRequireDefault(_firebaseAdmin);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (snap, context) => {
  const bucket = _firebaseAdmin2.default.storage().bucket();
  const firestore = _firebaseAdmin2.default.firestore();
  const tempFilePath = '/tmp/tempfile.json';
  const versionData = snap.data();
  const destinationPath = `${context.params.projectId}/content.json`;

  const jsonFileContent = _lodash2.default.merge(versionData.json, {
    PUBLISHED_AT: versionData.publishedAt,
    VERSION_ID: context.params.versionId
  });

  const json = JSON.stringify(jsonFileContent, null, 2);

  _fs2.default.writeFileSync(tempFilePath, json);

  return bucket.upload(tempFilePath, {
    destination: destinationPath,
    metadata: {
      metadata: {
        firebaseStorageDownloadTokens: versionData.token
      }
    }
  }).then(() => {
    console.log('JSON publishing done');

    let updateData = {};
    updateData[`publishedVersion`] = {
      draft: versionData.draft,
      schema: versionData.schema,
      json: json,
      publishedAt: versionData.publishedAt,
      versionId: context.params.versionId
    };

    firestore.collection('projects').doc(context.params.projectId).update(updateData);

    return true;
  }).catch(error => console.error('JSON publishing failed', error.message));
};