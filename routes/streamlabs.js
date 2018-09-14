'use strict'

const express = require('express')
const router = express.Router()
const dal = require('../dal')

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

  console.log('DATA', dal)

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

router.get('/:collection/:itemId', async (req, res, next) => {
  const collection = req.params.collection
  const item = collection.slice(0, -1)
  const identifier = `${item}Id`
  const { oauth } = req.session
  const api = await dal({
    resource: req.path,
    oauth
  })

  return res.render('item', {
    title: `${collection}/${req.params.itemId}`,
    collection,
    identifier,
    item,
    api
  })
})

router.post('/:collection/:itemId', async (req, res, next) => {
  const collection = req.params.collection
  const item = collection.slice(0, -1)
  const identifier = `${item}Id`

  const { oauth } = req.session
  const api = await dal({
    resource: req.path,
    method: 'PUT',
    payload: req.body,
    oauth
  })

  return res.render('item', {
    title: `${collection}/${req.params.itemId}`,
    collection,
    identifier,
    item,
    api
  })
})


module.exports = router
