'use strict'

const Stream = require('../lib/stream.js')
const { load } = require('dotenv-extended')

module.exports = {
  setup: () => {
    load({ path: `./.env.${process.env.STREAMLABS_TEST_ENV}` })
    return new Stream()
  },
  locations: {
    locations: [],
    page: 0,
    perPage: 0,
    pageCount: 0,
    total: 0
  },
  location: {
    locationId: '',
    name: '',
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
  subscriptionConfirmation: {
    confirmationUri: '',
    confirmationToken: ''
  },
  subscriptions: {
    pageCount: 1,
    perPage: 0,
    page: 1,
    total: 1,
    subscriptions: []
  },
  subscription: {
    subscriptionId: '',
    locationId: '',
    endpoint: '',
    status: ''
  },
  readings: {
    page: 0,
    pageCount: 0,
    perPage: 0,
    readings: [],
    total: 0,
    units: ''
  },
  summary: {
    thisMonth: 0,
    thisYear: 0,
    today: 0,
    units: ''
  }
}
