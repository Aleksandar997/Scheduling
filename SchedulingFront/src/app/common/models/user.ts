import { Menu } from './menu';
import { Role } from './role';
import { Company } from './company';
import { Employee } from 'src/app/models/employee';
import { BasePaging } from './basePaging';
import { ChartMetaData } from './chartMetaData';
import { Theme } from '../theme/themeModel';

export class User {
    userId: number;
    userName: string;
    password: string;
    passwordRepeat: string;
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
    employeeId: number;
    isEmployee: boolean;
    employee: Employee;
    sysDTCreated: Date;
    isUserSave = false;
    roleIds = new Array<number>();
    roleNames: string;
    chartMetaData: Array<ChartMetaData>;
    theme: Theme;
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

export class UserPaging extends BasePaging {
    firstName: string;
    lastName: string;
    identificationNumber: string;
}
