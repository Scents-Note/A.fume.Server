const { expect } = require('chai');

const ListAndCountDTO = require('../../../data/dto/ListAndCountDTO');

ListAndCountDTO.prototype.validTest = function (itemTest) {
    expect(this.count).to.be.ok;
    expect(this.rows.length).to.be.ok;
    for (const item of this.rows) {
        itemTest(item);
    }
};

ListAndCountDTO.validTest = function (itemTest) {
    expect(this.count).to.be.ok;
    expect(this.rows.length).to.be.ok;
    for (const item of this.rows) {
        itemTest.call(item);
    }
};

module.exports = ListAndCountDTO;
