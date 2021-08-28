const { expect } = require('chai');

const ListAndCountDTO = require('../../../data/dto/ListAndCountDTO');

module.exports.create = (itemTest) => {
    ListAndCountDTO.prototype.validTest = function () {
        expect(this.count).to.be.ok;
        this.rows.forEach((item) => {
            itemTest(item);
        });
    };
    return ListAndCountDTO;
};
