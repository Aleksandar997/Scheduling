import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseBase } from '../models/responseBase';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(private http: HttpClient) { }
  url = '/role/';


  selectById(roleId: number): Promise<ResponseBase<Role>> {
    return this.http.get(this.url + roleId, { headers: new HttpHeaders() })
      .toPromise() as Promise<ResponseBase<Role>>;
  }

  save(role: Role): Promise<ResponseBase<number>> {
    return this.http.post(this.url, role, { headers: new HttpHeaders() })
      .toPromise() as Promise<ResponseBase<number>>;
  }

}
