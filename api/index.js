'use strict'

const wreck = require('wreck')
const { api: { host } } = require('../config')

module.exports = function (props = {}) {
  return async function (req, res, next) {
    const { resource = req.path, method = 'GET' } = props
    const { oauth } = req.session
    if (!oauth) {
      return res.redirect('/')
    }

    const { id_token: token } = oauth
    const uri = `${host}/dev/v1${resource}`

    console.log('URI', uri)
    const headers = { 'Authorization': `Bearer ${token}` }

    try {
      const response = await wreck.request(method, uri, { headers })
      res.payload = await wreck.read(response, { json: 'strict' })

      next()
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
}
