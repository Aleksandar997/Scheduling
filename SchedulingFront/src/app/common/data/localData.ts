import { StorageHelper } from '../helpers/storageHelper';
import { User } from '../models/user';
import { CacheService } from '../services/cache.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { Company } from '../models/company';
import { ChartMetaData } from '../models/chartMetaData';

export class LocalData {
    // keys
    private static currentToken = 'currentToken';
    private static expireToken = 'expireToken';
    private static refreshToken = 'refreshToken';
    private static currentUser = 'currentUser';
    private static cultureName = 'cultureName';
    private static translationData = 'translationData';
    private static chartMetaDataName = 'chartMetaData';
    // private static translationData = 'translationData';

    private static _user = new BehaviorSubject<User>(null);
    private static _culture = new Subject<string>();
    private static _translates = new BehaviorSubject<Array<any>>([]);
    private static _chartMetaData = new BehaviorSubject<Array<ChartMetaData>>([]);
    private static dataStore: {
        user: User,
        culture: string
        translates: Array<any>
        chartMetaData: Array<ChartMetaData>
    } = {
            user: null,
            culture: null,
            translates: null,
            chartMetaData: null
        };

    static user = () => {
        if (!LocalData.dataStore.user) {
            LocalData.setUser(StorageHelper.getData(LocalData.currentUser));
        }
        return LocalData._user.asObservable();
    }

    static culture = () => {
        if (!LocalData.dataStore.culture) {
            LocalData.setCulture(StorageHelper.getData(LocalData.cultureName));
        }
        return LocalData._culture.asObservable();
    }

    static translates = () => {
        if (!LocalData.dataStore.translates) {
            LocalData.setTranslations(StorageHelper.getData(LocalData.translationData));
        }
        return LocalData._translates.asObservable();
    }

    static chartMetaData = () => {
        if (!LocalData.dataStore.chartMetaData) {
            LocalData.setChartsMetaData(StorageHelper.getData(LocalData.chartMetaDataName));
        }
        return LocalData._chartMetaData.asObservable();
    }

    static removeAllUserData() {
        this.removeToken();
        this.removeExpireToken();
        this.removeRefreshToken();
        StorageHelper.clearAllData();
    }

    static setChartsMetaData(chartMetaData: Array<ChartMetaData>) {
        this.dataStore.chartMetaData = chartMetaData;
        StorageHelper.setData(this.chartMetaDataName, chartMetaData);
        this._chartMetaData.next(Object.assign({}, this.dataStore).chartMetaData);
    }

    static async setChartMetaData(chartMetaData: ChartMetaData) {
        for (const c of this.dataStore.chartMetaData) {
            if (c.name === chartMetaData.name) {
                c.x = chartMetaData.x;
                c.y = chartMetaData.y;
            }
        }
        StorageHelper.setData(this.chartMetaDataName, this.dataStore.chartMetaData);
        this._chartMetaData.next(Object.assign({}, this.dataStore).chartMetaData);
    }

    // user data
    static setUser(user: User) {
        this.dataStore.user = user;
        StorageHelper.setData(this.currentUser, user);
        this._user.next(Object.assign({}, this.dataStore).user);
    }

    static setCompany(company: Company) {
        this.dataStore.user.company = company;
        StorageHelper.setData(this.currentUser, this.dataStore.user);
        this._user.next(Object.assign({}, this.dataStore).user);
    }

    static setUserSaveInfo(user: User) {
        if (this.dataStore.user.userId !== user.userId) {
            return;
        }
        this.dataStore.user.firstName = user.firstName;
        this.dataStore.user.lastName = user.lastName;
        LocalData.setUser(this.dataStore.user);
        // this.dataStore.user.userName = user.userName;
        // this.dataStore.user.firstName = user.firstName;
    }

    private static getUserData = () => LocalData.dataStore.user ? LocalData.dataStore.user : StorageHelper.getData(LocalData.currentUser);

    static getCompany = () => LocalData.getUserData().company;

    static getUser = (): User => LocalData.getUserData();

    static isUserAdmin = (): boolean => LocalData.getUserData().isAdmin;

    static removeUser() {
        CacheService.delete(LocalData.currentUser);
    }

    static isLogged = (): boolean => LocalData.getUserData() != null;

    // token
    static getToken() {
        return StorageHelper.getData(this.currentToken);
    }
    static setToken(token: string) {
        StorageHelper.setData(this.currentToken, 'bearer ' + token);
    }
    static removeToken(): void {
        StorageHelper.deleteData(this.currentToken);
    }
    // expire token time
    static setExpireToken(time) {
        StorageHelper.setData(this.expireToken, (new Date().getTime() + time));
    }
    static getExpireToken(): number {
        return Number(StorageHelper.getData(this.expireToken)) - 10000;
    }
    static removeExpireToken(): void {
        StorageHelper.deleteData(this.expireToken);
    }
    // refresh token
    static setRefreshToken(token) {
        StorageHelper.setData(this.refreshToken, token);
    }
    static getRefreshToken() {
        return StorageHelper.getData(this.refreshToken);
    }
    static removeRefreshToken(): void {
        StorageHelper.deleteData(this.refreshToken);
    }

    // keep url
    static setReturnUrl(url: string) {
        StorageHelper.setData('returnUrl', url);
    }

    static getReturnUrl() {
        return StorageHelper.getData('returnUrl');
    }

    // language
    static setCulture(culture: string) {
        this.dataStore.culture = culture;
        StorageHelper.setData(LocalData.cultureName, culture);
        this._culture.next(Object.assign({}, this.dataStore).culture);
    }
    static getCulture() {
        return this.dataStore.culture ? this.dataStore.culture : StorageHelper.getData(LocalData.cultureName);
    }
    // static setCultureNameVersion(version: number) {
    //     StorageHelper.setLocalData(this.cultureNameVersion, version.toString());
    // }
    // static getCultureNameVersion() {
    //     return (StorageHelper.getLocalData(this.cultureNameVersion) == null ? '0' : StorageHelper.getLocalData(this.cultureNameVersion));
    // }

    static setTranslations(data: any) {
        this.dataStore.translates = data;
        StorageHelper.setData(LocalData.translationData, data);
        this._translates.next(Object.assign({}, this.dataStore).translates);
    }
    static getTranslations() {
        return this.dataStore.translates ? this.dataStore.translates : StorageHelper.getData(LocalData.translationData);
    }

}
