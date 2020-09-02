import { Component, ViewChild, AfterViewInit, Injector, OnDestroy } from '@angular/core';
import { CalendarComponent } from '../common/components/calendar/calendar.component';
import { ScheduleService } from '../services/schedule.service';
import { SystemService } from '../services/system.service';
import { FormControl, FormBuilder } from '@angular/forms';
import { SelectListModel } from '../common/models/selectListModel';
import { LocalData } from '../common/data/localData';
import { FormBase, ActionType } from '../common/base/formBase';
import { Schedule, SchedulePaging } from '../models/schedule';
import { Subscription } from 'rxjs';
import { ResponseBase } from '../common/models/responseBase';
import { User } from '../common/models/user';
import { OrganizationUnit } from '../models/organizationUnit';
import { CalendarPaging } from '../common/models/calendarPaging';

@Component({
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent extends FormBase implements AfterViewInit, OnDestroy {
  @ViewChild(CalendarComponent) calendarComponent: CalendarComponent;
  displayedColumns = LocalData.isUserAdmin() ?
    ['time', 'customer.customerName', 'customer.phoneNumber', 'employees', 'actions'] :
    ['time', 'customer.customerName', 'customer.phoneNumber', 'actions'];
  selectedEmployees = new FormControl();
  filters = this.fb.group({
    employees: new FormControl([]),
    organizationUnits: new FormControl([])
  });
  employees: Array<SelectListModel>;
  organizationUnits: Array<SelectListModel>;
  formSub: Subscription;
  paging = new SchedulePaging();
  constructor(private inj: Injector, public scheduleService: ScheduleService,
              private systemService: SystemService, private fb: FormBuilder) {
    super(inj);
    this.formSub = this.filters.valueChanges.subscribe(res => {
      this.paging.assign(res);
      this.awaitExecution(() => this.getData());
    });
    this.genericName = 'schedule';
  }

  addSchedule() {
    this.calendarComponent.navigateToAction();
  }
  ngAfterViewInit() {
    this.getLists();
  }

  ngOnDestroy() {
    this.formSub.unsubscribe();
  }

  getLists() {
    this.execGetFunc(() => {
      return this.systemService.getEmployees().then(res => {
        this.employees = res.data.map(x => new SelectListModel(x.employee.employeeId, `${x.firstName} ${x.lastName}`));
      }) as Promise<ResponseBase<Array<User>>>;
    });
    this.execGetFunc(() => {
      return this.systemService.getOrganizationUnits().then(res => {
        this.organizationUnits = res.data.map(x => new SelectListModel(x.organizationUnitId, x.name));
      }) as Promise<ResponseBase<Array<OrganizationUnit>>>;
    });
  }

  getData(calendarPaging: CalendarPaging = null) {
    if (calendarPaging) {
      this.paging.setCalendarDate(calendarPaging);
    }
    this.execGetFunc(() => {
      return this.scheduleService.getScheduleInMonth(this.paging).then(res => {
        this.calendarComponent.setTiles(res.data.map(x => Schedule.init(x)));
      }) as Promise<ResponseBase<Array<Schedule>>>;
    });
  }

  deleteDetail(id: number) {
    this.execFunc(() => {
      this.scheduleService.deleteScheduleById(id);
    }, ActionType.Delete);
  }
}
