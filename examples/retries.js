#!/usr/bin/env node

'use strict';

let waitup = require('../lib/Waitup');

console.log('Waiting until 3 tries are exceeded...');

waitup({
  for: waitee => {
    console.log(`Try #${waitee.tries}...`);
  },
  retries: 3
})
  .then(() => {
    console.log('This should never pass...');
  })
  .catch(error => {
    console.log(error.stack);
  })
