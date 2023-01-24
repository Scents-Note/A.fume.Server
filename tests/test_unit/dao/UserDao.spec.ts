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

        describe('# case: common', () => {
            [
                MockGenerator.createUserInputDTO({
                    userIdx: null,
                }),
            ].forEach((input: UserInputDTO, index: number) => {
                it(`# P${index + 1}`, async () => {
                    try {
                        await createCommonTest(input);
                    } catch (err: any) {
                        throw err;
                    }
                });
            });
        });

        it('# case: duplicated email', async () => {
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

        // TODO implements case null
        describe.skip('# case: null of gender or birth', () => {
            [
                MockGenerator.createUserInputDTO({
                    userIdx: null,
                    gender: null,
                }),
                MockGenerator.createUserInputDTO({
                    userIdx: null,
                    birth: null,
                }),
                MockGenerator.createUserInputDTO({
                    userIdx: null,
                    gender: null,
                    birth: null,
                }),
                MockGenerator.createUserInputDTO({
                    userIdx: null,
                    gender: undefined,
                }),
                MockGenerator.createUserInputDTO({
                    userIdx: null,
                    birth: undefined,
                }),
                MockGenerator.createUserInputDTO({
                    userIdx: null,
                    gender: undefined,
                    birth: undefined,
                }),
            ].forEach((input: UserInputDTO, index: number) => {
                it(`# P${index + 1}`, async () => {
                    try {
                        await createCommonTest(input);
                    } catch (err: any) {
                        throw err;
                    }
                });
            });
        });

        after(async () => {
            await User.destroy({ where: { email: 'createTest@afume.com' } });
        });
    });

    describe(' # read Test', () => {
        async function readCommonTest(
            method: any,
            validator: (userDTO: UserDTO) => void = NO_OP
        ) {
            const result: UserDTO = await method.call(userDao);
            UserMockHelper.validTest.call(result);
            validator(result);
        }

        describe('# case: common', () => {
            [userDao.read.bind(null, { email: 'email1@afume.com' })].forEach(
                (testSet: any, index: number) => {
                    it(`# P${index + 1}`, async () => {
                        try {
                            await readCommonTest(testSet);
                        } catch (err: any) {
                            throw err;
                        }
                    });
                }
            );

            it('# case: Not Matched', async () => {
                try {
                    await readCommonTest(
                        userDao.read.bind(null, {
                            email: '존재하지 않는 아이디',
                        })
                    );
                    throw new UnExpectedError(NotMatchedError);
                } catch (err) {
                    expect(err).instanceOf(NotMatchedError);
                }
            });
        });

        describe('# readByIdx Test', () => {
            it('# case: common', async () => {
                try {
                    await readCommonTest(
                        userDao.readByIdx.bind(null, 1),
                        (result: UserDTO) => {
                            expect(result.userIdx).to.be.eq(1);
                        }
                    );
                } catch (err: any) {
                    throw err;
                }
            });
            it('# case: Not Matched', async () => {
                try {
                    await readCommonTest(
                        userDao.readByIdx.bind(null, 0),
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

        describe('# case: common', () => {
            let userIdx: number = 5;
            [
                {
                    userIdx,
                    nickname: '수정 테스트(完)',
                    password: '변경',
                    gender: GENDER_WOMAN,
                    birth: 1995,
                    grade: 0,
                },
            ].forEach((input: any, index: number) => {
                it(`# P${index + 1}`, async () => {
                    try {
                        await updateCommonTest(input);
                    } catch (err: any) {
                        throw err;
                    }
                });
            });
        });

        describe('# case: null of gender or birth', () => {
            let userIdx: number = 4;

            [
                {
                    userIdx,
                    birth: null,
                },
                {
                    userIdx,
                    gender: null,
                },
                {
                    userIdx,
                    birth: null,
                    gender: null,
                },
                {
                    userIdx,
                    birth: undefined,
                },
                {
                    userIdx,
                    gender: undefined,
                },
                {
                    userIdx,
                    birth: undefined,
                    gender: undefined,
                },
            ].forEach((input: any, index: number) => {
                it(`# P${index + 1}`, async () => {
                    try {
                        await updateCommonTest(input);
                    } catch (err: any) {
                        throw err;
                    }
                });
            });
        });
        after(async () => {
            await User.destroy({ where: { email: 'updateTest@afume.com' } });
        });
    });

    describe('# updateAccessTime Test', () => {
        it('# case: success', () => {
            setTimeout(async () => {
                try {
                    const userIdx: number = 1;
                    const affectedRows: number = await userDao.updateAccessTime(
                        userIdx
                    );
                    expect(affectedRows).to.be.eq(1);
                } catch (err: any) {
                    throw err;
                }
            }, 3000);
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

        it('# case: common', async () => {
            try {
                const affectedRows: number = await userDao.delete(userIdx);
                expect(affectedRows).to.be.eq(1);
            } catch (err: any) {
                throw err;
            }
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
