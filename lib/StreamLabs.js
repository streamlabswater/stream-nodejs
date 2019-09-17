'use strict'
const { stringify } = require('query-string')
const { isDate } = require('date-fns')
const wreck = require('@hapi/wreck')

class StreamLabs {
  #apiKey = ''
  #host = ''

  #client = async function ({ resource, method, body }) {
    const url = `${this.#host}/v1${resource}`
    const options = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${this.#apiKey}`
      }
    }

    if (body) {
      options.payload = body
    }

    try {
      const res = await wreck.request(method, url, options)
      return wreck.read(res, { json: 'strict' })
    } catch (err) {
      return new TypeError(err)
    }
  }

  constructor (options = {}) {
    const { host, apiKey } = options

    if (!host || process.env.STREAMLABSWATER_HOST) {
      throw new TypeError('Missing host url')
    }

    if (!apiKey || process.env.STREAMLABSWATER_API_KEY) {
      throw new TypeError('Missing valid api key')
    }

    this.#host = host || process.env.STREAMLABSWATER_HOST
    this.#apiKey = apiKey || process.env.STREAMLABSWATER_API_KEY
  }

  location = {
    get: (locationId = '') => {
      if (!locationId) {
        throw new TypeError('Missing locationId')
      }

      return this.#client({
        resource: `/locations/${locationId}`
      })
    },
    update: (locationId, { homeAway }) => {
      if (!locationId) {
        throw new TypeError('Missing locationId')
      }

      if (homeAway !== 'home' || homeAway !== 'away') {
        throw new TypeError('Missing valid homeAway setting')
      }

      return this.#client({
        method: 'PUT',
        resource: `/locations/${locationId}`,
        body: JSON.stringify({ homeAway })
      })
    },
    subscribe: (locationId, { endpoint }) => this.#client({
      method: 'POST',
      resource: `/locations/${locationId}/subscriptions`,
      body: JSON.stringify({ endpoint })
    }),
    subscriptions: {
      get: (locationId) => this.#client({
        resource: `/locations/${locationId}/subscriptions`
      })
    },
    waterUsage: {
      get: (locationId, { startTime, endTime = new Date(), groupBy = 'hour', page = 1, perPage = 100 }) => {
        const params = {
          startTime: isDate(startTime) ? startTime.toISOString() : startTime,
          endTime: isDate(endTime) ? endTime.toISOString() : endTime,
          groupBy,
          page,
          perPage
        }

        return this.#client({
          resource: `/locations/${locationId}/readings/water-usage?${stringify(params, { strict: true, encode: false })}`,
          accessToken: this.#apiKey,
          host: this.#host
        })
      },
      summary: {
        get: (locationId) => this.#client({
          resource: `/locations/${locationId}/readings/water-usage/summary`,
          accessToken: this.#apiKey,
          host: this.#host
        })
      }
    }
  }

  locations = {
    get: (options) => this.#client({
      resource: '/locations'
    })
  }

  subscription = {
    get: (subscriptionId) => this.#client({
      resource: `/subscriptions/${subscriptionId}`
    }),
    delete: (subscriptionId) => this.#client({
      method: 'DELETE',
      resource: `/subscriptions/${subscriptionId}`
    })
  }

  subscriptions = {
    get: () => this.#client({
      resource: '/subscriptions'
    })
  }
}

module.exports = StreamLabs
