'use strict'

const Stream = require('../lib/stream.js')
const { load } = require('dotenv-extended')

module.exports = {
  setup: () => {
    load({ path: `./.env.${process.env.STREAMLABS_TEST_ENV}` })
    return new Stream()
  },
  locations: [
    {
      name: 'locations',
      type: Array
    },
    {
      name: 'page',
      type: 'number'
    },
    {
      name: 'pageCount',
      type: 'number'
    },
    {
      name: 'perPage',
      type: 'number'
    },
    {
      name: 'total',
      type: 'number'
    }
  ],
  location: {
    locationId: '',
    locationName: '',
    homeAway: '',
    devices: [],
    alerts: [],
    subscriptionIds: []
  },
  alert: {
    deviceId: '',
    type: '',
    active: false,
    startTime: 0,
    detectedTime: 0,
    stopTime: 0,
    peakValue: 0,
    peakStatus: '',
    subscriptionId: '',
    locationId: ''
  },
  locationSubscriptions: {
    pageCount: 1,
    perPage: 0,
    page: 1,
    total: 1,
    subscriptions: [
      {
        subscriptionId: '',
        locationId: '',
        endpoint: '',
        status: ''
      }
    ]
  },
  subscriptionConfirmation: {
    confirmationUri: '',
    confirmationToken: ''
  },
  subscriptions: {
    pageCount: 1,
    perPage: 0,
    page: 1,
    total: 1,
    subscriptions: [
      {
        subscriptionId: '',
        locationId: '',
        endpoint: '',
        status: ''
      }
    ]
  },
  subscription: {
    subscriptionId: '',
    locationId: '',
    endpoint: '',
    status: ''
  }
}
