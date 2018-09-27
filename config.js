module.exports = {
  client: {
    id: '69uj9piv3a8qf744k7dv4p5k7a',
    secret: '1hp8at2os5bc47rilqrmnmaqe2rakm1g3lajpuuj8g1q7er8rdm0'
  },
  auth: {
    tokenHost: 'https://dev-streamlabs.auth.us-east-1.amazoncognito.com',
    tokenPath: 'oauth2/token',
    authorizePath: 'login'
  },
  api: {
    redirectUrl: 'http://localhost:3000/auth',
    host: 'https://7dr4wk6qd1.execute-api.us-east-1.amazonaws.com'
  }
}
