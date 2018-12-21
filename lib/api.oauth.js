const config = require('./api.config')
const simple = require('simple-oauth2')

module.exports = simple.create({
  client: config.client,
  auth: config.auth
})
