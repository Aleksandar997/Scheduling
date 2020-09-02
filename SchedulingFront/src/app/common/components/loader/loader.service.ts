import { Subject } from 'rxjs';

export class LoaderService {
    private static _loader = new Subject<boolean>();
    static loader = LoaderService._loader.asObservable();

    static show() {
        this._loader.next(true);
    }

    static hide() {
        this._loader.next(false);
    }
}
