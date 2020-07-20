interface String {
    firstCharToLower(): string;
    firstCharToUpper(): string;
    insertStringBetweenUpper(str: string): string;
    format(inputs: Array<any>): string;
}

String.prototype.firstCharToLower = function() {
    return this.charAt(0).toLowerCase() + this.slice(1);
};

String.prototype.firstCharToUpper = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.insertStringBetweenUpper = function(str: string) {
    let value = '';
    this.split(/(?=[A-Z])/).forEach(x => {
        value += str + x.toLowerCase();
    });
    return value;
};

String.prototype.format = function(inputs: Array<any> | any) {
    if (this === '{0}') {
        return this;
    }
    if (!Array.isArray(inputs)) {
        return this.replace(/\s*(\{[0-9]\})\s*/g, inputs);
    }
    let res = this;
    let key;
    for (key in inputs) {
        if (inputs[key]) {
            res = res.replace(new RegExp('\\s*(\\{' + key + '+\\})\\s*', 'g'), inputs[key]);
        }
    }
    return res;
};




