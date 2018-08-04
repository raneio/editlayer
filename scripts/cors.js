const fs = require('fs')
const path = require('path')
const execa = require('execa')

;(async () => {
  const firebasersPath = path.join(__dirname, '/../.firebaserc')
  const firebaserc = JSON.parse(fs.readFileSync(firebasersPath).toString())
  const aliases = Object.keys(firebaserc.projects)
  const arguments = process.argv.slice(2)
  const job = arguments[0]
  const alias = arguments[1]
  const envPath = path.join(__dirname, `/../.env.${alias}.local`)

  // Is gsutil installed
  try {
    execa.shellSync(`gsutil version`)
  }
  catch (error) {
    console.log(`
You need to install gsutil
https://cloud.google.com/storage/docs/gsutil_install
`)
    return false
  }

  // Job is required
  if (!['allow', 'disallow', 'status'].includes(job)) {
    console.log(`
Job "${job}" is not available. Use can use the following:
 - allow
 - disallow
 - status
Example: npm run cors allow production
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

  // Get storage bucket name
  const storageBucket = fs.readFileSync(envPath)
    .toString()
    .split('\n')
    .filter(line => {
      return line.startsWith('VUE_APP_FIREBASE_STORAGE_BUCKET=')
    })
    .toString()
    .replace('VUE_APP_FIREBASE_STORAGE_BUCKET=', '')

  // Run the job
  if (job === 'allow') {
    console.log(`Allow CORS on the alias ${alias}`)
    const rulesCorsPath = path.join(__dirname, `/../rules/cors.jsonl`)
    execa.shellSync(`gsutil cors set ${rulesCorsPath} gs://${storageBucket}`, { stdio: 'inherit' })
  }
  else if (job === 'disallow') {
    console.log(`Disallow CORS on the alias ${alias}`)
    const tempPath = path.join(__dirname, `/tempDisallow.json`)
    fs.writeFileSync(tempPath, '[]', 'utf-8')
    execa.shellSync(`gsutil cors set ${tempPath} gs://${storageBucket}`, { stdio: 'inherit' })
    fs.unlinkSync(tempPath)
  }
  else if (job === 'status') {
    console.log(`Get CORS status from the alias ${alias}`)
  }

  execa.shellSync(`gsutil cors get gs://${storageBucket}`, { stdio: 'inherit' })

})().catch(err => console.error(err))
