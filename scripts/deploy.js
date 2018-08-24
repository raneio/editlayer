const fs = require('fs')
const path = require('path')
const execa = require('execa')

const createEnvFile = (envPath, alias) => {
  const setupWeb = execa.shellSync(`firebase setup:web`)
  const envFileContent = setupWeb.stdout
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

  fs.writeFileSync(envPath, envFileContent, 'utf-8')

  console.log(`
Created file .env.${alias}.local
${envFileContent}
`)
}

;(async () => {
  const firebasersPath = path.join(__dirname, '/../.firebaserc')
  const firebaserc = JSON.parse(fs.readFileSync(firebasersPath).toString())
  const aliases = Object.keys(firebaserc.projects)
  const arguments = process.argv.slice(2)
  const alias = arguments[0]
  const envPath = path.join(__dirname, `/../.env.${alias}.local`)

  // Is firebase-tools installed
  try {
    execa.shellSync(`npx firebase --version`)
  }
  catch (error) {
    console.log(`
You need to Firebase Tools
npm install -g firebase-tools
https://firebase.google.com/docs/cli/
`)
    return false
  }

  // Alias need to be in .firebaserc
  if (!aliases.includes(alias)) {
    console.log(`
Alias "${alias}" is not available. Use can use the following:
 - ${aliases.join('\n - ')}
Example: npm run deploy production
`)
    return false
  }

  // Lint
  execa.shellSync(`npx vue-cli-service lint`, { stdio: 'inherit' })
  execa.shellSync(`npx eslint ./functions/src`, { stdio: 'inherit' })

  // Use selected alias
  execa.shellSync(`npx firebase use ${alias}`, { stdio: 'inherit' })

  // Create .env.[alias].local File if not exists or project id is changed
  if (!fs.existsSync(envPath)) {
    createEnvFile(envPath, alias)
  }
  else {
    const projectId = fs.readFileSync(envPath)
      .toString()
      .split('\n')
      .map(line => {
        const pair = line.split('=')
        const key = pair[0]
        const value = pair[1]

        if (key === 'VUE_APP_FIREBASE_PROJECT_ID') {
          return value
        }

        return null
      })
      .filter(line => line)
      .toString()

    if (firebaserc.projects[alias] !== projectId) {
      createEnvFile(envPath, alias)
    }
  }

  // Build functions
  execa.shellSync('npx babel functions/src --out-dir functions/dist', { stdio: 'inherit' })

  // Build app if not development
  if (alias !== 'development') {
    execa.shellSync(`npx vue-cli-service build --mode ${alias}`, { stdio: 'inherit' })
  }

  // Deploy to Firebase
  if (alias !== 'development') {
    execa.shellSync('npx firebase deploy', { stdio: 'inherit' })
  }
  else {
    execa.shellSync('npx firebase deploy --only functions,firestore,storage', { stdio: 'inherit' })
  }

  // Back to development env if exsist
  if (aliases.includes('development')) {
    execa.shellSync(`npx firebase use development`, { stdio: 'inherit' })
  }

})().catch(err => console.error(err))
