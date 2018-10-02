const express = require('express')
const router = express.Router()
const qs = require('querystring')
const stream = require('../stream.config.json')
const simple = require('simple-oauth2')

const oauth = {
  dev: simple.create({
    client: stream.dev.client,
    auth: stream.dev.auth
  }),
  qa: simple.create({
    client: stream.qa.client,
    auth: stream.qa.auth
  }),
  prod: simple.create({
    client: stream.prod.client,
    auth: stream.prod.auth
  })
}

router.get('/', function (req, res, next) {
  res.render('home', {
    plan: 'single',
    title: 'Majo Moto'
  })
})

router.post('/', function (req, res, next) {
  const { env } = req.body
  req.session.env = env
  res.locals.env = env
  req.session.save()
  res.render('home', {
    plan: 'single',
    title: 'Majo Moto'
  })
})

router.get('/connect', function (req, res, next) {
  const env = req.session.env
  const authorizationUri = oauth[env].authorizationCode.authorizeURL({
    redirect_uri: 'http://localhost:3000/auth'
  })
  res.redirect(qs.unescape(authorizationUri))
})

router.get('/auth', async (req, res) => {
  const { code } = req.query
  const env = req.session.env
  const tokenConfig = {
    code,
    redirect_uri: 'http://localhost:3000/auth'
  }

  try {
    const result = await oauth[env].authorizationCode.getToken(tokenConfig)
    const accessToken = oauth[env].accessToken.create(result)
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

router.get('/signout', function (req, res, next) {
  const env = req.session.env
  const { auth: { tokenHost }, client: { id } } = stream[env]
  const url = `${tokenHost}/logout?client_id=${id}&logout_uri=http://localhost:3000`
  res.redirect(url)
})

module.exports = router
