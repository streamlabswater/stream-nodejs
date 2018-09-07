const express = require('express')
const router = express.Router()
const qs = require('querystring')
const { domain: tokenHost, clientId, secretKey, callbackUrl } = require('../config')

const credentials = {
  client: {
    id: clientId,
    secret: secretKey
  },
  auth: {
    tokenHost,
    tokenPath: 'oauth2/token',
    authorizePath: 'login'
  }
}

const oauth = require('simple-oauth2').create(credentials)

const authorizationUri = oauth.authorizationCode.authorizeURL({
  redirect_uri: callbackUrl
})

router.get('/', function (req, res, next) {
  console.log('ACCESS SESSION', req.session.idToken)
  res.render('locations', { title: 'Majo Moto Locations' })
})

router.get('/connect', function (req, res, next) {
  res.redirect(qs.unescape(authorizationUri))
})

router.get('/auth', async (req, res) => {
  const { code } = req.query
  const tokenConfig = {
    code,
    redirect_uri: callbackUrl
  }

  try {
    const result = await oauth.authorizationCode.getToken(tokenConfig)
    const accessToken = oauth.accessToken.create(result)
    req.session.idToken = accessToken.token
    req.session.save()
    res.redirect('/streamlabs')

    // return res.status(200).json(accessToken)
  } catch (error) {
    console.error('Access Token Error', error.message)
    return res.status(500).json({ message: 'Authentication failed' })
  }
})

module.exports = router
