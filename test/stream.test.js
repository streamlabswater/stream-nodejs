
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
  const res = await stream.location.get('159c3ec3-5f25-4c3f-b2e4-b65a50484e13')
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
