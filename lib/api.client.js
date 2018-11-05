'use strict'

const wreck = require('wreck')

module.exports = async function (props = {}) {
  const {
    host,
    resource = '/hello/world',
    method = 'GET',
    payload = '',
    authToken
  } = props

  const { access_token: token } = authToken
  const url = `${host}/v1${resource}`

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
    const { statusCode, statusMessage } = response

    return {
      request: {
        line: `${method} /v1${resource} HTTP/1.1`,
        body: payload
      },
      response: {
        line: `HTTP/1.1 ${statusCode} ${statusMessage}`,
        body
      }
    }
  } catch (err) {
    console.error(err)
    return err
  }
}
