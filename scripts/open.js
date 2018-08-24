const fs = require('fs')
const path = require('path')
const execa = require('execa')
const opn = require('opn')

;(async () => {
  const firebasersPath = path.join(__dirname, '/../.firebaserc')
  const firebaserc = JSON.parse(fs.readFileSync(firebasersPath).toString())
  const aliases = Object.keys(firebaserc.projects)
  const arguments = process.argv.slice(2)
  const alias = arguments[0]
  const envPath = path.join(__dirname, `/../.env.${alias}.local`)

  // Alias need to be in .firebaserc
  if (!aliases.includes(alias)) {
    console.log(`
Alias "${alias}" is not available. Use can use the following:
 - ${aliases.join('\n - ')}
Example: npm run deploy production
`)
    return false
  }

  // Get url
  const url = fs.readFileSync(envPath)
    .toString()
    .split('\n')
    .filter(line => {
      return line.startsWith('VUE_APP_FIREBASE_AUTH_DOMAIN=')
    })
    .toString()
    .replace('VUE_APP_FIREBASE_AUTH_DOMAIN=', 'https://')

  if (alias !== 'development') {
    console.log(`Opening URL ${url} in the browser.`)
    opn(url, {wait: false})
  }
  else {
    execa.shellSync(`npm run serve`, { stdio: 'inherit' })
  }

})().catch(err => console.error(err))
