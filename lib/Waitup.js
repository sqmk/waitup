'use strict';

let util = require('util');

const DEFAULT_OPTIONS = {
  delay:   1000,
  for:     null,
  retries: null,
}

const WAITEE_SYMBOL = Symbol();

/**
 * Waitee
 *
 * Waitee object
 */
class Waitee {
  /**
   * Constructor
   *
   * @param {Object} options Options (optional)
   */
  constructor(options) {
    this.options = Object.assign(
      {},
      DEFAULT_OPTIONS,
      util.isNumber(options) ? {delay: options} : options
    );

    this[WAITEE_SYMBOL] = Symbol();
    this.tries          = 0;
    this.result         = null;
  }

  /**
   * Start waiting
   *
   * @return {Promise} Promise for chaining
   */
  wait() {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject  = reject;

      this.try();
    });
  }

  /**
   * Try waiting for done
   */
  try() {
    this.checkTries();

    setTimeout(
      () => {
        ++this.tries;

        // Immediately complete if no 'for' option
        if (!util.isFunction(this.options.for)) {
          return this.complete(true);
        }

        if (this.options.for(this) === this[WAITEE_SYMBOL]) {
          return this.complete();
        }

        this.try();
      },
      this.options.delay
    );
  }

  /**
   * Check retries
   */
  checkTries() {
    if (!this.options.retries) {
      return;
    }

    if (this.tries >= this.options.retries) {
      throw new Error('Retries exceeded');
    }
  }

  /**
   * Done waiting
   *
   * @param {mixed} result Result (optional)
   *
   * @return {Symbol} Symbol
   */
  done(result) {
    this.result = result;

    return this[WAITEE_SYMBOL];
  }

  /**
   * Resolve the promise
   */
  complete() {
    this.resolve(this.result);
  }
}

/**
 * Instantiate a new waitee
 *
 * @param {mixed} options Object with options, or int for simple delay
 *
 * @return {Promise} Promise for chaining
 */
function waitup(options) {
  let waitee = new Waitee(options);

  return waitee.wait();
}

// Expose Waitee class
waitup.Waitee = Waitee;

module.exports = waitup;
