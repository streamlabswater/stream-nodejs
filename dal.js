'use strict'

// const qs = require('querystring')
const wreck = require('wreck')
const { api: { host } } = require('./config')

module.exports = async function (props = {}) {
  const {
    resource = '/hello/world',
    method = 'GET',
    payload,
    oauth
  } = props

  const { id_token: token } = oauth
  const url = `${host}/dev/v1${resource}`

  const options = {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    payload
  }

  if (!payload) {
    delete options.payload
  }

  try {
    const response = await wreck.request(method, url, options)
    const body = await wreck.read(response, { json: 'strict' })
    console.log('API RESPONSE', response)
    return {
      request: {
        url: resource,
        method,
        body: payload
      },
      response: {
        statusCode: response.statusCode,
        statusMessage: response.statusMessage,
        body
      }
    }
  } catch (err) {
    console.error(err)
    return err
  }
}
