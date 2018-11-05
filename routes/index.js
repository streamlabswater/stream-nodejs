const express = require('express')
const router = express.Router()
const qs = require('querystring')
const oauth = require('../lib/api.oauth')
const config = require('../lib/api.config')

router.get('/', function (req, res, next) {
  res.render('home', {
    plan: 'uno',
    title: 'Majo Moto'
  })
})

router.get('/connect', function (req, res, next) {
  const authorizationUri = oauth.authorizationCode.authorizeURL({
    redirect_uri: config.redirectUri
  })
  res.redirect(qs.unescape(authorizationUri))
})

router.get('/auth', async (req, res) => {
  const { code } = req.query
  const tokenConfig = {
    code,
    redirect_uri: config.redirectUri
  }

  try {
    const result = await oauth.authorizationCode.getToken(tokenConfig)
    const accessToken = oauth.accessToken.create(result)
    req.session.authToken = accessToken.token
    req.session.save(() => res.redirect('/streamlabs'))
  } catch (error) {
    console.error('Access Token Error', error.message)
    const { data, output } = error
    return res.render('oauth', {
      title: 'OAUTH ERROR',
      client: {
        request: {
          line: data.res.socket['_httpMessage']['_header']
        },
        response: {
          line: `HTTP/1.1 ${output.payload.statusCode} ${output.payload.error}`,
          body: data.payload.error
        }
      }
    })
  }
})

router.get('/signout', function (req, res, next) {
  const { auth: { tokenHost }, client: { id }, signoutUri } = config
  const url = `${tokenHost}/logout?client_id=${id}&logout_uri=${signoutUri}`
  req.session.destroy(() => res.redirect(url))
})

module.exports = router
