'use strict'

const wreck = require('@hapi/wreck')

module.exports = async function (props = {}) {
  const {
    host,
    resource = '/hello/world',
    method = 'GET',
    body = '',
    accessToken
  } = props

  const url = `${host}/v1${resource}`
  const options = {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${accessToken}`
    }
  }

  if (body) {
    options.payload = body
  }

  try {
    const response = await wreck.request(method, url, options)
    return wreck.read(response, { json: 'strict' })
  } catch (err) {
    console.error(err)
    return err
  }
}
