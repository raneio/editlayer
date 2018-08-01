const _ = require('lodash')
const fs = require('fs')
const inquirer = require('inquirer')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const firebaserc = JSON.parse(fs.readFileSync(`${__dirname}/../.firebaserc`).toString())
const projects = _.map(firebaserc.projects, (projectId, alias) => alias)

const cors = async () => {
  // Is gsutil installed
  try {
    await exec(`gsutil version`)
  }
  catch (error) {
    console.log(`You need to install gsutil`)
    console.log('https://cloud.google.com/storage/docs/gsutil_install')
    return false
  }

  const tempCorsPath = `${__dirname}/tempCors.json`

  const alias = await inquirer.prompt([{
    type: 'list',
    name: 'answer',
    message: 'What environment do you want to set?',
    choices: projects.sort(),
  }])

  const envFilePath = `${__dirname}/../.env.${alias.answer}.local`

  if (!fs.existsSync(envFilePath)) {
    console.log('')
    console.log('You need to first deploy environment (npm run deploy).')
    return false
  }

  const storageBucket = fs.readFileSync(envFilePath)
    .toString()
    .split('\n')
    .filter(line => {
      return _.startsWith(line, 'VUE_APP_FIREBASE_STORAGE_BUCKET=')
    })
    .map(line => {
      return line.replace('VUE_APP_FIREBASE_STORAGE_BUCKET=', '')
    })
    .toString()

  const job = await inquirer.prompt([{
    type: 'list',
    name: 'answer',
    message: 'What to do?',
    choices: [
      'Allow CORS (rules/cors.json)',
      'Disallow CORS',
      'Get CORS status',
    ],
  }])

  let corsString = false

  if (job.answer === 'Allow CORS (rules/cors.json)') {
    corsString = fs.readFileSync(`${__dirname}/../rules/cors.json`).toString()
  }
  else if (job.answer === 'Disallow CORS'){
    corsString = '[]'
  }
  else if (job.answer === 'Get CORS status'){
    const status = await exec(`gsutil cors get gs://${storageBucket}`)
    console.log(`CORS status: ${status.stdout}`)
  }

  if (corsString){
    fs.writeFileSync(tempCorsPath, corsString, 'utf-8')
    await exec(`gsutil cors set ${__dirname}/tempCors.json gs://${storageBucket}`)
    fs.unlinkSync(tempCorsPath)
    console.log(`CORS updated: ${corsString}`)
  }
}

cors()
