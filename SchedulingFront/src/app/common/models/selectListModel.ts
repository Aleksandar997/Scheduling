export class SelectListModel {
    id: number;
    name: string;
    code: string;
    constructor(id: number, name: string, code: string = null) {
        this.id = id;
        this.name = name;
        this.code = code;
    }
}
