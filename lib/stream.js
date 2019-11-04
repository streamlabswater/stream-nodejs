'use strict'
const https = require('https')
const path = require('path')
const { stringify } = require('query-string')
const { isDate } = require('date-fns')

class Stream {
  #host = ''
  #apiKey =''
  #client = function ({ resource, method = 'GET' }, body) {
    return new Promise((resolve, reject) => {
      const req = https.request({
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${this.#apiKey}`
        },
        method,
        host: new URL(this.#host).host,
        path: path.join('/v1', resource)
      }, (res) => {
        let payload = ''
        res.on('data', (chunk) => {
          payload += chunk
        })

        res.on('end', function responseOnEnd () {
          const { statusCode: code, statusMessage: message } = res
          switch (code) {
            case 200:
              return resolve(JSON.parse(payload))
            case 201:
              return resolve()
            default:
              return reject(new StreamError({ code, error: message, message: JSON.parse(payload).message }))
          }
        })
      })

      if (body) {
        req.write(JSON.stringify(body))
      }
      req.on('error', function requestOnError (err) { return reject(err) })
      req.end()
    })
  }

  constructor (options = {}) {
    const { host = process.env.STREAMLABSWATER_HOST, apiKey = process.env.STREAMLABSWATER_API_KEY } = options

    if (!apiKey) {
      throw new StreamError({ code: 401, error: 'Unauthorized', message: 'apiKey is required' })
    }

    this.#host = host || 'https://api.streamlabswater.com'
    this.#apiKey = apiKey
  }

  location = {
    get: (locationId = '') => {
      if (!locationId) {
        throw new StreamError({ code: 400, error: 'Bad Request', message: 'locationid is required' })
      }

      return this.#client({
        resource: `/locations/${locationId}`
      })
    },
    update: (locationId, params = {}) => {
      const { homeAway } = params
      const modes = ['home', 'away']
      if (!locationId) {
        throw new StreamError({ code: 400, error: 'Bad Request', message: 'locationId is required' })
      }

      if (modes.indexOf(homeAway) === -1) {
        throw new StreamError({ code: 400, error: 'Bad Request', message: 'Invalid homeAway setting' })
      }

      return this.#client({
        method: 'PUT',
        resource: `/locations/${locationId}`
      }, params)
    },
    subscribe: (locationId, endpoint) => {
      if (!locationId) {
        throw new StreamError({ code: 400, error: 'Bad Request', message: 'locationId is required' })
      }

      if (!endpoint) {
        throw new StreamError({ code: 400, error: 'Bad Request', message: 'endpoint is required' })
      }

      this.#client({
        method: 'POST',
        resource: `/locations/${locationId}/subscriptions`
      }, { endpoint })
    },
    subscriptions: {
      get: (locationId) => {
        if (!locationId) {
          throw new StreamError({ code: 400, error: 'Bad Request', message: 'locationId is required' })
        }
        return this.#client({
          resource: `/locations/${locationId}/subscriptions`
        })
      }
    },
    waterUsage: {
      get: (locationId, params) => {
        const { startTime, endTime = new Date(), groupBy = 'hour', page = 1, perPage = 100 } = params

        if (!locationId) {
          throw new StreamError({ code: 400, error: 'Bad Request', message: 'locationId is required' })
        }

        if (!startTime) {
          throw new StreamError({ code: 400, error: 'Bad Request', message: 'Missing startTime param' })
        }

        const queryParams = {
          startTime: isDate(startTime) ? startTime.toISOString() : startTime,
          endTime: isDate(endTime) ? endTime.toISOString() : endTime,
          groupBy,
          page,
          perPage
        }

        return this.#client({
          resource: `/locations/${locationId}/readings/water-usage?${stringify(queryParams, { strict: true, encode: false })}`
        })
      },
      summary: {
        get: (locationId) => {
          if (!locationId) {
            throw new StreamError({ code: 400, error: 'Bad Request', message: 'locationId is required' })
          }
          return this.#client({
            resource: `/locations/${locationId}/readings/water-usage/summary`
          })
        }
      }
    }
  }

  locations = {
    get: (options) => this.#client({
      resource: '/locations'
    })
  }

  subscription = {
    get: (subscriptionId) => {
      if (!subscriptionId) {
        throw new StreamError({ code: 400, error: 'Bad Request', message: 'Missing subscriptionId' })
      }
      return this.#client({
        resource: `/subscriptions/${subscriptionId}`
      })
    },
    update: (subscriptionId, confirmationToken) => {
      if (!subscriptionId) {
        throw new StreamError({ code: 400, error: 'Bad Request', message: 'Missing subscriptionId' })
      }
      if (!confirmationToken) {
        throw new StreamError({ code: 400, error: 'Bad Request', message: 'Missing confirmationToken' })
      }
      return this.#client({
        resource: `/subscriptions/${subscriptionId}/confirm?confirmationToken${confirmationToken}`
      })
    },
    delete: (subscriptionId) => {
      if (!subscriptionId) {
        throw new StreamError({ code: 400, error: 'Bad Request', message: 'Missing subscriptionId' })
      }
      this.#client({
        method: 'DELETE',
        resource: `/subscriptions/${subscriptionId}`
      })
    }
  }

  subscriptions = {
    get: () => this.#client({
      resource: '/subscriptions'
    })
  }
}

module.exports = Stream

class StreamError extends Error {
  constructor ({ code, error, message }) {
    super(`${code} ${error} - ${message}`)
    this.code = code
    Error.captureStackTrace(this, StreamError)
  }
}
