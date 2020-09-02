import { Subject } from 'rxjs';

export class SubjectAdapter<T> {
    subject = new Subject<T>();
    data: any;

    next(value: T) {
        const val = Array.isArray(value) ? (value.map(x => Object.assign({}, x)) as any) as T : Object.assign({}, value) as T;
        this.data = val;
        this.subject.next(val);
    }

    appendNext<Tsingle>(value: Tsingle, id: string) {
        const val = this.getNestedObjProp(value, id);
        if (Array.isArray(this.data)) {
            if (val && val as number > 0) {
                this.data.splice(this.data.indexOf(this.data.find(x => this.getNestedObjProp(x, id) === val)), 1, Object.assign({}, value));
            } else {
                this.data.push(Object.assign({}, value));
            }
        }
        if (this.subject) {
            this.subject.next(this.data);
        }

    }

    getNestedObjProp(item, path: string) {
        const props = path.split('.');
        const firstItem = item[props.shift()];
        if (props.length > 0) {
            return this.getNestedObjProp(firstItem, props.join('.'));
        }
        return firstItem;
    }

    get = () => this.subject.asObservable();
}