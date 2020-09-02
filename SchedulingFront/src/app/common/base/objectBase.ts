export class ObjectBase {
    setProperties(obj) {
        Object.keys(obj).forEach(e => {
            if (obj[e] !== null) {
                this[e] = obj[e];
            }
        });
        return this;
    }
}
