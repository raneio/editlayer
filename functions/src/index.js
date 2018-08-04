import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import publishJson from './publishJson'
import attachUserToProject from './attachUserToProject'
import createUser from './createUser'
import deleteProject from './deleteProject'
import initSettings from './initSettings'

admin.initializeApp()

exports.newUser = functions
  .auth
  .user()
  .onCreate(async (snap, context) => {
    await initSettings(snap, context)
    await createUser(snap, context)
    await attachUserToProject.whenRegister(snap, context)
    return true
  })

exports.newVersion = functions
  .firestore
  .document('projects/{projectId}/versions/{versionId}')
  .onCreate(async (snap, context) => {
    await publishJson(snap, context)
    return true
  })

exports.newJob = functions
  .firestore
  .document('projects/{projectId}/jobs/{jobId}')
  .onCreate(async (snap, context) => {
    await attachUserToProject.whenAdded(snap, context)
    await deleteProject(snap, context)
    return true
  })
