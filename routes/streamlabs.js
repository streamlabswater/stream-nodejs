'use strict'

const express = require('express')
const router = express.Router()
const api = require('../api')

router.get('/', api({ resource: '/hello/world' }), (req, res, next) => {
  const { payload } = res
  return res.render('hello', {
    title: 'hello',
    payload
  })
})

router.get('/:collection', api(), (req, res, next) => {
  const { payload } = res
  const collection = req.params.collection
  const identifier = `${collection.slice(0, -1)}Id`

  return res.render('collection', {
    title: collection,
    collection,
    identifier,
    payload
  })
})

router.get('/:collection/:itemId', api(), (req, res, next) => {
  const { payload } = res
  const collection = req.params.collection
  const identifier = `${collection.slice(0, -1)}Id`

  return res.render('item', {
    title: `${collection}/${req.params.itemId}`,
    collection,
    identifier,
    payload
  })
})

module.exports = router
