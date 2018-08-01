const _ = require('lodash')
const fs = require('fs')
const inquirer = require('inquirer')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const firebaserc = JSON.parse(fs.readFileSync(`${__dirname}/../.firebaserc`).toString())
const projects = _.map(firebaserc.projects, (projectId, alias) => alias)

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

  console.log('')

  const alias = await inquirer.prompt([{
    type: 'list',
    name: 'answer',
    message: 'What environment do you want to deploy?',
    choices: projects.sort(),
  }])

  if (alias.answer === 'production' && projects.length > 1) {
    console.log('')

    const sure = await inquirer.prompt([{
      type: 'list',
      name: 'sure',
      message: 'Are you sure want to deploy to production?',
      choices: ['No', 'Yes'],
    }])

    if (sure.sure === 'No') {
      return false
    }
  }


  console.log(`firebase use ${alias.answer}`)
  await exec(`firebase use ${alias.answer}`)

  setEnvFile(alias.answer)

  if (alias.answer === 'development') {
    console.log(`npm run build:only-functions`)
    await exec(`npm run build:only-functions`)

    console.log(`firebase deploy --only functions,firestore,storage`)
    console.log(`  This can take several minutes, please wait...`)
    await exec(`firebase deploy --only functions,firestore,storage`)
  }
  else {
    if (projects.length > 1) {
      console.log(`npm run build`)
      await exec(`npm run build`)
    }
    console.log(`firebase deploy`)
    console.log(`  This can take several minutes, please wait...`)
    await exec(`firebase deploy`)
  }

  console.log('Deploy complete!')


}

deploy()
