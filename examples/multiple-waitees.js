#!/usr/bin/env node

'use strict';

let waitup = require('../lib/Waitup');

let isComplete = false;

let waitees = [
  waitup({
    delay: 5000,
    for: waitee => {
      console.log('Operation is now complete.');

      isComplete = true;

      return waitee.done('Result1');
    }
  }),
  waitup({
    delay: 1000,
    for: waitee => {
      if (isComplete) {
        console.log('First operation is completed.');

        return waitee.done('Result2');
      }

      console.log('First operation not complete yet.');
    }
  })
];

console.log('Waiting on multiple waitees...');

Promise.all(waitees)
  .then(results => {
    console.log('All waitees are complete.');
    console.log(` Result #1: ${results[0]}`);
    console.log(` Result #2: ${results[1]}`);
  })
  .catch(error => {
    console.log('A problem occurred.');
  });
