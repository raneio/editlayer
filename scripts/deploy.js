const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const firebaserc = JSON.parse(fs.readFileSync(`${__dirname}/../.firebaserc`).toString())
const aliases = Object.keys(firebaserc.projects)
const aliasesSorted = aliases.sort()
const firstAlias = aliasesSorted.slice(0, 1).toString()
const arguments = process.argv.slice(2)
const alias = arguments[0]

const setEnvFile = async (alias) => {
  const envFilePath = `${__dirname}/../.env.${alias}.local`

  if (!fs.existsSync(envFilePath)) {
    console.log(`firebase setup:web > .env.${alias}.local`)
    await exec(`firebase setup:web > ${envFilePath}`)

    const envFileContent = fs.readFileSync(envFilePath)
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

    fs.writeFileSync(envFilePath, envFileContent, 'utf-8')
  }
}

const deploy = async () => {
  if (!aliases.includes(alias)) {
    console.log('')
    console.log(`Alias "${alias}" is not available. Use can use following: ${aliasesSorted.join(', ')}`)
    console.log(`Example: npm run deploy ${firstAlias}`)
    return false
  }

  const url = `https://${firebaserc.projects[alias]}.firebaseapp.com/`

  console.log('')
  console.log(`firebase use ${alias}`)
  await exec(`firebase use ${alias}`)

  setEnvFile(alias)

  if (alias === 'development') {
    console.log(`npm run build:functions`)
    await exec(`npm run build:functions`)

    console.log(`firebase deploy --only functions,firestore,storage`)
    console.log(`...this can take several minutes, please wait`)

    await exec(`firebase deploy --only functions,firestore,storage`)

    console.log('Deploy complete!')
    console.log('Run development environment: npm run serve')
  }
  else {
    if (aliases.length > 1) {
      console.log(`npm run build`)
      await exec(`npm run build`)
    }
    console.log(`firebase deploy`)
    console.log(`...this can take several minutes, please wait`)

    await exec(`firebase deploy`)

    console.log('Deploy complete!')
    console.log(`Open deployed Editlayer: ${url}`)
  }
}

deploy()
