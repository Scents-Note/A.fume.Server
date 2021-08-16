const { expect } = require('chai');

const ListAndCountDTO = require('../../../data/dto/ListAndCountDTO');

ListAndCountDTO.prototype.validTest = function (itemTest) {
    expect(this.count).to.be.ok;
    expect(this.rows.length).to.be.ok;
    for (const item of this.rows) {
        itemTest(item);
    }
};

module.exports = ListAndCountDTO;
