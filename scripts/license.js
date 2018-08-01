// const fs = require('fs')
// const prompt = require('prompt')
// const colors = require('colors')
// const stringHash = require('string-hash')
//
// const envFile = `${__dirname}/../.env`
//
// console.log('')
// console.log(colors.bold(`License Editlayer Partner`))
// console.log(colors.gray(`You can get partner key from https://editlayer.org/partners`))
//
// prompt.message = ''
// prompt.start()
//
// prompt.get({
//   properties: {
//     name: {
//       description: colors.bold.yellow('Partner Name'),
//       message: 'Name is required. Try again.',
//       required: true,
//     },
//     key: {
//       description: colors.bold.yellow('Partner Key'),
//       pattern: /^\d{3}-\d{3}-\d+$/i,
//       message: 'Parner key is not valid. Try again.',
//       required: true,
//     },
//   }
// },
// (err, result) => {
//   const partnerName = result.name
//   const partnerKey = result.key.toUpperCase()
//   const goldHash = stringHash(`editlayer-gold-${partnerName}`)
//   const silverHash = stringHash(`editlayer-silver-${partnerName}`)
//   const bronzeHash = stringHash(`editlayer-bronze-${partnerName}`)
//
//   if (!fs.existsSync(envFile)) {
//     fs.writeFileSync(envFile, '', 'utf-8')
//   }
//
//   let fileString = fs.readFileSync(envFile)
//     .toString()
//     .split('\n')
//     .map(line => {
//       const pair = line.split('=')
//       const key = pair[0]
//
//       if (key === 'VUE_APP_PARTNER_NAME') {
//         return `VUE_APP_PARTNER_NAME=${partnerName}`
//       }
//
//       if (key === 'VUE_APP_PARTNER_KEY') {
//         return `VUE_APP_PARTNER_KEY=${partnerKey}`
//       }
//
//       return line
//     })
//     .join('\n')
//
//   if (!fileString.includes('VUE_APP_PARTNER_NAME=')) {
//     fileString = `${fileString}\VUE_APP_PARTNER_NAME=${partnerName}`
//   }
//
//   if (!fileString.includes('VUE_APP_PARTNER_KEY=')) {
//     fileString = `${fileString}\nVUE_APP_PARTNER_KEY=${partnerKey}`
//   }
//
//   fs.writeFileSync(envFile, fileString, 'utf-8')
//
//   console.log(colors.bold.green(`Editlayer Partner is licensed to ${partnerName}. Thank you partner!`))
//   console.log('')
// })
//
//
// // const fileString = 'VUE_APP_PARTNER_KEY=foobar'
