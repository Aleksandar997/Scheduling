import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlHelper } from '../common/helpers/urlHelper';
import { Schedule, CalendarPaging } from '../models/schedule';
import { ResponseBase } from '../common/models/responseBase';
import { Document } from '../models/document';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient) { }

  url = '/schedule';

  getScheduleById(id: number): Promise<ResponseBase<Document>> {
    return this.http.get(`${this.url}/selectScheduleById/${id}`, { headers: new HttpHeaders() })
      .toPromise() as Promise<ResponseBase<Document>>;
  }

  deleteScheduleById(id: number): Promise<ResponseBase<number>> {
    return this.http.delete(this.url + '/scheduleDelete/' + id, { headers: new HttpHeaders() } )
    .toPromise() as Promise<ResponseBase<number>>;
  }

  getScheduleInMonth(schedulePaging: CalendarPaging): Promise<ResponseBase<Array<Schedule>>> {
    return this.http.get(this.url + '/selectSchedulesInMonth', {
      headers: new HttpHeaders(),
      params: UrlHelper.toQueryParam(schedulePaging)
    }).toPromise() as Promise<ResponseBase<Array<Schedule>>>;
  }


  saveSchedule(document: Document): Promise<ResponseBase<number>> {
    return this.http.post(this.url, document, { headers: new HttpHeaders() }).toPromise() as Promise<ResponseBase<number>>;
  }

}
