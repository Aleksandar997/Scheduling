import { Injectable } from '@angular/core';
import { Employee } from '../models/employee';
import { HttpClient } from '@angular/common/http';
import { ResponseBase } from '../common/models/responseBase';
import { Product } from '../models/product';
import { ProductType } from '../models/productType';
import { OrganizationUnit } from '../models/organizationUnit';
import { PriceListType } from '../models/priceListType';
import { DocumentStatus } from '../models/documentStatus';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  url = '/system';
  constructor(private http: HttpClient) { }

  getOrganizationUnits(): Promise<ResponseBase<Array<OrganizationUnit>>> {
    return this.http.get(this.url + '/selectOrganizationUnits').toPromise() as Promise<ResponseBase<Array<OrganizationUnit>>>;
  }

  getEmployees(): Promise<ResponseBase<Array<Employee>>> {
    return this.http.get(this.url + '/selectEmployees').toPromise() as Promise<ResponseBase<Array<Employee>>>;
  }

  getProducts(): Promise<ResponseBase<Array<Product>>> {
    return this.http.get(this.url + '/selectProducts').toPromise() as Promise<ResponseBase<Array<Product>>>;
  }

  getProductTypes(): Promise<ResponseBase<Array<ProductType>>> {
    return this.http.get(this.url + '/selectProductTypes').toPromise() as Promise<ResponseBase<Array<ProductType>>>;
  }

  getPricelistTypes(): Promise<ResponseBase<Array<PriceListType>>> {
    return this.http.get(this.url + '/selectPricelistsTypes').toPromise() as Promise<ResponseBase<Array<PriceListType>>>;
  }

  getDocumentStatuses(): Promise<ResponseBase<Array<DocumentStatus>>> {
    return this.http.get(this.url + '/selectDocumentStatuses').toPromise() as Promise<ResponseBase<Array<DocumentStatus>>>;
  }
}
