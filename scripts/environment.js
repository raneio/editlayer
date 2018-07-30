const fs = require('fs')
const env = process.argv.slice(2).toString()
const envFile = `${__dirname}/../.env.${env}.local`

console.log('envFile', envFile)

const fileString = fs.readFileSync(envFile)
  .toString()
  .split('\n')
  .map(line => {
    if (line.includes('": "')) {
      const pair = line.split('"')
      const key = pair[1]
      const value = pair[3]

      if (key === 'apiKey') {
        return `VUE_APP_FIREBASE_API_KEY=${value}`
      }
      else if (key === 'authDomain') {
        return `VUE_APP_FIREBASE_AUTH_DOMAIN=${value}`
      }
      else if (key === 'databaseURL') {
        return `VUE_APP_FIREBASE_DATABASE_URL=${value}`
      }
      else if (key === 'projectId') {
        return `VUE_APP_FIREBASE_PROJECT_ID=${value}`
      }
      else if (key === 'storageBucket') {
        return `VUE_APP_FIREBASE_STORAGE_BUCKET=${value}`
      }
    }

    return null
  })
  .filter(line => line)
  .join('\n')

fs.writeFileSync(envFile, fileString, 'utf-8')
