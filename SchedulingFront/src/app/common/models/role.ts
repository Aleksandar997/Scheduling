import { Menu } from './menu';
import { Permission } from './permission';

export class Role {

    roleId: number;
    code: string;
    name: string;
    active: boolean;
    menus: Array<Menu>;
    permissions: Array<Permission>;

    constructor() {
        this.code = null;
        this.roleId = null;
        this.name = null;
        this.active = true;
        this.menus = [];
        this.permissions = [];
    }
}
