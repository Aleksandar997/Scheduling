import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DocumentPaging } from '../models/document';
import { UrlHelper } from '../common/helpers/urlHelper';
import { ResponseBase } from '../common/models/responseBase';
import { Document } from '../models/document';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient) { }
  url = '/document';

  selectAllByType(documentPaging: DocumentPaging): Promise<ResponseBase<Array<Document>>> {
    return this.http.get(this.url + '/selectAllByType', {
      headers: new HttpHeaders(),
      params: UrlHelper.toQueryParam(documentPaging)
    }).toPromise() as Promise<ResponseBase<Array<Document>>>;
  }

  selectById(documentId: number): Promise<ResponseBase<Document>> {
    return this.http.get(this.url + '/selectById/' + documentId, { headers: new HttpHeaders() })
      .toPromise() as Promise<ResponseBase<Document>>;
  }

  save(document: Document): Promise<ResponseBase<number>> {
    return this.http.post(this.url + '/save', document, { headers: new HttpHeaders() })
      .toPromise() as Promise<ResponseBase<number>>;
  }

  cancel(documentId: number): Promise<ResponseBase<number>> {
    return this.http.delete(this.url + '/delete/' + documentId, { headers: new HttpHeaders() })
      .toPromise() as Promise<ResponseBase<number>>;
  }
}
