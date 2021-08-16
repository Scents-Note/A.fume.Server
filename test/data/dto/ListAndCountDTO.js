const { expect } = require('chai');

const ListAndCountDTO = require('../../../data/dto/ListAndCountDTO');

module.exports.create = (itemTest) => {
    ListAndCountDTO.prototype.validTest = function () {
        expect(this.count).to.be.ok;
        expect(this.rows.length).to.be.ok;
        for (const item of this.rows) {
            itemTest(item);
        }
    };
    return ListAndCountDTO;
};
