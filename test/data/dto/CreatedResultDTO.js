const { expect } = require('chai');

const CreatedResultDTO = require('../../../src/data/dto/CreatedResultDTO');

CreatedResultDTO.validTest = function (createdTest) {
    expect(this.idx).to.be.ok;
    createdTest.call(this.created);
};

module.exports = CreatedResultDTO;
