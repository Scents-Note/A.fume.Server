import UserDTO from './UserDTO';

const { GRADE_MANAGER } = require('../../utils/constantUtil');

class UserAuthDTO {
    isAuth: boolean;
    isAdmin: boolean;
    constructor(isAuth: boolean, isAdmin: boolean) {
        this.isAuth = isAuth;
        this.isAdmin = isAdmin;
    }

    static create(user: UserDTO) {
        return new UserAuthDTO(true, user.grade >= GRADE_MANAGER);
    }
}

export default UserAuthDTO;
