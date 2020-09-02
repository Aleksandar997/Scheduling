import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseBase } from '../models/responseBase';
import { Company } from '../models/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient) { }
  url = '/framework/company/';


  getCompany(): Promise<ResponseBase<Company>> {
    return this.http.get(this.url + 'getCompany', { headers: new HttpHeaders() })
      .toPromise() as Promise<ResponseBase<Company>>;
  }

  save(company: Company): Promise<ResponseBase<Company>> {
    return this.http.post(this.url + 'save', company, { headers: new HttpHeaders() })
      .toPromise() as Promise<ResponseBase<Company>>;
  }
}
