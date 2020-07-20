import { Component, OnInit, Input, ViewChild, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { DataGridComponent } from '../../dataGrid/dataGrid.component';
import { MatDialog, MatSort } from '@angular/material';
import { Day } from 'src/app/common/models/day';
import { Router } from '@angular/router';
import { IDayDetail } from '../base/dayDetail';

@Component({
  selector: 'day-details',
  templateUrl: './dayDetails.component.html',
  styleUrls: ['./dayDetails.component.css']
})
export class DayDetailsComponent<T> implements AfterViewInit {
  @Input() displayedColumns: string[];
  @ViewChild('calendarDetailsGrid', { static: false }) calendarDetailsGrid: DataGridComponent<T>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  loaderEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() deleteDetail = new EventEmitter<any>();
  @Input('data')
  set data(data: Array<T>) {
    // if (!this.calendarDetailsGrid) {
    //   return;
    // }
    // this.calendarDetailsGrid.dataSetter.next(data);
    this.calendarDetailsGrid.dataSource.data = data;
    // this.calendarDetailsGrid.dataSource._updateChangeSubscription();
  }
  @Input() day: Day;
  constructor(private dialog: MatDialog, private router: Router) {
  }

  getNestedObjProp(item, path: string) {
    const props = path.split('.');
    const firstItem = item[props.shift()];
    if (props.length > 0) {
      return this.getNestedObjProp(firstItem, props.join('.'));
    }
    return firstItem;
  }
  getNestedPropName = (path: string) => path.split('.').pop();
  ngAfterViewInit() {
   // this.calendarDetailsGrid.dataSource.sort = this.sort;
  }
  navigateToAction(url) {
    this.router.navigateByUrl(this.router.url + url, { state: { date: this.day.date } });
  }
  onDeleteDetail(id) {
    this.deleteDetail.emit(+id);
  }
  onRowClickLink = (dayDetail: IDayDetail) => '/edit/' + dayDetail.id;
}
