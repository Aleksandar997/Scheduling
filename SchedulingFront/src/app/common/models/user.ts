import { Menu } from './menu';
import { Role } from './role';
import { Company } from './company';

export class User {
    userId: number;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string;
    newImage: string;
    imagePath: string;
    imageThumbPath: string;
    menus: Array<Menu>;
    code: string;
    active: boolean;
    roles: Role[];
    isAdmin: boolean;
    permissions;
    company: Company;
    constructor() {
        this.userId = 0;
        this.code = null;
        this.email = null;
        this.firstName = null;
        this.lastName = null;
        this.userName = null;
        this.password = null;
        this.roles = [];
        this.permissions = [];
        this.menus = [];
    }
}

export class PasswordModel {
    userName: string;
    password: string;
    newPassword: string;
    newPasswordRepeat: string;
    email: string;
}

export class UserCredentials {
    userName: string;
    email: string;
}
