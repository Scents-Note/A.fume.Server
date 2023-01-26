import { expect } from 'chai';
import { Done } from 'mocha';

import { NotMatchedError, DuplicatedEntryError } from '@errors';

import {
    GENDER_MAN,
    GENDER_WOMAN,
    GRADE_MANAGER,
    GRADE_USER,
    GRADE_SYSTEM_ADMIN,
} from '@utils/constants';

import UserDao from '@dao/UserDao';

import { CreatedResultDTO, UserDTO, UserInputDTO } from '@dto/index';

import {
    composeValidator,
    Executor,
    ParameterizedTest,
    TestSingle,
    Validator,
} from '../../internal/TestHelper';

const userDao = new UserDao();
const { User } = require('@sequelize');

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

describe('▣ UserDao', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });
    describe('▶ create Test', function () {
        function commonValidator(
            result: CreatedResultDTO<UserDTO> | null,
            err: any,
            parameter: any[]
        ) {
            expect(err).to.be.eq(null);
            expect(result).to.be.not.null;

            expect(result).instanceOf(CreatedResultDTO);
            const created: UserDTO = result!!.created;

            const input: UserInputDTO = parameter[0];
            expect(created.nickname).to.be.eq(input.nickname);
            expect(created.password).to.be.eq(input.password);
            expect(created.gender).to.be.eq(input.gender);
            expect(created.email).to.be.eq(input.email);
            expect(created.birth).to.be.eq(input.birth);
            expect(created.grade).to.be.eq(input.grade);
        }

        describe('# method: create', function () {
            new TestSingle<CreatedResultDTO<UserDTO>>(
                'common',
                userDao.create,
                [
                    MockGenerator.createUserInputDTO({
                        userIdx: null,
                    }),
                ],
                commonValidator
            ).test(it);

            new TestSingle<CreatedResultDTO<UserDTO>>(
                'duplicated email',
                userDao.create,
                [
                    MockGenerator.createUserInputDTO({
                        userIdx: null,
                    }),
                    (result: CreatedResultDTO<UserDTO>, err: any) => {
                        expect(err).instanceOf(DuplicatedEntryError);
                        expect(result).to.be.eq(null);
                    },
                ]
            ).test(it);

            new ParameterizedTest<CreatedResultDTO<UserDTO>>(
                'null of gender or birth',
                userDao.create,
                commonValidator
            )
                .addParameterAll(
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
                    ].map((it: UserInputDTO): any[] => [it])
                )
                .test(describe.skip, it);
        });
    });

    describe('▶ read Test', () => {
        function commonValidator(result: UserDTO | null, err: any, _: any[]) {
            expect(result).to.be.not.null;
            expect(err).to.be.null;

            expect(result).to.be.instanceOf(UserDTO);
            const userDto: UserDTO = result!!;
            expect(userDto.userIdx).to.be.gt(0);
            expect(userDto.nickname).to.be.ok;
            expect(userDto.email).to.be.ok;
            expect(userDto.password).to.be.ok;
            expect(userDto.gender).to.be.oneOf([GENDER_MAN, GENDER_WOMAN]);
            expect(userDto.birth).to.be.ok;
            expect(userDto.grade).to.be.oneOf([
                GRADE_USER,
                GRADE_MANAGER,
                GRADE_SYSTEM_ADMIN,
            ]);
            expect(userDto.createdAt).to.be.ok;
            expect(userDto.updatedAt).to.be.ok;
        }

        describe('# method: read', () => {
            new TestSingle<UserDTO>(
                'common',
                userDao.read,
                [{ email: 'email1@afume.com' }],
                composeValidator<UserDTO>(
                    commonValidator,
                    (result: UserDTO | null, _: any, parameter: any[]) => {
                        const condition: any = parameter[0];
                        expect(result!!.email).to.be.eq(condition.email);
                    }
                )
            ).test(it);

            new TestSingle<UserDTO>(
                'common',
                userDao.read,
                [{ email: 'email1@afume.com' }],
                composeValidator<UserDTO>(
                    commonValidator,
                    (result: UserDTO | null, _: any, parameter: any[]) => {
                        const condition: any = parameter[0];
                        expect(result!!.email).to.be.eq(condition.email);
                    }
                )
            ).test(it);

            new TestSingle<UserDTO>(
                'not matched',
                userDao.read,
                [{ email: '존재하지 않는 아이디' }],
                (result: UserDTO | null, err: any, _: any[]) => {
                    expect(result).to.be.null;
                    expect(err).instanceOf(NotMatchedError);
                }
            ).test(it);
        });

        describe('# method: readByIdx', () => {
            new TestSingle<UserDTO>(
                'common',
                userDao.readByIdx,
                [[1]],
                composeValidator<UserDTO>(
                    commonValidator,
                    (result: UserDTO | null, _: any, __: any[]) => {
                        expect(result!!.userIdx).to.be.eq(1);
                    }
                )
            ).test(it);

            new TestSingle<UserDTO>(
                'not matched',
                userDao.readByIdx,
                [[0]],
                composeValidator<UserDTO>(
                    commonValidator,
                    (result: UserDTO | null, err: any, __: any[]) => {
                        expect(result).to.be.null;
                        expect(err).instanceOf(NotMatchedError);
                    }
                )
            ).test(it);
        });
    });

    describe('▶ update Test', () => {
        function generatorExecutorAndValidator(): [
            executor: Executor<number>,
            validator: Validator<number>
        ] {
            let input: UserInputDTO;
            let original: UserDTO;
            return [
                async (...args: any[]): Promise<number> => {
                    input = args[0];
                    original = await userDao.readByIdx(input.userIdx!!);
                    return userDao.update(input);
                },
                async (result: number | null, err: any, _: any) => {
                    expect(result).to.be.not.null;
                    expect(err).to.be.null;

                    expect(result).to.be.eq(1);

                    const userDto: UserDTO = await userDao.readByIdx(
                        input.userIdx!!
                    );
                    expect(userDto.nickname).to.be.eq(
                        input.nickname != null
                            ? input.nickname
                            : original.nickname
                    );
                    expect(userDto.password).to.be.eq(
                        input.password != null
                            ? input.password
                            : original.password
                    );
                    expect(userDto.gender).to.be.eq(
                        input.gender != null ? input.gender : original.gender
                    );
                    expect(userDto.email).to.be.eq(
                        input.email != null ? input.email : original.email
                    );
                    expect(userDto.birth).to.be.eq(
                        input.birth != null ? input.birth : original.birth
                    );
                    expect(userDto.grade).to.be.eq(
                        input.grade != null ? input.grade : original.grade
                    );
                    expect(userDto.accessTime).to.be.eq(
                        input.accessTime != null
                            ? input.accessTime
                            : original.accessTime
                    );
                },
            ];
        }

        describe('# method: update', () => {
            const funcs: [
                executor: Executor<number>,
                validator: Validator<number>
            ] = generatorExecutorAndValidator();

            new TestSingle<number>(
                'common',
                funcs[0],
                [
                    {
                        userIdx: 5,
                        nickname: '수정 테스트(完)',
                        password: '변경',
                        gender: GENDER_WOMAN,
                        birth: 1995,
                        grade: 0,
                    },
                ],
                funcs[1]
            ).test(it);

            let userIdx: number = 4;
            new ParameterizedTest<number>(
                'null of gender or birth',
                funcs[0],
                funcs[1]
            )
                .addParameterAll(
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
                    ].map((it: any) => [it])
                )
                .test(describe.skip, it);
        });

        describe('# method: updateAccessTime', () => {
            new TestSingle<number>(
                'common',
                (...args: any[]): Promise<number> => {
                    const userIdx: number = args[0];
                    return new Promise(
                        (
                            resolve: (value: number) => void,
                            reject: (reason?: any) => void
                        ) => {
                            try {
                                setTimeout(async () => {
                                    const affectedRows: number =
                                        await userDao.updateAccessTime(userIdx);
                                    resolve(affectedRows);
                                }, 3000);
                            } catch (err: any) {
                                reject(err);
                            }
                        }
                    );
                },
                [[1]],
                (res: number | null, err: any, _: any[]) => {
                    expect(err).to.be.not.null;
                    expect(res).to.be.eq(1);
                }
            ).test(it);
        });

        after(async () => {
            await User.destroy({ where: { email: 'updateTest@afume.com' } });
        });
    });

    describe('▶ delete Test', () => {
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

        new TestSingle<number>(
            'common',
            userDao.delete,
            [[userIdx]],
            (res: number | null, err: any, _: any[]) => {
                expect(err).to.be.not.null;
                expect(res).to.be.eq(1);
            }
        ).test(it);

        after(async () => {
            await User.destroy({ where: { email: 'deleteTest@afume.com' } });
        });
    });

    describe.skip('# postSurvey Test', () => {
        it('# success case', (done: Done) => {
            // TODO set mongoDB test
            done();
        });
    });
});
