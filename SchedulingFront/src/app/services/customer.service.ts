import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SubjectCompanyModel } from '../common/models/subjectCompanyModel';
import { Customer } from '../models/customer';
import { ResponseBase } from '../common/models/responseBase';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  url = '/customer';
  private _customers = new SubjectCompanyModel<Array<Customer>>();
  customers = this._customers.get();
  constructor(private http: HttpClient) { }

  selectAll() {
    this.http.get(this.url + '/selectAll').toPromise().then((res: ResponseBase<Array<Customer>>) => {
      this._customers.next(res.data);
    });
  }

  selectById(customerId: number) {
    this.http.get(this.url + '/selectbyId/' + customerId).toPromise().then((res: ResponseBase<Customer>) => {
      this._customers.appendNext<Customer>(res.data, 'customerId');
    });
  }

  save(customer: Customer) {
    return this.http.post(this.url + '/save', customer, { headers: new HttpHeaders() }).toPromise().then((res: ResponseBase<Customer>) => {
      this._customers.appendNext<Customer>(res.data, 'customerId');
    });
  }
}
