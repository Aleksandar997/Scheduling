interface Array<T> {
    firstElement();
    lastElement();
    assignObject(init?: Array<Partial<object>>);
    // onlyUnique();
}

Array.prototype.firstElement = function() {
    if (this && this.length > 0) {
        return this[0];
    }
    return this;
};

Array.prototype.lastElement = function() {
    return this.find((v, i) => i === (this.length - 1));
};

Array.prototype.assignObject = function(init?: Array<Partial<object>>) {
    Object.assign(this, init);
};

// Array.prototype.onlyUnique = function() {
//     this.filter( _onlyUnique );
// };

// function _onlyUnique(value, index, self) {
//     return self.indexOf(value) === index;
// }
