const wreck = require('wreck')
const qs = require('querystring')
const url = require('url')
const { domain, clientId, secretKey, callbackUrl } = require('./config')

const loginUrl = url.resolve(domain, 'login')
const tokenUrl = url.resolve(domain, 'oauth2/token')

module.exports = {
  getLoginUrl: () => {
    const params = {
      client_id: clientId,
      response_type: 'code',
      redirect_uri: callbackUrl
    }
    return `${loginUrl}?${qs.stringify({ ...params }, null, null, qs.unescape)}`
  },

  getToken: async ({ code }) => {
    const basicHeader = Buffer.from(`${useFormURLEncode(clientId)}:${useFormURLEncode(secretKey)}`).toString('base64')

    const headers = {
      'Authorization': `Basic ${basicHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    const payload = {
      grant_type: 'authorization_code',
      client_id: clientId,
      redirect_uri: callbackUrl,
      code
    }

    const req = wreck.request('POST', tokenUrl, {
      headers,
      payload: qs.stringify(payload)
    })

    try {
      const res = await req
      const body = await wreck.read(res)

      return body.toString()
    } catch (error) {
      throw error
    }
  }
}

function useFormURLEncode (value) {
  return encodeURIComponent(value).replace(/%20/g, '+')
}
