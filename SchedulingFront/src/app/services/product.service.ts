import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductPaging, Product } from '../models/product';
import { UrlHelper } from '../common/helpers/urlHelper';
import { ResponseBase } from '../common/models/responseBase';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  url = '/product';

  deleteProduct(productId: number): Promise<number> {
    return this.http.delete(this.url + '/deleteProduct/' + productId, { headers: new HttpHeaders() }).toPromise() as Promise<number>;
  }
  getProducts(productPaging: ProductPaging): Promise<ResponseBase<Array<Product>>> {
    return this.http.get(this.url + '/selectAll', {
      headers: new HttpHeaders(),
      params: UrlHelper.toQueryParam(productPaging)
    }).toPromise() as Promise<ResponseBase<Array<Product>>>;
  }

  getProductById(productId: number): Promise<ResponseBase<Product>> {
    return this.http.get(this.url + '/selectById', {
      headers: new HttpHeaders(),
      params: UrlHelper.toQueryParam(productId)
    }).toPromise() as Promise<ResponseBase<Product>>;
  }

  saveProduct(product: Product): Promise<ResponseBase<number>> {
    return this.http.post(this.url + '/save', product, { headers: new HttpHeaders() }).toPromise() as Promise<ResponseBase<number>>;
  }
}
