import { expect } from 'chai';
import dotenv from 'dotenv';
import { Done } from 'mocha';
dotenv.config();

import {
    NotMatchedError,
    DuplicatedEntryError,
    UnExpectedError,
} from '@errors';

import { GENDER_WOMAN } from '@utils/constants';

import UserDao from '@dao/UserDao';

import { CreatedResultDTO, UserDTO, UserInputDTO } from '@dto/index';

import UserMockHelper from '../mock_helper/UserMockHelper';

const userDao = new UserDao();
const { User } = require('@sequelize');

const NO_OP = () => {};

class MockGenerator {
    static _userIdx: number = 6;

    static createUserInputDTO(json: any = {}): UserInputDTO {
        const userIdx: number = json.userIdx ? json.userIdx : this._userIdx++;
        const expected: any = {
            userIdx,
            nickname: `user${userIdx}`,
            password: 'hashed',
            gender: 1,
            email: `user${userIdx}@scents.note.com`,
            birth: '1995',
            grade: 1,
        };
        return UserInputDTO.createByJson(Object.assign(expected, json));
    }
}

describe('# userDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });
    describe('# create Test', () => {
        async function createCommonTest(input: UserInputDTO) {
            const result: CreatedResultDTO<UserDTO> = await userDao.create(
                input
            );
            expect(result).instanceOf(CreatedResultDTO);
            const created: UserDTO = result.created;
            expect(created.nickname).to.be.eq(input.nickname);
            expect(created.password).to.be.eq(input.password);
            expect(created.gender).to.be.eq(input.gender);
            expect(created.email).to.be.eq(input.email);
            expect(created.birth).to.be.eq(input.birth);
            expect(created.grade).to.be.eq(input.grade);
        }

        before(async () => {
            await User.destroy({ where: { email: 'createTest@afume.com' } });
        });
        it('# success case', async () => {
            const input: UserInputDTO = MockGenerator.createUserInputDTO({
                userIdx: null,
            });
            try {
                await createCommonTest(input);
            } catch (err: any) {
                throw err;
            }
        });
        it('# DuplicatedEntryError case', async () => {
            const input: UserInputDTO = MockGenerator.createUserInputDTO({
                email: 'email1@afume.com',
                userIdx: null,
            });
            try {
                await createCommonTest(input);
                throw new UnExpectedError(DuplicatedEntryError);
            } catch (err: any) {
                expect(err).instanceOf(DuplicatedEntryError);
            }
        });
        after(async () => {
            await User.destroy({ where: { email: 'createTest@afume.com' } });
        });
    });

    describe(' # read Test', () => {
        async function readCommonTest(
            method: (...args: any) => Promise<UserDTO>,
            args: any[],
            validator: (userDTO: UserDTO) => void = NO_OP
        ) {
            const result: UserDTO = await method(...args);
            UserMockHelper.validTest.call(result);
            validator(result);
        }
        describe('# readByEmail Test', () => {
            it('# success case', async () => {
                try {
                    await readCommonTest(userDao.read, [
                        { email: 'email1@afume.com' },
                    ]);
                } catch (err: any) {
                    throw err;
                }
            });
            it('# Not Matched case', async () => {
                try {
                    await readCommonTest(userDao.read, [
                        { email: '존재하지 않는 아이디' },
                    ]);
                    throw new UnExpectedError(NotMatchedError);
                } catch (err) {
                    expect(err).instanceOf(NotMatchedError);
                }
            });
        });
        describe('# readByIdx Test', () => {
            it('# success case', async () => {
                try {
                    await readCommonTest(
                        userDao.readByIdx,
                        [1],
                        (result: UserDTO) => {
                            expect(result.userIdx).to.be.eq(1);
                        }
                    );
                } catch (err: any) {
                    throw err;
                }
            });
            it('# Not Matched case', async () => {
                try {
                    await readCommonTest(
                        userDao.readByIdx,
                        [0],
                        (result: UserDTO) => {
                            expect(result.userIdx).to.be.eq(1);
                        }
                    );
                    throw new UnExpectedError(NotMatchedError);
                } catch (err: any) {
                    expect(err).instanceOf(NotMatchedError);
                }
            });
        });
    });

    describe('# update Test', () => {
        async function updateCommonTest(input: UserInputDTO) {
            const original: UserDTO = await userDao.readByIdx(input.userIdx!!);
            const affectedRows: number = await userDao.update(input);
            expect(affectedRows).to.be.eq(1);
            const result: UserDTO = await userDao.readByIdx(input.userIdx!!);
            expect(result.nickname).to.be.eq(
                input.nickname != null ? input.nickname : original.nickname
            );
            expect(result.password).to.be.eq(
                input.password != null ? input.password : original.password
            );
            expect(result.gender).to.be.eq(
                input.gender != null ? input.gender : original.gender
            );
            expect(result.email).to.be.eq(
                input.email != null ? input.email : original.email
            );
            expect(result.birth).to.be.eq(
                input.birth != null ? input.birth : original.birth
            );
            expect(result.grade).to.be.eq(
                input.grade != null ? input.grade : original.grade
            );
            expect(result.accessTime).to.be.eq(
                input.accessTime != null
                    ? input.accessTime
                    : original.accessTime
            );
        }

        let userIdx: number = 0;
        before(async () => {
            userIdx = (
                await userDao.create(
                    MockGenerator.createUserInputDTO({
                        email: 'updateTest@afume.com',
                    })
                )
            ).idx;
        });
        it('# success case', async () => {
            try {
                await updateCommonTest({
                    userIdx,
                    nickname: '수정 테스트(完)',
                    password: '변경',
                    gender: GENDER_WOMAN,
                    birth: 1995,
                    grade: 0,
                });
            } catch (err: any) {
                throw err;
            }
        });
        it('# updateAccessTime success case', (done: Done) => {
            setTimeout(() => {
                userDao
                    .updateAccessTime(1)
                    .then((result: number) => {
                        expect(result).eq(1);
                        done();
                    })
                    .catch((err: Error) => done(err));
            }, 1000);
        });
        after(async () => {
            await User.destroy({ where: { email: 'updateTest@afume.com' } });
        });
    });

    describe('# delete Test', () => {
        let userIdx: number = 0;
        before(async () => {
            userIdx = (
                await userDao.create(
                    MockGenerator.createUserInputDTO({
                        email: 'deleteTest@afume.com',
                    })
                )
            ).idx;
        });
        describe('# delete Test', () => {
            it('# success case', (done: Done) => {
                userDao
                    .delete(userIdx)
                    .then((result: number) => {
                        expect(result).eq(1);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });
        after(async () => {
            await User.destroy({ where: { email: 'deleteTest@afume.com' } });
        });
    });

    describe('# postSurvey Test', () => {
        it('# success case', (done: Done) => {
            // TODO set mongoDB test
            done();
        });
    });
});
