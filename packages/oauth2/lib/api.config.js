
module.exports = {
  host: 'https://api.streamlabswater.com',
  client: {
    id: process.env.STREAMLABS_CLIENT_ID,
    secret: process.env.STREAMLABS_CLIENT_SECRET
  },
  auth: {
    tokenHost: 'https://auth.streamlabswater.com',
    tokenPath: 'oauth2/token',
    authorizePath: 'login'
  },
  redirectUri: process.env.STREAMLABS_REDIRECT_URI,
  signoutUri: process.env.STREAMLABS_SIGNOUT_URI
}
