'use strict'
const { stringify } = require('query-string')
const { isDate } = require('date-fns')
const client = require('./api.client')

class StreamLabs {
  #apiKey = ''
  #host = ''

  constructor (options = {}) {
    const { host, apiKey } = options
    this.#host = host || process.env.STREAMLABSWATER_HOST
    this.#apiKey = apiKey || process.env.STREAMLABSWATER_API_KEY
  }

  location = {
    get: (locationId) => client({
      resource: `/locations/${locationId}`,
      accessToken: this.#apiKey,
      host: this.#host
    }),
    update: (locationId, { homeAway }) => client({
      method: 'PUT',
      resource: `/locations/${locationId}`,
      accessToken: this.#apiKey,
      host: this.#host,
      body: JSON.stringify({ homeAway })
    }),
    subscribe: (locationId, { endpoint }) => client({
      method: 'POST',
      resource: `/locations/${locationId}/subscriptions`,
      accessToken: this.#apiKey,
      host: this.#host,
      body: JSON.stringify({ endpoint })
    }),
    subscriptions: {
      get: (locationId) => client({
        resource: `/locations/${locationId}/subscriptions`,
        accessToken: this.#apiKey,
        host: this.#host
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

        return client({
          resource: `/locations/${locationId}/readings/water-usage?${stringify(params, { strict: true, encode: false })}`,
          accessToken: this.#apiKey,
          host: this.#host
        })
      },
      summary: {
        get: (locationId) => client({
          resource: `/locations/${locationId}/readings/water-usage/summary`,
          accessToken: this.#apiKey,
          host: this.#host
        })
      }
    }
  }

  locations = {
    get: () => client({
      resource: '/locations',
      accessToken: this.#apiKey,
      host: this.#host
    })
  }

  subscription = {
    get: (subscriptionId) => client({
      resource: `/subscriptions/${subscriptionId}`,
      accessToken: this.#apiKey,
      host: this.#host
    }),
    delete: (subscriptionId) => client({
      method: 'DELETE',
      resource: `/subscriptions/${subscriptionId}`,
      accessToken: this.#apiKey,
      host: this.#host
    })
  }

  subscriptions = {
    get: () => client({
      resource: '/subscriptions',
      accessToken: this.#apiKey,
      host: this.#host
    })
  }
}

module.exports = StreamLabs
