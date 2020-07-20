import { Component, ViewChild, AfterViewInit, Injector, EventEmitter, OnDestroy } from '@angular/core';
import { CalendarComponent } from '../common/components/calendar/calendar.component';
import { ScheduleService } from '../services/schedule.service';
import { SystemService } from '../services/system.service';
import { FormControl, FormBuilder } from '@angular/forms';
import { SelectListModel } from '../common/models/selectListModel';
import { LocalData } from '../common/data/localData';
import { ToasterComponent } from '../common/components/toaster/toaster.component';
import { LoaderComponent } from '../common/components/loader/loader.component';
import { FormBase } from '../common/base/formBase';
import { Schedule } from '../models/schedule';
import { ModalBaseComponent } from '../common/modals/modalBase/modalBase.component';
import { MatDialog } from '@angular/material';
import { ModalBase } from '../common/models/modalBase';
import { ConfirmationModalComponent } from '../common/modals/confirmationModal/confirmationModal.component';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent extends FormBase implements AfterViewInit, OnDestroy {
  @ViewChild(CalendarComponent, { static: false }) calendarComponent: CalendarComponent;
  @ViewChild('toaster', { static: false }) toaster: ToasterComponent;
  @ViewChild('loader', { static: false }) loader: LoaderComponent;
  loaderEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  displayedColumns = LocalData.isUserAdmin() ?
    ['time', 'customer.customerName', 'customer.phoneNumber', 'employees', 'actions'] :
    ['time', 'customer.customerName', 'customer.phoneNumber', 'actions'];
  selectedEmployees = new FormControl();
  modalBase = new ModalBaseComponent(this.dialog);
  form = this.fb.group({
    employees: new FormControl([]),
    organizationUnits: new FormControl([])
  });
  employees: Array<SelectListModel>;
  organizationUnits: Array<SelectListModel>;
  formSub: Subscription;
  constructor(private inj: Injector, public scheduleService: ScheduleService,
    private systemService: SystemService, private fb: FormBuilder, private dialog: MatDialog) {
    super(inj);

    this.formSub = this.form.valueChanges.subscribe(() => {
      this.calendarComponent.getData();
    });
  }

  ngAfterViewInit(): void {
    this.loader.show();
    this.getLists();
  }

  ngOnDestroy() {
    this.formSub.unsubscribe();
  }

  getLists() {
    this.systemService.getEmployees().then(res => {
      this.employees = res.data.map(x => new SelectListModel(x.employeeId, `${x.user.firstName} ${x.user.lastName}`));
      this.loader.hide();
    }).catch(err => {
      this.loader.hide();
      this.toaster.handleErrors(err, 'employee_get_error');
    });
    this.systemService.getOrganizationUnits().then(res => {
      this.organizationUnits = res.data.map(x => new SelectListModel(x.organizationUnitId, x.name));
      this.loader.hide();
    }).catch(err => {
      this.loader.hide();
      this.toaster.handleErrors(err, 'organization_units_error');
    });
  }

  getScheduleInMonth(paging: any) {
    this.loader.show();
    this.scheduleService.getScheduleInMonth(paging).then(res => {
      this.loader.hide();
      this.calendarComponent.setTiles(res.data.map(x => Schedule.init(x)));
    }).catch(err => {
      this.loader.hide();
      this.toaster.handleErrors(err, 'schedule_in_month_get_error');
    });
  }

  deleteDetail(id: number) {
    this.modalBase.openDialog(
      new ModalBase('confirm_schedule_delete_title', 'confirm_schedule_delete_text', null, this.loaderEmitter, () => {
        this.loaderEmitter.emit(true);
        this.scheduleService.deleteScheduleById(id).then(() => {
          this.loaderEmitter.emit(false);
          this.modalBase.closeDialog();
          this.toaster.openSuccess('schedule_delete_success');
          this.calendarComponent.getData(true);
        }).catch(err => {
          this.loaderEmitter.emit(false);
          this.modalBase.closeDialog();
          this.toaster.handleErrors(err, 'schedule_delete_error');
        });
      }), ConfirmationModalComponent);
  }
}
