import { LocalData } from '../data/localData';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { TokenOptionsParams, TokenOptions } from '../http/customHttpParams';
import { Localization } from '../models/localizationEntity';
import { Culture } from '../models/culture';


@Injectable()
export class LocalizationService {

    constructor(private http: HttpClient) { }

    getLocalizationData(): Promise<Array<Culture>> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Accept: 'application/json'
        });

        return this.http.post('/localization', null, {
            headers, params: new TokenOptionsParams(TokenOptions.IgnoreRefreshToken)
        }).toPromise().then(res => res as Promise<Array<Culture>>);
            // .toPromise()
            // .then(async (data: Array<Culture>) => {
            //         LocalData.setTranslations(data[0].localizationPair);
            // });
    }
}
