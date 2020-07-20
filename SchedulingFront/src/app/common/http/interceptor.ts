import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpParams
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { LocalData } from '../data/localData';
import { TokenOptionsParams, TokenOptions } from './customHttpParams';
import { catchError, switchMap } from 'rxjs/operators';
import { Settings } from '../settings/settings';

@Injectable()
export class Interceptor implements HttpInterceptor {
    constructor() { }
    apiurl: string = Settings.ApiServerUrl;

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            url: this.apiurl + request.url
        });
        if (new Date().getTime() > LocalData.getExpireToken() && !this.isRefreshTokenIgnored(request)) {
            return this.onExpired(next, request);
        }
        if (request.headers.keys().length === 0) {
            if (this.isRefreshTokenIgnored(request)) {
                const res = this.setDefaultHeaders(request);
                Object.keys(res).forEach(x => {
                    request.headers.set(x, res[x]);
                });
            } else {
                request = request.clone({
                    setHeaders: this.setDefaultHeaders(request)
                });
            }
        }
        return next.handle(request)
            .pipe(
                catchError((error: any) => {
                    if (request.responseType === 'blob') {
                        return this.handleBlobError(error);
                    }
                    return throwError(error) as Observable<HttpEvent<any>>;
                })
            );
    }

    private setDefaultHeaders(request: HttpRequest<any>) {
        return {
            'Content-Type': 'application/json',
            Authorization: this.isTokenIgnored(request) ? null : LocalData.getToken(),
            Accept: 'application/json',
            // 'Accept-language': LocalData.getCultureName(),
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            Expires: '0'
        };
    }

    private isRefreshTokenIgnored = (request: HttpRequest<any>) => request.params instanceof TokenOptionsParams &&
        (request.params.option === TokenOptions.IgnoreRefreshToken ||
            request.params.option === TokenOptions.IgnoreBoth)

    private isTokenIgnored = (request: HttpRequest<any>) => request.params instanceof TokenOptionsParams &&
        (request.params.option === TokenOptions.IgnoreToken ||
            request.params.option === TokenOptions.IgnoreBoth)

    private onExpired(next: HttpHandler, request: HttpRequest<any>): Observable<HttpEvent<any>> {
        const urlData = new HttpParams()
            .set('grant_type', 'refresh_token')
            .set('refresh_token', LocalData.getRefreshToken());

        const tokenRequest = request.clone({
            url: this.apiurl + '/token',
            body: urlData,
            setHeaders: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // 'Accept-Language': LocalData.getCultureName()
            },
            method: 'POST'
        });

        return from(new Promise(resolve => resolve(next.handle(tokenRequest).toPromise())))
            .pipe(
                switchMap((data: any) => {
                    if (data.body && data.body.accessToken) {
                        LocalData.setToken(data.body.accessToken);
                        LocalData.setExpireToken((data.body.expiresIn * 1000));
                        LocalData.setRefreshToken(data.body.refreshToken);
                    }
                    const clone = request.clone({
                        setHeaders: this.setDefaultHeaders(request)
                    });
                    return next.handle(clone);
                })
            );
    }

    private handleBlobError(error): Observable<HttpEvent<any>> {
        const reader: FileReader = new FileReader();
        const obs = Observable.create((observer: any) => {
            reader.onloadend = (e) => {
                observer.error(JSON.parse(reader.result as string));
                observer.complete();
            };
        }) as Observable<HttpEvent<any>>;
        reader.readAsText(error.error);
        return obs;
    }
}


