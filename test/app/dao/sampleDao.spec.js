const chai = require('chai');
const should = chai.should();
const { expect } = chai;
const sampleDao = require('../../../src/app/dao/sampleDao');

describe('# sampleDao Test', () => {
    it('# getAll Test', () => {
        expect(sampleDao.getAll()).to.have.lengthOf.above(0);
    })
    it('# getById Test', () => {
        expect(sampleDao.getById(24).id).to.equal(24);
    })
    it('# insert Test', () => {
        expect(sampleDao.insert()).to.be.true;
    })
    it('# update Test', () => {
        expect(sampleDao.update()).to.be.true;
    })
    it('# remove Test', () => {
        expect(sampleDao.remove()).to.be.true;
    })
})