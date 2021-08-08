const { expect } = require('chai');

const CreatedResultDTO = require('../../../data/dto/CreatedResultDTO');

module.exports.create = (createdTest) => {
    CreatedResultDTO.prototype.validTest = function () {
        expect(this.idx).to.be.ok;
        createdTest(this.created);
    };
    return CreatedResultDTO;
};
