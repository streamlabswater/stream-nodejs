# StreamLabs Node.js Library

This is the official node.js client for the StreamLabs Developer API.

## API Documentation

See the [StreamLabs Developer API docs](https://developer.streamlabswater.com/docs/index.html)

## Install


```bash

npm i @streamlabswater/stream

```

## Usage

The package needs to configured with your accounts API Key available when you  login into your [http://my.streamlabswater.com](http://my.streamlabswater.com) account.

```javascript

const Stream = require('@streamlabswater/stream')
const stream = new Stream('YOUR_STREAMLABSWATER_API_KEY')

```

or using ES modules 
```javascript
import Stream from '@streamlabswater/stream'
const stream = new Stream('YOUR_STREAMLABSWATER_API_KEY')
```


All of the methods return Promises and use `async/wait`

### Get all Locations
Start by fetching all your [locations](https://developer.streamlabswater.com/docs/get-all-locations.html)

```javascript

const example = async () =>  {
  try {
    const locations = await stream.locations.get()
    console.log('LOCATIONS', locations)
  } catch (e) {
    console.error(e)
  }
}
```

### Get a Location
A `locationId` is required to fetch details of a [location](https://developer.streamlabswater.com/docs/get-a-location.html), water usage and for updating *homeAway*.

```javascript
// ...

const locationId = 'ae926a02...dbc8'
const location = await stream.location.get(locationId)

// ...
```

### Update a Location
Currently you can only update the *homeAway* mode of the location
When updating a location the response is always the [updated location](https://developer.streamlabswater.com/docs/update-a-location.html) details

```javascript
// ...

const locationId = 'ae926a02...dbc8'
const options = {
  homeAway: 'away'
}

const location = await stream.location.update(locationId, options)

// ...
```

### Subscribe to Location Alerts
If you choose to recieve notifications when alerts become active or end for a location, you need to provide a valid url endpoint where the StreamLabs service will send the notifications. The following methods wrap the corresponding StreamLabs api endpoints as descriped in the [Subscribe to Location Alerts section in the docs](https://developer.streamlabswater.com/docs/subscribe-to-location-alerts.html)

#### Create Subscription
```javascript
// ...

const locationId = 'ae926a02...dbc8'
const endpoint = 'https://example-endpoint.com'

const subscription = await stream.location.subscribe(locationId, endpoint)

// ...
```

#### Confirm subscription
Once you recieve the `confirmationToken` via your endpoint, update the subscription to start recieving alerts.

```javascript
// ...
const subscriptionId = '3bb2255b...2a48'
const confirmationToken = 'r3vHQ2NXpkK...uuyt'

const subscription = await stream.subscription.update(subscriptionId, confirmationToken)

// ...
```

### Get all Location Subscriptions
```javascript
// ...

const locationId = 'ae926a02...dbc8'

const subscriptions = await stream.location.subscriptions.get(locationId)

// ...
```

### Get a Subscription
```javascript
// ...

const subscriptionId = '3bb2255b...2a48'

const subscription = await stream.subscription.get(subscriptionId)

// ...
```

### Get all Subscriptions
```javascript
// ...

const subscriptions = await stream.subscriptions.get()

// ...
```

### Delete a Subscription
```javascript
// ...

const subscriptionId = '3bb2255b...2a48'

const subscription = await stream.subscription.delete(subscriptionId)

// ...
```
This method will throw an Exception if the delete fails else returns an empty body

### Get a Location’s Water Usage Summary

```javascript
// ...

const locationId = 'ae926a02...dbc8'

const waterUsageSummary = await stream.location.waterUsage.summary.get(locationId)

// ...
```

### Get a Location’s Water Usage

At the very minimum you need to provide a `startTime` for the [readings you want to retrieve](https://developer.streamlabswater.com/docs/get-water-usage.html).
```javascript
// ...

const locationId = 'ae926a02...dbc8'

/**
 * All time params should be Date Objects or ISO Formatted date strings
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
 */
const options = {
  startTime: new Date(),
  endTime: new Date(), // optional
  groupBy,
  page,
  perPage
}

const waterUsage = await stream.location.waterUsage.get(locationId, options)

// ...
```