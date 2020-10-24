const chai = require('chai');
const should = chai.should();
const { expect } = chai;

describe('# sampleService Test', () => {
    let sampleService;

    before(() => {
        sampleService = require('../../../src/app/services/sampleService.js')();
    })

    it('# method1 Test', () => {
        sampleService.method1();
    })
    it('# method2 Test', () => {
        sampleService.method2();
    })
});