
import test from 'ava'
import Stream from '../lib/stream.js'
import { locations, location } from './api.mock'
import { load } from 'dotenv-extended'

function setup () {
  load({ path: './.env.test' })
  return new Stream()
}

test('successfully gets all locations', async t => {
  const stream = setup()
  const res = await stream.locations.get()
  t.notDeepEqual(res, locations)
})

test('successfully gets one location', async t => {
  const stream = setup()
  const res = await stream.location.get(process.env.STREAMLABSWATER_LOCATION_ID)
  t.notDeepEqual(res, location)
})

test('throws exception when no locationId is provided when getting one location', async t => {
  const stream = setup()
  await t.throwsAsync(async () => {
    return stream.location.get()
  }, { instanceOf: Error, code: 400 })
})

test('throws exception when invalid locationId is provided when getting one location', async t => {
  const stream = setup()
  await t.throwsAsync(async () => {
    return stream.location.get('invalid-locationid')
  }, { instanceOf: Error, code: 404 })
})

test('successfully updates the location to away ', async t => {
  const stream = setup()
  const res = await stream.location.update(process.env.STREAMLABSWATER_LOCATION_ID, { homeAway: 'away' })
  t.notDeepEqual(res, location)
})

test('successfully updates the location to home ', async t => {
  const stream = setup()
  const res = await stream.location.update(process.env.STREAMLABSWATER_LOCATION_ID, { homeAway: 'home' })
  t.notDeepEqual(res, location)
})

test('throws exception when no locationId is provided updating homeAway', async t => {
  const stream = setup()
  await t.throwsAsync(async () => {
    return stream.location.update()
  }, { instanceOf: Error, code: 400 })
})

test('throws exception when invalid locationId is provided when updating homeAway location', async t => {
  const stream = setup()
  await t.throwsAsync(async () => {
    return stream.location.update('invalid-locationid', { homeAway: 'home' })
  }, { instanceOf: Error, code: 404 })
})

test('throws exception when invalid homeAway setting is provided', async t => {
  const stream = setup()
  await t.throwsAsync(async () => {
    return stream.location.update(process.env.STREAMLABSWATER_LOCATION_ID, { homeAway: 'invalid' })
  }, { instanceOf: Error, code: 400 })
})

test('successfully gets all location subscriptions', async t => {
  const stream = setup()
  const res = await stream.location.subscriptions.get(process.env.STREAMLABSWATER_LOCATION_ID)
  t.notDeepEqual(res, locations)
})

test('successfully gets all location water usage readings', async t => {
  const stream = setup()
  const res = await stream.location.waterUsage.get(process.env.STREAMLABSWATER_LOCATION_ID, {
    startTime: new Date()
  })
  t.notDeepEqual(res, locations)
})

test('successfully gets all location water usage summary', async t => {
  const stream = setup()
  const res = await stream.location.waterUsage.summary.get(process.env.STREAMLABSWATER_LOCATION_ID)
  t.notDeepEqual(res, locations)
})

test('successfully gets all subscriptions', async t => {
  const stream = setup()
  const res = await stream.subscriptions.get()
  t.notDeepEqual(res, locations)
})

test('successfully gets one subscription ', async t => {
  const stream = setup()
  const res = await stream.subscription.get(process.env.STREAMLABSWATER_SUBSCRIPTION_ID)
  t.notDeepEqual(res, locations)
})

test('throws exception when invalid subscriptionId is provided when getting one subscription', async t => {
  const stream = setup()
  await t.throwsAsync(async () => {
    return stream.subscription.get('invalid')
  }, { instanceOf: Error, code: 404 })
})
