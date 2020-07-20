export class Culture {
    cultureId: number;
    name: string;
    value: string;
    flag: string;
    localizationPair: any;
    active: boolean;

    constructor(name: string = null, value: string = null, flag: string = null) {
        this.name = name;
        this.value = value;
        this.flag = flag;
        this.localizationPair = [];
    }
}