'use strict';

let chai           = require('chai');
let expect         = require('chai').expect;
let chaiAsPromised = require('chai-as-promised');
let waitup         = require('../lib/Waitup');

chai.use(chaiAsPromised);

describe('Waitup', () => {
  describe('()', () => {
    it('should return a Promise', () => {
      expect(waitup()).to.be.an.instanceof(Promise);
    });
  });

  describe('constructor', () => {
    it('should default delay option to 1000 milliseconds', () => {
      let waitee = new waitup.Waitee;

      expect(waitee.options.delay).to.be.equal(1000);
    });

    it('should default for and retries options to null', () => {
      let waitee = new waitup.Waitee;

      expect(waitee.options.for).to.be.equal(null);
      expect(waitee.options.retries).to.be.equal(null);
    });

    it('should set options', () => {
      let options = {
        for: () => {},
        delay: 500,
        retries: 1
      };

      let waitee = new waitup.Waitee(options);

      expect(waitee.options.for).to.be.equal(options.for);
      expect(waitee.options.delay).to.be.equal(options.delay);
      expect(waitee.options.retries).to.be.equal(options.retries);
    });
  });

  describe('wait', () => {
    it('should return a Promise', () => {
      let waitee = new waitup.Waitee;

      expect(waitee.wait()).to.be.an.instanceof(Promise);
    });
  });

  describe('try', () => {
    it('should eventually resolve via simple delay', () => {
      let waitee = new waitup.Waitee(10);

      return expect(waitee.wait()).to.eventually.be.fulfilled;
    });

    it('should eventually resolve with a result', () => {
      let result = 'whatever';
      let waitee = new waitup.Waitee({
        for: waitee => {
          return waitee.done(result);
        },
        delay: 10
      });

      return expect(waitee.wait()).to.eventually.equal(result);
    });
  });

  describe('checkRetries', () => {
    it('should throw an exception when retries exceeded', () => {
      let waitee = new waitup.Waitee({
        retries: 1
      });

      waitee.tries = 1;

      expect(() => waitee.checkTries()).to.throw(Error);
    });

    it('should not throw an exception when retries are not exceeded', () => {
      let waitee = new waitup.Waitee({
        retries: 1
      });

      expect(() => waitee.checkTries()).to.not.throw(Error);
    });
  });

  describe('done', () => {
    it('should return a Symbol', () => {
      let waitee = new waitup.Waitee;

      expect(waitee.done()).to.be.a('symbol');
    });
  });
});
