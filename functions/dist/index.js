'use strict';

var _firebaseFunctions = require('firebase-functions');

var functions = _interopRequireWildcard(_firebaseFunctions);

var _firebaseAdmin = require('firebase-admin');

var _firebaseAdmin2 = _interopRequireDefault(_firebaseAdmin);

var _publishJson = require('./publishJson');

var _publishJson2 = _interopRequireDefault(_publishJson);

var _attachUserToProject = require('./attachUserToProject');

var _attachUserToProject2 = _interopRequireDefault(_attachUserToProject);

var _createUser = require('./createUser');

var _createUser2 = _interopRequireDefault(_createUser);

var _deleteProject = require('./deleteProject');

var _deleteProject2 = _interopRequireDefault(_deleteProject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

_firebaseAdmin2.default.initializeApp();

exports.publishJson = functions.firestore.document('projects/{projectId}/versions/{versionId}').onCreate((snap, context) => (0, _publishJson2.default)(snap, context));

exports.attachUserToProjectWhenAdded = functions.firestore.document('projects/{projectId}/jobs/{jobId}').onCreate((snap, context) => _attachUserToProject2.default.whenAdded(snap, context));

exports.attachUserToProjectWhenRegister = functions.auth.user().onCreate((snap, context) => _attachUserToProject2.default.whenRegister(snap, context));

exports.createUser = functions.auth.user().onCreate((snap, context) => (0, _createUser2.default)(snap, context));

exports.deleteProject = functions.firestore.document('projects/{projectId}/jobs/{jobId}').onCreate((snap, context) => (0, _deleteProject2.default)(snap, context));