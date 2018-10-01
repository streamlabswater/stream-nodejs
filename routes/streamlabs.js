'use strict'

const express = require('express')
const router = express.Router()
const dal = require('../dal')

const currentTime = Math.round((new Date()).getTime() / 1000)
const startTime = {
  byHour: (currentTime - 86400), // 24hrs
  byDay: (currentTime - 604800), // 7 days
  byMonth: (currentTime - 7884000) // 3 months
}

router.use(function (req, res, next) {
  const { oauth } = req.session

  if (!oauth) {
    return res.redirect('/')
  }
  next()
})

router.get('/', async (req, res, next) => {
  const { oauth } = req.session
  const api = await dal({
    resource: '/hello/world',
    oauth
  })

  return res.render('hello', {
    title: 'hello',
    api
  })
})
//
router.get('/:collection', async (req, res, next) => {
  const collection = req.params.collection
  const identifier = `${collection.slice(0, -1)}Id`
  const { oauth } = req.session
  const api = await dal({
    resource: req.path,
    oauth
  })

  return res.render('collection', {
    title: collection,
    collection,
    identifier,
    api
  })
})

/**
 * Locations
 */
router.get('/locations/:locationId', async (req, res, next) => {
  const collection = 'locations'
  const item = 'location'
  const identifier = 'locationId'
  const { oauth } = req.session
  const api = await dal({
    resource: req.path,
    oauth
  })

  return res.render('location', {
    title: `locations/${req.params.locationId}`,
    collection,
    identifier,
    startTime,
    item,
    api
  })
})

router.post('/locations/:locationId', async (req, res, next) => {
  const collection = 'locations'
  const item = 'location'
  const identifier = 'locationId'

  const { oauth } = req.session
  const api = await dal({
    resource: req.path,
    method: 'PUT',
    payload: req.body,
    oauth
  })

  return res.render('location', {
    title: `locations/${req.params.locationId}`,
    collection,
    identifier,
    item,
    api
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
  const { oauth } = req.session
  const api = await dal({
    resource: req.path,
    oauth
  })

  return res.render('location-subscriptions', {
    title: `locations/${req.params.locationId}`,
    collection,
    identifier,
    parentId,
    item,
    api
  })
})

router.post('/locations/:locationId/subscriptions', async (req, res, next) => {
  const collection = 'locations'
  const item = 'location'
  const identifier = `locationId`
  const parentId = req.params.locationId
  const { oauth } = req.session
  const api = await dal({
    resource: req.path,
    method: 'POST',
    payload: req.body,
    oauth
  })

  return res.render('location-subscriptions', {
    title: `locations/${req.params.locationId}`,
    collection,
    identifier,
    parentId,
    item,
    api
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
  const { oauth } = req.session

  const api = await dal({
    resource: req.url,
    oauth
  })

  return res.render('location-readings', {
    title: `locations/${req.params.locationId}`,
    collection,
    identifier,
    parentId,
    startTime,
    item,
    api
  })
})

/**
 * Subscriptions
 */

router.get('/subscriptions/:subscriptionId', async (req, res, next) => {
  const { subscriptionId } = req.params
  const collection = 'subscriptions'
  const item = 'subscription'
  const { oauth } = req.session
  const api = await dal({
    resource: req.path,
    oauth
  })

  return res.render('subscription', {
    title: `subscriptions/${subscriptionId}`,
    subscriptionId,
    collection,
    item,
    api
  })
})

router.post('/subscriptions/:subscriptionId', async (req, res, next) => {
  const { subscriptionId } = req.params
  const { oauth } = req.session
  const collection = 'subscriptions'
  const item = 'subscription'
  const api = await dal({
    resource: `/subscriptions/${subscriptionId}`,
    method: 'DELETE',
    oauth
  })

  return res.render('subscription', {
    title: `subscriptions/${subscriptionId}`,
    subscriptionId,
    collection,
    item,
    api
  })
})

module.exports = router
