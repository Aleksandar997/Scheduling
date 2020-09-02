import { Permission } from './permission';

export class Menu {
    menuId: number;
    code: string;
    name: string;
    image: string;
    url: string;
    sort: number;
    active: boolean;
    parentMenuId: number;
    clicked: boolean;
    children: Array<Menu> = new Array<Menu>();
    defaultPermissions: Array<Permission>;
    notificationCount: number;
    expanded: boolean;
    constructor(menu: Menu = null) {
        if (menu) {
            Object.assign(this, menu);
        }
        this.parentMenuId = null;
        this.expanded = false;
        this.clicked = false;
    }

    static roleSaveInit(menuId: number, active: boolean) {
        const menu = new Menu();
        menu.menuId = menuId;
        menu.active = active;
        return menu;
    }
}
