import { Injectable } from '@angular/core';
import { ResponseBase } from '../models/responseBase';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenOptionsParams, TokenOptions } from '../http/customHttpParams';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }
  url = '/file/';
  uploadFile<T>(file: File | Array<File>, 
                thenFunc: (fileId: number) => any | Promise<ResponseBase<T>>,
                previousFileGuid: string): Promise<ResponseBase<T>> {
    const formData = new FormData();
    if (file instanceof Array) {
      file.forEach(f => formData.append(f.name, f));
    } else {
      formData.append(file.name, file);
    }
    return this.http.post(this.url + previousFileGuid, formData, {
      headers: new HttpHeaders(),
      params: new TokenOptionsParams(TokenOptions.IgnoreRefreshToken)
    }).toPromise().then((res: ResponseBase<any>) => thenFunc(res.data ? res.data.fileId : null));
  }
}
