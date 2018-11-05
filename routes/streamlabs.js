'use strict'

const express = require('express')
const router = express.Router()
const apiClient = require('../lib/api.client')
const oauth = require('../lib/api.oauth')
const config = require('../lib/api.config')

const currentTime = Math.round((new Date()).getTime() / 1000)
const startTime = {
  byHour: (currentTime - 86400), // 24hrs
  byDay: (currentTime - 604800), // 7 days
  byMonth: (currentTime - 7884000) // 3 months
}

router.use(async (req, res, next) => {
  const { authToken } = req.session

  if (!authToken) {
    return res.redirect('/')
  }

  // refresh token
  let accessToken = oauth.accessToken.create(authToken)
  if (accessToken.expired()) {
    try {
      accessToken = await accessToken.refresh()
      req.session.authToken = accessToken.token
      req.session.save()
    } catch (error) {
      console.log('Error refreshing access token: ', error.message)
    }
  }

  next()
})

router.get('/', async (req, res, next) => {
  const { authToken } = req.session
  const client = await apiClient({
    host: config.host,
    resource: '/hello/world',
    authToken
  })

  return res.render('hello', {
    title: 'hello',
    client
  })
})
//
router.get('/:collection', async (req, res, next) => {
  const collection = req.params.collection
  const identifier = `${collection.slice(0, -1)}Id`
  const { authToken } = req.session
  const client = await apiClient({
    host: config.host,
    resource: req.path,
    authToken
  })

  return res.render('collection', {
    title: collection,
    collection,
    identifier,
    client
  })
})

/**
 * Locations
 */
router.get('/locations/:locationId', async (req, res, next) => {
  const collection = 'locations'
  const item = 'location'
  const identifier = 'locationId'
  const { authToken } = req.session
  const client = await apiClient({
    host: config.host,
    resource: req.path,
    authToken
  })

  return res.render('location', {
    title: `locations/${req.params.locationId}`,
    collection,
    identifier,
    startTime,
    item,
    client
  })
})

router.post('/locations/:locationId', async (req, res, next) => {
  const collection = 'locations'
  const item = 'location'
  const identifier = 'locationId'

  const { authToken } = req.session
  const client = await apiClient({
    host: config.host,
    resource: req.path,
    method: 'PUT',
    payload: req.body,
    authToken
  })

  return res.render('location', {
    title: `locations/${req.params.locationId}`,
    collection,
    identifier,
    item,
    client
  })
})

/**
 * Location subscription
 */

router.get('/locations/:locationId/subscriptions', async (req, res, next) => {
  const collection = 'locations'
  const item = 'location'
  const identifier = 'locationId'
  const parentId = req.params.locationId
  const { authToken } = req.session
  const client = await apiClient({
    host: config.host,
    resource: req.path,
    authToken
  })

  return res.render('location-subscriptions', {
    title: `locations/${req.params.locationId}`,
    collection,
    identifier,
    parentId,
    item,
    client
  })
})

router.post('/locations/:locationId/subscriptions', async (req, res, next) => {
  const collection = 'locations'
  const item = 'location'
  const identifier = `locationId`
  const parentId = req.params.locationId
  const { authToken } = req.session
  const client = await apiClient({
    host: config.host,
    resource: req.path,
    method: 'POST',
    payload: req.body,
    authToken
  })

  return res.render('location-subscriptions', {
    title: `locations/${req.params.locationId}`,
    collection,
    identifier,
    parentId,
    item,
    client
  })
})

/**
 * location water usage readings
 */
router.get('/locations/:locationId/readings/water-usage/:summary?', async (req, res, next) => {
  const collection = 'locations'
  const item = 'location'
  const identifier = 'locationId'
  const parentId = req.params.locationId
  const { authToken } = req.session

  const client = await apiClient({
    host: config.host,
    resource: req.url,
    authToken
  })

  return res.render('location-readings', {
    title: `locations/${req.params.locationId}`,
    collection,
    identifier,
    parentId,
    startTime,
    item,
    client
  })
})

/**
 * Subscriptions
 */

router.get('/subscriptions/:subscriptionId', async (req, res, next) => {
  const { subscriptionId } = req.params
  const collection = 'subscriptions'
  const item = 'subscription'
  const { authToken } = req.session
  const client = await apiClient({
    host: config.host,
    resource: req.path,
    authToken
  })

  return res.render('subscription', {
    title: `subscriptions/${subscriptionId}`,
    subscriptionId,
    collection,
    item,
    client
  })
})

router.post('/subscriptions/:subscriptionId', async (req, res, next) => {
  const { subscriptionId } = req.params
  const { authToken } = req.session
  const collection = 'subscriptions'
  const item = 'subscription'
  const client = await apiClient({
    host: config.host,
    resource: `/subscriptions/${subscriptionId}`,
    method: 'DELETE',
    authToken
  })

  return res.render('subscription', {
    title: `subscriptions/${subscriptionId}`,
    subscriptionId,
    collection,
    item,
    client
  })
})

module.exports = router
