import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RegisterModel } from '../models/registerModel';
import { ResponseBase } from '../common/models/responseBase';
import { TokenOptionsParams, TokenOptions } from '../common/http/customHttpParams';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private http: HttpClient) { }
  url = '/register';

  saveCompany(register: RegisterModel): Promise<ResponseBase<number>> {
    return this.http.post(this.url, register, {
      headers: new HttpHeaders(),
      params: new TokenOptionsParams(TokenOptions.IgnoreRefreshToken)
    }).toPromise() as Promise<ResponseBase<number>>;
  }
}
