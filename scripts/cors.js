const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const firebaserc = JSON.parse(fs.readFileSync(`${__dirname}/../.firebaserc`).toString())
const aliases = Object.keys(firebaserc.projects)
const aliasesSorted = aliases.sort()
const firstAlias = aliasesSorted.slice(0, 1).toString()
const arguments = process.argv.slice(2)
const job = arguments[0]
const alias = arguments[1]

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

  if (!['allow', 'disallow', 'status'].includes(job)) {
    console.log('')
    console.log(`Job "${job}" is not available. Use can use following: allow, disallow, status`)
    console.log(`Example: npm run cors allow ${firstAlias}`)
    return false
  }

  if (!aliases.includes(alias)) {
    console.log('')
    console.log(`Alias "${alias}" is not available. Use can use following: ${aliasesSorted.join(', ')}`)
    console.log(`Example: npm run cors allow ${firstAlias}`)
    return false
  }

  const tempCorsPath = `${__dirname}/tempCors.json`

  const envFilePath = `${__dirname}/../.env.${alias}.local`

  if (!fs.existsSync(envFilePath)) {
    console.log('')
    console.log('You need to first deploy environment (npm run deploy).')
    return false
  }

  const storageBucket = fs.readFileSync(envFilePath)
    .toString()
    .split('\n')
    .filter(line => {
      return line.startsWith('VUE_APP_FIREBASE_STORAGE_BUCKET=')
    })
    .map(line => {
      return line.replace('VUE_APP_FIREBASE_STORAGE_BUCKET=', '')
    })
    .toString()

  let corsString = false

  if (job === 'allow') {
    console.log(`Allow CORS in the alias ${alias}`)
    corsString = fs.readFileSync(`${__dirname}/../rules/cors.json`).toString()
  }
  else if (job === 'disallow'){
    console.log(`Disallow CORS in the alias ${alias}`)
    corsString = '[]'
  }
  else if (job === 'status'){
    console.log(`Get CORS status from alias ${alias}`)
    const status = await exec(`gsutil cors get gs://${storageBucket}`)
    console.log(status.stdout)
  }
  else {
    console.log(`Command "${job}" is not valid. You can use allow, disallow or status.`)
  }

  if (corsString){
    fs.writeFileSync(tempCorsPath, corsString, 'utf-8')
    await exec(`gsutil cors set ${__dirname}/tempCors.json gs://${storageBucket}`)
    fs.unlinkSync(tempCorsPath)
    console.log(`CORS updated in the bucket gs://${storageBucket}`)
    console.log(corsString)
  }
}

cors()
