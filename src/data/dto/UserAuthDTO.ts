import { GRADE_MANAGER } from '@utils/constants';

import { UserDTO } from '@dto/UserDTO';

class UserAuthDTO {
    isAuth: boolean;
    isAdmin: boolean;
    constructor(isAuth: boolean, isAdmin: boolean) {
        this.isAuth = isAuth;
        this.isAdmin = isAdmin;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static create(user: UserDTO) {
        return new UserAuthDTO(true, user.grade >= GRADE_MANAGER);
    }
}

export { UserAuthDTO };
