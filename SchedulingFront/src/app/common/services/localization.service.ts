import { LocalData } from '../data/localData';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { TokenOptionsParams, TokenOptions } from '../http/customHttpParams';
import { Culture } from '../models/culture';
import { Resource, ResourcePaging } from '../models/resource';
import { UrlHelper } from '../helpers/urlHelper';
import { ResponseBase } from '../models/responseBase';


@Injectable()
export class LocalizationService {

    constructor(private http: HttpClient) { }
    url = '/localization/';
    getLocalizationData(): Promise<Array<Culture>> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Accept: 'application/json'
        });

        return this.http.post(this.url + 'localizacionSelectAll', null, {
            headers, params: new TokenOptionsParams(TokenOptions.IgnoreRefreshToken)
        }).toPromise().then(res => res as Promise<Array<Culture>>);
    }

    selectAll(paging: ResourcePaging): Promise<ResponseBase<Array<Resource>>> {
        return this.http.get(this.url + 'resourceSelectAll', {
            headers: new HttpHeaders(),
            params: UrlHelper.toQueryParam(paging)
        }).toPromise()
            .then(res => res as Promise<ResponseBase<Array<Resource>>>);
    }

    selectById(resourceId: number): Promise<ResponseBase<Resource>> {
        return this.http.get(this.url + 'resourceById/' + resourceId).toPromise()
            .then(res => res as Promise<ResponseBase<Resource>>);
    }

    cultureSelectlist(): Promise<ResponseBase<Array<Culture>>> {
        return this.http.get(this.url + 'cultureSelectlist').toPromise()
            .then(res => res as Promise<ResponseBase<Array<Culture>>>);
    }

    save(resource: Resource): Promise<ResponseBase<Resource>> {
        return this.http.post(this.url + 'save', resource, { headers: new HttpHeaders() })
            .toPromise() as Promise<ResponseBase<Resource>>;
    }
}
