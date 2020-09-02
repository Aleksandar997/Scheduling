import { Injectable } from '@angular/core';
import { Employee } from '../models/employee';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseBase } from '../common/models/responseBase';
import { Product, ProductSelectList, ProductSelectListInput } from '../models/product';
import { ProductType } from '../models/productType';
import { OrganizationUnit } from '../models/organizationUnit';
import { PriceListType } from '../models/priceListType';
import { DocumentStatus } from '../models/documentStatus';
import { User } from '../common/models/user';
import { UrlHelper } from '../common/helpers/urlHelper';
import { Role } from '../common/models/role';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  url = '/system';
  constructor(private http: HttpClient) { }

  getOrganizationUnits(): Promise<ResponseBase<Array<OrganizationUnit>>> {
    return this.http.get(this.url + '/selectOrganizationUnits').toPromise() as Promise<ResponseBase<Array<OrganizationUnit>>>;
  }

  getEmployees(organizationUnitId: number = 0): Promise<ResponseBase<Array<User>>> {
    return this.http.get(this.url + '/selectEmployees', {
      headers: new HttpHeaders(),
      params: UrlHelper.toQueryParam(organizationUnitId)
    }).toPromise() as Promise<ResponseBase<Array<User>>>;
  }

  getProducts(organizationUnits: Array<number>, allOrgUnits = false): Promise<ResponseBase<ProductSelectList>> {
    return this.http.get(this.url + '/selectProducts', {
      headers: new HttpHeaders(),
      params: UrlHelper.toQueryParam(new ProductSelectListInput(organizationUnits, allOrgUnits))
    }).toPromise() as Promise<ResponseBase<ProductSelectList>>;
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

  getRoles(): Promise<ResponseBase<Array<Role>>> {
    return this.http.get(this.url + '/selectRoles').toPromise() as Promise<ResponseBase<Array<Role>>>;
  }
}
