const express = require('express')
const router = express.Router()
const qs = require('querystring')

const { client, auth, api: { redirectUrl } } = require('../config')
const oauth = require('simple-oauth2').create({ client, auth })

const authorizationUri = oauth.authorizationCode.authorizeURL({
  redirect_uri: redirectUrl
})

router.get('/', function (req, res, next) {
  res.render('home', {
    plan: 'single',
    title: 'Majo Moto'
  })
})

router.get('/connect', function (req, res, next) {
  res.redirect(qs.unescape(authorizationUri))
})

router.get('/auth', async (req, res) => {
  const { code } = req.query
  const tokenConfig = {
    code,
    redirect_uri: redirectUrl
  }

  try {
    const result = await oauth.authorizationCode.getToken(tokenConfig)
    const accessToken = oauth.accessToken.create(result)
    req.session.oauth = accessToken.token
    req.session.save()
    res.redirect('/streamlabs')
  } catch (error) {
    console.error('Access Token Error', error.message)
    return res.render('oauth', {
      title: 'OAUTH ERROR',
      api: error
    })
  }
})

module.exports = router
