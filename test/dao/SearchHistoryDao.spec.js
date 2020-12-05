const dotenv = require('dotenv');
dotenv.config({path: './config/.env.tst'});

const chai = require('chai');
const { expect } = chai;
const searchHistoryDao = require('../../dao/SearchHistoryDao.js');
const pool = require('../../utils/db/pool.js');

describe('# searchHistoryDao Test', () => {
    describe('# create Test', () => {
        it('# success case', (done) => {
            searchHistoryDao.create(1, 1)
            .then((result) => {
                done();
            });
        });
    }); 
});
