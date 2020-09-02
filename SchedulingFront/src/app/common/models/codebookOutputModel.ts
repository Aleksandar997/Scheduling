export class CodebookOutputModel<T> {
    columns: Array<CodebookColumn>;
    data: Array<T>;
}

export class CodebookColumn {
    name: string;
    controlType: ControlType;
    display: boolean;
    editable: boolean;
    constructor(param: CodebookColumn) {
        this.name = param.name.firstCharToLower();
        this.controlType = param.controlType;
        this.display = param.display;
    }
}

export enum ControlType { Input, NumberInput, DateTimePicker, SelectList, Toggle, File }
