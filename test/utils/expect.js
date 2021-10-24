'use strict';
const { expect } = require('chai');

expect.hasProperties = function (...properties) {
    properties.forEach((property) => {
        expect(this).to.be.have.property(property);
    });
    expect(Object.entries(this).length).to.be.eq(properties.length);
};

expect.isPercentage = function expectIsPercentage() {
    let sum = 0;
    Object.entries(this).forEach(([key, value]) => {
        expect(value).to.be.within(0, 100);
        sum += value;
    });
    expect(sum).to.be.eq(100);
};

expect.propertyTest = function propertyTest(validTest) {
    for (const key in this) {
        const value = this[key];
        validTest.call(value);
    }
};

module.exports = expect;
