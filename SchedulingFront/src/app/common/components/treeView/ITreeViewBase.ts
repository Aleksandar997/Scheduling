export interface ITreeViewBase<T> {
    children: Array<T>;
    parentId: number;
    active?: boolean;
    allowSave?: boolean;
    dirty?: boolean;
    isBoolean?: boolean;
}

export class TreeViewConfig {
    idPropName: string;
    parentPropName: string;
    childrenPropName: string;
    disableInput: boolean;
    disableCheckBox: boolean;
    labels: string;
    valueProperty: string;
    constructor(idPropName: string = 'id', parentPropName: string = 'parentId',
                childrenPropName: string = 'children', disableInput: boolean = true, disableCheckBox: boolean = false) {
        this.idPropName = idPropName;
        this.parentPropName = parentPropName;
        this.childrenPropName = childrenPropName;
        this.disableInput = disableInput;
        this.disableCheckBox = disableCheckBox;
        this.labels = null;
        this.valueProperty = 'name';
    }

    // setLabelsAndValueName(labels: string, valueProperty: string) {
    //     this.labels = labels;
    //     this.valueProperty = valueProperty;
    // }
}
