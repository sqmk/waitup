# Waitup - Delays and retries within Promise chains

[![NPM Version](https://badge.fury.io/js/waitup.svg)](https://www.npmjs.com/package/waitup)
[![Build Status](https://api.travis-ci.org/sqmk/waitup.svg?branch=master)](https://travis-ci.org/sqmk/waitup)

> Wait up for whatever.

Waitup provides delays and retries within Promise chains.

## Installation

Waitup was written for **Node.js 4+**.

`npm install --save waitup`

## Usage

There are several ways of using Waitup.

### Simple Delays

Waitup can be used to introduce a delay before continuing within a Promise chain.

```js
let waitup = require('waitup');

// Delay is in milliseconds, result is a Promise
waitup(5000)
  .then(() => {
    console.log('Waited approximately 5 seconds...')

    // Alternative method of configuring delay
    return waitup({
      delay: 2500
    });
  })
  .then(() => {
    console.log('Waited aproximately 2.5 seconds this time...');
  });
```

Calling waitup returns a **Promise**. The default delay is **1 second** (1000 milliseconds).

### Wait Up For Completion

Waitup can also be configured to wait for the completion of an operation. A callback
can be provided to waitup's *for* option. This callback accepts a single argument
for the *waitee*. When the operation is considered complete, return the value of
*waitee.done()*. An optional result can be provided to *waitee.done()* to forward
to the resolved promise.

```js
// Set someResult to true in approximately 5 seconds
let someResult = false;
setTimeout(() => someResult = true, 5000);

// Check every 0.5 seconds for operation to complete
waitup({
  for: waitee => {
    if (someResult === true) {
      return waitee.done('example result');
    }

    console.log('someResult not true yet');
  },
  delay: 500
})
  .then(exampleResult => {
    console.log('Waitee is done waiting!');
    console.log(`Result: ${exampleResult}`);
  });
```

Additionally, a number of retries can be configured before rejection. Set the
number of allowable retries to waitup's *retries* option.

```js

let someResult = false;

// Check every 0.5 seconds for someResult to change to true
waitup({
  for: waitee => {
    if (someResult === true) {
      return waitee.done();
    }

    console.log('someResult not true yet');
  },
  retries: 5,
  delay: 500
})
  .then(() => {
    console.log('This will never succeed...');
  })
  .catch(error => {
    console.log(error.stack);
  });
```

If *retries* are not configured, or if the *waitee.done()* value is never returned,
the application could run indefinitely.

## Examples

See more examples in the [examples](examples) directory.

## License

This software is licensed under the MIT License. [View the license](LICENSE).

Copyright © 2015 [Michael K. Squires](http://sqmk.com)
