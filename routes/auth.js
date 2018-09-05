const express = require('express')
const router = express.Router()

const aws = {
  clientId: '69uj9piv3a8qf744k7dv4p5k7a',
  secretKey: '1hp8at2os5bc47rilqrmnmaqe2rakm1g3lajpuuj8g1q7er8rdm0'
}

/* GET users listing. */
router.get('/streamlabs', function (req, res, next) {
  res.send('respond with a resource')
})

router.get('/streamlabs/callback', function (req, res, next) {
  res.send('respond with a resource')
})

module.exports = router
