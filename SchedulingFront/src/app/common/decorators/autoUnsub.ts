function AutoUnsub(obs = []) {
    return (constructor: any) => {
        const orig = constructor.prototype.ngOnDestroy;
        constructor.prototype.ngOnDestroy = function() {
            for (const prop in this) {
                if (typeof this[prop].unsubscribe === 'function' && !obs.includes(this[prop])) {
                    obs.push(this[prop]);
                }
            }
            obs.forEach(x => x.unsubscribe());
            orig.apply();
        };
    };
}
