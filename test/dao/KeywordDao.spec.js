const dotenv = require('dotenv');
dotenv.config({path: './config/.env.test'})

const keywordDao = require('../../dao/KeywordDao')
const { expect } = require('chai');
const { sequelize } = require('../../models');

describe('# KeywordDao Test', () => {
  before(async function () {
    await require('./common/presets.js')(this);
});
  describe('# readAll Test', () => {
    it('# success case', (done) => {
      keywordDao
        .readAll(1,10)
        .then((result) => {
          expect(result.rows.length).gt(0)
          done()
        }).catch((err) => done(err))
    })
  })

  describe('# readAllOfPerfume Test', () => {
    it('# success case', (done) => {
      keywordDao
        .readAllOfPerfume(1)
        .then((result) => {
          expect(result.length).gt(0)
          done()
        }).catch((err) => done(err))
    })
  })
})