import test from 'ava'
import { expect } from 'chai'
import { setup, locations, location, subscriptions, subscription, readings, summary } from './stream.schema.js'

test('get all locations', async t => {
  const stream = setup()
  const res = await stream.locations.get()
  t.pass(expect(res).to.have.all.keys(locations))
})

test('get one location', async t => {
  const stream = setup()
  const res = await stream.location.get(process.env.STREAMLABSWATER_LOCATION_ID)
  t.pass(expect(res).to.have.all.keys(location))
})

test('throw exception when no locationId is provided when getting one location', async t => {
  const stream = setup()
  await t.throwsAsync(async () => {
    return stream.location.get()
  }, { instanceOf: Error, code: 400 })
})

test('throw exception when invalid locationId is provided when getting one location', async t => {
  const stream = setup()
  await t.throwsAsync(async () => {
    return stream.location.get('invalid-locationid')
  }, { instanceOf: Error, code: 404 })
})

test('change homeAway mode to away ', async t => {
  const stream = setup()
  const res = await stream.location.update(process.env.STREAMLABSWATER_LOCATION_ID, { homeAway: 'away' })
  t.is(res.homeAway, 'away')
})

test('change homeAway mode to home ', async t => {
  const stream = setup()
  const res = await stream.location.update(process.env.STREAMLABSWATER_LOCATION_ID, { homeAway: 'home' })
  t.is(res.homeAway, 'home')
})

test('throw exception when no locationId is provided changing homeAway', async t => {
  const stream = setup()
  await t.throwsAsync(async () => {
    return stream.location.update()
  }, { instanceOf: Error, code: 400 })
})

test('throw exception when invalid locationId is provided changing homeAway', async t => {
  const stream = setup()
  await t.throwsAsync(async () => {
    return stream.location.update('invalid', { homeAway: 'home' })
  }, { instanceOf: Error, code: 404 })
})

test('throw exception when invalid homeAway setting is provided', async t => {
  const stream = setup()
  await t.throwsAsync(async () => {
    return stream.location.update(process.env.STREAMLABSWATER_LOCATION_ID, { homeAway: 'invalid' })
  }, { instanceOf: Error, code: 400 })
})

test('get location subscriptions', async t => {
  const stream = setup()
  const res = await stream.location.subscriptions.get(process.env.STREAMLABSWATER_LOCATION_ID)
  t.pass(expect(res).to.have.all.keys(subscriptions))
})

test('throw exception when no locationId is provided when getting location subscriptions', async t => {
  const stream = setup()
  await t.throwsAsync(async () => {
    return stream.location.subscriptions.get()
  }, { instanceOf: Error, code: 400 })
})

test('throw exception when invalid locationId is provided when getting location subscriptions', async t => {
  const stream = setup()
  await t.throwsAsync(async () => {
    return stream.location.subscriptions.get('invalid')
  }, { instanceOf: Error, code: 404 })
})

test('successfully gets all location water usage readings', async t => {
  const stream = setup()
  const res = await stream.location.waterUsage.get(process.env.STREAMLABSWATER_LOCATION_ID, {
    startTime: new Date()
  })
  t.pass(expect(res).to.have.all.keys(readings))
})

test('successfully gets all location water usage summary', async t => {
  const stream = setup()
  const res = await stream.location.waterUsage.summary.get(process.env.STREAMLABSWATER_LOCATION_ID)
  t.pass(expect(res).to.have.all.keys(summary))
})

test('get all subscriptions', async t => {
  const stream = setup()
  const res = await stream.subscriptions.get()
  t.pass(expect(res).to.have.all.keys(subscriptions))
})

test('get one subscription ', async t => {
  const stream = setup()
  const res = await stream.subscription.get(process.env.STREAMLABSWATER_SUBSCRIPTION_ID)
  t.pass(expect(res).to.have.all.keys(subscription))
})

test('throws exception when invalid subscriptionId is provided when getting one subscription', async t => {
  const stream = setup()
  await t.throwsAsync(async () => {
    return stream.subscription.get('invalid')
  }, { instanceOf: Error, code: 404 })
})
