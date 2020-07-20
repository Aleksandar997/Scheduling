import { HttpParams } from '@angular/common/http';

export class TokenOptionsParams extends HttpParams {
    constructor(
        public option?: TokenOptions,
        params?: { [param: string]: string | string[] }
    ) {
        super({ fromObject: params });
    }
}

export enum TokenOptions { IgnoreRefreshToken, IgnoreToken, IgnoreBoth }

export class CacheOptionsParams extends HttpParams {
    constructor(
        public cacheName?: string,
        params?: { [param: string]: string | string[] }
    ) {
        super({fromObject: params});
    }
}

