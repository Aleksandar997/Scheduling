import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalData } from '../data/localData';
import { User, UserCredentials, PasswordModel } from '../models/user';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Menu } from '../models/menu';
import { TokenOptionsParams, TokenOptions } from '../http/customHttpParams';
import { CacheService } from './cache.service';
import { ResponseBase } from '../models/responseBase';
import { DataGridComponentCache } from '../components/dataGrid/dataGrid.component';
import { ThemeService } from '../theme/theme.service';

@Injectable()
export class AuthenticationService {

    constructor(private router: Router, private http: HttpClient, private themeService: ThemeService) {
    }
    apiUrl = '/framework/user';
    login(username: string, password: string) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            // 'Accept-Language': LocalData.getCultureName()
        });
        const data = new URLSearchParams();
        data.append('grant_type', 'password');
        data.append('username', username == null ? '' : username);
        data.append('password', password);

        return this.http.post('/token', data.toString(), { headers, params: new TokenOptionsParams(TokenOptions.IgnoreRefreshToken) })
            .toPromise().then((response: { accessToken: string; expiresIn: number; refreshToken: any }) => {
                if (response && response.accessToken) {
                    LocalData.setToken(response.accessToken);
                    LocalData.setExpireToken((response.expiresIn * 1000));
                    LocalData.setRefreshToken(response.refreshToken);
                    return this.http.get(this.apiUrl + '/getUser', { headers: new HttpHeaders() }).toPromise()
                        .then((userResponse: any) => {
                            let user = new User();
                            user = userResponse.data;
                            user.menus = user.menus.map(m => new Menu(m));
                            user.permissions = user.permissions.map(p => p.code);
                            this.themeService.setThemeStyleSheet(user.theme);
                            LocalData.setUser(user);
                            LocalData.setChartsMetaData(user.chartMetaData);
                        });
                }
            });
    }

    forgottenPassword(userCredentials: UserCredentials): Promise<ResponseBase<number>> {
        return this.http.post(this.apiUrl + '/forgottenPassword', userCredentials, {
            headers: new HttpHeaders(),
            params: new TokenOptionsParams(TokenOptions.IgnoreRefreshToken)
        })
            .toPromise() as Promise<ResponseBase<number>>;
    }

    changePassword(passwordModel: PasswordModel): Promise<ResponseBase<number>> {
        return this.http.put(this.apiUrl + '/changePassword', passwordModel, {
            headers: new HttpHeaders(),
            params: new TokenOptionsParams(TokenOptions.IgnoreRefreshToken)
        })
            .toPromise() as Promise<ResponseBase<number>>;
    }

    logout(param = '') {
        LocalData.removeAllUserData();
        DataGridComponentCache.activePageCache.clear();
        this.router.navigate(['/login'], param !== '' ? { queryParams: { code: param } } : undefined);
    }
}
