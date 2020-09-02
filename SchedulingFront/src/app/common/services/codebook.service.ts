import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseBase } from '../models/responseBase';
import { CodebookOutputModel } from '../models/codebookOutputModel';
import { ICodebookBase, CodebookPaging } from '../models/iCodebookBase';
import { UrlHelper } from '../helpers/urlHelper';
import { ICrudServiceBase } from '../models/iCrudServiceBase';

@Injectable({
  providedIn: 'root'
})
export class CodebookService implements ICrudServiceBase<CodebookOutputModel<ICodebookBase>, CodebookPaging> {
  private url;

  setCodebookUrl(url: string) {
    this.url = '/' + url;
  }
  constructor(private http: HttpClient) { }
  getById(id: number): Promise<ResponseBase<CodebookOutputModel<ICodebookBase>>> {
    return this.http.get(this.url + '/selectById/' + id).toPromise() as Promise<ResponseBase<CodebookOutputModel<ICodebookBase>>>;
  }
  save(request: any): Promise<ResponseBase<number>> {
    return this.http.post(this.url + '/save', request, { headers: new HttpHeaders() })
    .toPromise().then(res => res as Promise<ResponseBase<number>>);
  }

  getAll(paging: CodebookPaging): Promise<ResponseBase<CodebookOutputModel<ICodebookBase>>> {
    return this.http.get(this.url + '/selectAll', {
      headers: new HttpHeaders(),
      params: UrlHelper.toQueryParam(paging)
    }).toPromise() as Promise<ResponseBase<CodebookOutputModel<ICodebookBase>>>;
  }
}
