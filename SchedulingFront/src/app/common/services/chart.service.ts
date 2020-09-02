import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseBase } from '../models/responseBase';
import { ChartMetaData } from '../models/chartMetaData';

@Injectable({
  providedIn: 'root'
})
export class ChartService<T> {
  url = '/chart/';
  constructor(private http: HttpClient) { }

  getChart(chartName: string): Promise<ResponseBase<Array<T>>> {
    return this.http.get(this.url + chartName + '/get').toPromise() as Promise<ResponseBase<Array<T>>>;
  }

  updatePosition(chartMetaData: ChartMetaData): Promise<ResponseBase<number>> {
    return this.http.put(this.url + 'updatePosition', chartMetaData
    ).toPromise() as Promise<ResponseBase<number>>;
  }
}

// class ChartData {
//   static data: Map<string, ChartMetaData> = LocalData.chartMetaData().subscribe(res => {

//   });
// }
