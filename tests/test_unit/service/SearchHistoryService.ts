import dotenv from 'dotenv';
import { expect } from 'chai';
import { Done } from 'mocha';

dotenv.config();

import SearchHistoryService from '@services/SearchHistoryService';
import { InquireHistoryDTO, SearchHistoryDTO } from '@dto/index';

const mockSearchHistoryDao: any = {};
const mockInquireHistoryDao: any = {};

const searchHistoryService: SearchHistoryService = new SearchHistoryService(
    mockSearchHistoryDao,
    mockInquireHistoryDao
);

describe('# SearchHistory Service Test', () => {
    describe('# reload test', () => {
        it('# success Test', (done: Done) => {
            mockInquireHistoryDao.findAll = async () => {
                return [
                    [1, 1],
                    [1, 2],
                    [1, 3],
                    [2, 1],
                    [2, 2],
                    [2, 3],
                    [2, 1],
                    [2, 2],
                    [2, 3],
                ].map((it) => new InquireHistoryDTO(it[0], it[1], ''));
            };
            let resultSearchHistories: SearchHistoryDTO[];
            mockSearchHistoryDao.bulkInsert = async (
                result: SearchHistoryDTO[]
            ) => {
                resultSearchHistories = result;
            };

            let isCallClear: boolean = false;
            mockSearchHistoryDao.clear = async () => {
                isCallClear = true;
            };

            const expected = [
                [1, 1, 1],
                [1, 2, 1],
                [1, 3, 1],
                [2, 1, 2],
                [2, 2, 2],
                [2, 3, 2],
            ].sort();

            searchHistoryService
                .reloadSearchHistory()
                .then((_: any) => {
                    expect(
                        resultSearchHistories.length,
                        'inquireHistoryList로 만들어진 SearchHistory의 개수가 일치하지 않음'
                    ).to.be.eq(expected.length);
                    expect(
                        resultSearchHistories
                            .map((it: SearchHistoryDTO) => [
                                it.userIdx,
                                it.perfumeIdx,
                                it.count,
                            ])
                            .sort(),
                        'inquireHistoryList로 만들어진 SearchHistory의 결과가 일치하지 않음'
                    ).to.be.deep.eq(expected);
                    expect(isCallClear).to.be.true;
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });
});
