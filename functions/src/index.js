import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import publishJson from './publishJson'
import attachRole from './attachRole'
import deleteProject from './deleteProject'

admin.initializeApp()

exports.publishJson = functions
  .firestore
  .document('projects/{projectId}/versions/{versionId}')
  .onCreate((snap, context) => publishJson(snap, context))

exports.attachRole = functions
  .firestore
  .document('projects/{projectId}/jobs/{jobId}')
  .onCreate((snap, context) => attachRole.job(snap, context))

exports.attachRoleWhenRegister = functions
  .auth
  .user()
  .onCreate((snap, context) => attachRole.whenRegister(snap, context))

exports.deleteProject = functions
  .firestore
  .document('projects/{projectId}/jobs/{jobId}')
  .onCreate((snap, context) => deleteProject(snap, context))
