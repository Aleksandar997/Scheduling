
export class Permission {

    permissionId: number;
    code: string;
    name: string;
    active: boolean;
    parentId: number;
    selected: boolean;

    children: Array<Permission>;
    constructor() {
        this.children = new Array<Permission>();
    }
}
