#!/usr/bin/env node

'use strict';

let waitup = require('../lib/Waitup');

console.log('Waiting 5 seconds...');

waitup(5000)
  .then(() => {
    console.log('Complete!');
  });
