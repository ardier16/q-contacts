/* eslint-disable no-console */

const chromeWebstoreUpload = require('chrome-webstore-upload')
const path = require('path')
const fs = require('fs')

const pkg = require(path.resolve(__dirname, '../package.json'))
const extensionPath = path.resolve(__dirname, '../q-contacts-extension.zip')

const extensionZipFile = fs.createReadStream(extensionPath)
const webStoreApi = chromeWebstoreUpload({
  clientId: process.env.GWS_CLIENT_ID,
  clientSecret: process.env.GWS_CLIENT_SECRET,
  refreshToken: process.env.GWS_REFRESH_TOKEN,
  extensionId: process.env.EXTENSION_ID
})

async function updateExtension () {
  const token = await webStoreApi.fetchToken()
  await webStoreApi.uploadExisting(extensionZipFile, token)
  console.log(`Extension v${pkg.version} uploaded successfully`)

  await webStoreApi.publish('default', token)
  console.log(`Extension v${pkg.version} published successfully`)
}

updateExtension()
