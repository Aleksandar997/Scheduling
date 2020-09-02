import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseBase } from '../common/models/responseBase';
import { UrlHelper } from '../common/helpers/urlHelper';
import { UserPaging, User } from '../common/models/user';
import { LocalData } from '../common/data/localData';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  url = '/user';

  getUsers(userPaging: UserPaging): Promise<ResponseBase<Array<User>>> {
    return this.http.get(this.url + '/selectAll', {
      headers: new HttpHeaders(),
      params: UrlHelper.toQueryParam(userPaging)
    }).toPromise() as Promise<ResponseBase<Array<User>>>;
  }

  save(user: User): Promise<ResponseBase<User>> {
    return this.http.post(this.url, user).toPromise().then((res: ResponseBase<User>) => {
      LocalData.setUserSaveInfo(res.data);
      return res;
    }) as Promise<ResponseBase<User>>;
  }

  getById(userId: number): Promise<ResponseBase<User>> {
    return this.http.get(this.url + '/selectById', {
      headers: new HttpHeaders(),
      params: UrlHelper.toQueryParam(userId)
    }).toPromise() as Promise<ResponseBase<User>>;
  }

  delete(userId: number): Promise<ResponseBase<number>> {
    return this.http.delete(this.url + '/' + userId).toPromise() as Promise<ResponseBase<number>>;
  }
}
