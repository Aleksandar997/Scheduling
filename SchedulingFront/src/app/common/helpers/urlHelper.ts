import { HttpParams } from '@angular/common/http';

export class UrlHelper {
    static toQueryParam(param: any) {
        const queryParam = {};
        queryParam[param.constructor.name] = JSON.stringify(param);
        return queryParam;
    }

    static toHttpParams(param: any) {
        return new HttpParams().set(param.constructor.name, JSON.stringify(param));
    }
}
