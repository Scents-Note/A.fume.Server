import { logger } from '@modules/winston';

import { UserInputRequest } from '@request/user';

import { InvalidInputError } from '@src/utils/errors/errors';
import { GenderMap, Gender, Grade, GradeMap } from '@utils/enumType';
import { GRADE_USER } from '@utils/constants';

const LOG_TAG: string = '[data/UserInputDTO]';

class UserInputDTO {
    userIdx?: number;
    nickname?: string;
    password?: string;
    gender?: Gender;
    email?: string;
    birth?: number;
    grade?: Grade;
    accessTime?: string;
    constructor(
        userIdx?: number,
        nickname?: string,
        password?: string,
        gender?: Gender,
        email?: string,
        birth?: number,
        grade?: Grade,
        accessTime?: string
    ) {
        this.userIdx = userIdx;
        this.nickname = nickname;
        this.password = password;
        this.gender = gender;
        this.email = email;
        this.birth = birth;
        this.grade = grade;
        this.accessTime = accessTime;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByRequest(
        userIdx: number | undefined,
        request: UserInputRequest
    ): UserInputDTO {
        let genderCode: any = undefined;
        if (request.gender) {
            if (GenderMap[request.gender] == undefined) {
                logger.debug(`${LOG_TAG} invalid gender: ${request.gender}`);
                throw new InvalidInputError();
            }
            genderCode = GenderMap[request.gender];
        }
        let gradeCode: number = GRADE_USER;
        if (request.grade) {
            if (GradeMap[request.grade] == undefined) {
                logger.debug(`${LOG_TAG} invalid grade: ${request.grade}`);
                throw new InvalidInputError();
            }
            gradeCode = GradeMap[request.grade];
        }

        return new UserInputDTO(
            userIdx,
            request.nickname,
            request.password,
            genderCode,
            request.email,
            request.birth,
            gradeCode,
            undefined
        );
    }
}

export { UserInputDTO };
