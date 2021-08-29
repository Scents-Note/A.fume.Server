const { expect } = require('chai');

const CreatedResultDTO = require('../../../data/dto/CreatedResultDTO');

CreatedResultDTO.prototype.validTest = function (createdTest) {
    expect(this.idx).to.be.ok;
    createdTest(this.created);
};

module.exports = CreatedResultDTO;
