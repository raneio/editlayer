import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import publishJson from './publishJson'
import attachUserToProject from './attachUserToProject'
import createUser from './createUser'
import deleteProject from './deleteProject'

admin.initializeApp()

exports.publishJson = functions
  .firestore
  .document('projects/{projectId}/versions/{versionId}')
  .onCreate((snap, context) => publishJson(snap, context))

exports.attachUserToProjectWhenAdded = functions
  .firestore
  .document('projects/{projectId}/jobs/{jobId}')
  .onCreate((snap, context) => attachUserToProject.whenAdded(snap, context))

exports.attachUserToProjectWhenRegister = functions
  .auth
  .user()
  .onCreate((snap, context) => attachUserToProject.whenRegister(snap, context))

exports.createUser = functions
  .auth
  .user()
  .onCreate((snap, context) => createUser(snap, context))

exports.deleteProject = functions
  .firestore
  .document('projects/{projectId}/jobs/{jobId}')
  .onCreate((snap, context) => deleteProject(snap, context))
