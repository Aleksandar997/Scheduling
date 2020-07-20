import { LocalData } from '../data/localData';
import { Subject, BehaviorSubject } from 'rxjs';

export class SubjectCompanyModel<T> {
    subject = new Map<string, Subject<T>>();
     data = new Map<string, T>();

    next(value: T) {
        const company = LocalData.getCompany();
        const val = Array.isArray(value) ? (value.map(x => Object.assign({}, x)) as any) as T : Object.assign({}, value) as T;
        this.data.set(company, val);
        const companySub = this.subject.get(company);
        if (!companySub) {
            return;
        }
        companySub.next(val);
    }

    appendNext<Tsingle>(value: Tsingle, id: string) {
        const company = LocalData.getCompany();
        const data: T = this.data.get(company);
        const val = this.getNestedObjProp(value, id);
        if (Array.isArray(data)) {
            if (val && val as number > 0) {
                data.splice(data.indexOf(data.find(x => this.getNestedObjProp(x, id) === val)), 1, Object.assign({}, value));
            } else {
                data.push(Object.assign({}, value));
            }
        }
        if (this.subject.get(company)) {
            this.subject.get(company).next(data);
        }
        this.data.set(company, data);
    }

    getNestedObjProp(item, path: string) {
        const props = path.split('.');
        const firstItem = item[props.shift()];
        if (props.length > 0) {
            return this.getNestedObjProp(firstItem, props.join('.'));
        }
        return firstItem;
    }

    get() {
        const company = LocalData.getCompany();
        const data = this.data.get(company);
        if (!data) {
            this.subject.set(company, new Subject<T>());
        }
        return this.subject.get(company).asObservable();
    }
    getData = () => this.data.get(LocalData.getCompany());
}

// export class SubjectCompanyMapModel<T, T1> {
//     private subject = new Map<string, Map<T, Subject<T1>>>();
//     private data = new Map<string, Map<T, T1>>();

//     nextByT(value: T1, id: string) {
//         const company = LocalData.getCompany();
//         const val = this.getNestedObjProp(value, id);
//         const companyData = this.data.get(company);
//         if (!companyData || companyData.get(val) === null) {
//             this.data.set(company, new Map<T, T1>().set(val, undefined))
//             this.subject.set(company, new Map<T, Subject<T1>>().set(val, new Subject<T1>()));
//         }
//         this.data.get(company).set(val, Object.assign({}, value));
//         this.subject.get(company).get(val).next(Object.assign({}, value));
//     }

//     getNestedObjProp(item, path: string) {
//         const props = path.split('.');
//         const firstItem = item[props.shift()];
//         if (props.length > 0) {
//             return this.getNestedObjProp(firstItem, props.join('.'));
//         }
//         return firstItem;
//     }

//     get(key: T) {
//         const company = LocalData.getCompany();
//         const data = this.data.get(company);
//         console.log(data)
//         if (!data || !data.get(key)) {
//             this.subject.set(company, new Map<T, Subject<T1>>().set(key, new Subject<T1>()));
//             this.data.set(company, new Map<T, T1>().set(key, undefined));
//         }
//         return this.subject.get(company).get(key).asObservable();
//     }
// }