'use strict'

module.exports = {
  locations: {
    locations: [],
    page: 0,
    pageCount: 0,
    perPage: 0,
    total: 0
  },
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
