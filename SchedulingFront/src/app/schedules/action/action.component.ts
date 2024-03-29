import { Component, OnInit, ViewChild, Injector, AfterViewInit, OnDestroy, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { LoaderComponent } from 'src/app/common/components/loader/loader.component';
import { actionEnum } from 'src/app/common/enums';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { FormBase, ActionType } from 'src/app/common/base/formBase';
import { TimelineSliderComponent } from 'src/app/common/components/timelineSlider/timelineSlider.component';
import { MatDialog } from '@angular/material';
import { SelectListModel } from 'src/app/common/models/selectListModel';
import { SystemService } from 'src/app/services/system.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { FormGroupHelper } from 'src/app/common/helpers/formGroupHelper';
import { ModalBaseComponent } from 'src/app/common/modals/modalBase/modalBase.component';
import { ModalBase } from 'src/app/common/models/modalBase';
import { CustomerActionModalComponent } from 'src/app/modals/customer-action-modal/customerActionModal.component';
import { CustomerService } from 'src/app/services/customer.service';
import { ErrorStateMatcherAdapter } from 'src/app/common/adapters/errorStateMatcherAdapter';
import { Document } from '../../models/document';
import { ConfirmationModalComponent } from 'src/app/common/modals/confirmationModal/confirmationModal.component';
import { DetailActionComponent } from 'src/app/common/components/detailAction/detailAction.component';
import { LocalData } from 'src/app/common/data/localData';
import { ToasterService } from 'src/app/common/components/toaster/toaster.service';
import { ActionFormBase } from 'src/app/common/base/actionFormBase';
import { ResponseBase } from 'src/app/common/models/responseBase';
import { OrganizationUnit } from 'src/app/models/organizationUnit';

@Component({
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
// @AutoUnsub()
export class ActionComponent extends ActionFormBase<any> implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('timeline') timeline: TimelineSliderComponent;
  @ViewChild('detailAction') detailAction: DetailActionComponent;
  displayedColumns = LocalData.isUserAdmin() ?
  ['employee', 'product', 'price', 'discount', 'priceWithDiscount', 'actions'] :
  ['product', 'price', 'discount', 'priceWithDiscount', 'actions'];

  // customerSub: Subscription;
  scheduleId = null;
  subs = new Array<Subscription>();
  matcher = new ErrorStateMatcherAdapter();
  form: FormGroup;
  customers: Array<SelectListModel>;
  customerPhoneNumbers = [{ customerId: null, phoneNumber: null }];
  prevUrl: string;
  organizationUnits = new Array<SelectListModel>();
  constructor(private inj: Injector, private activatedRoute: ActivatedRoute,
              private changeDetector: ChangeDetectorRef, private customerService: CustomerService,
              private systemService: SystemService, private scheduleService: ScheduleService) {
    super(inj);
    const state = this.router.getCurrentNavigation().extras.state;
    this.prevUrl = state ? state.prevUrl : null;
    this.form = this.fb.group({
      sum: new FormControl({ value: null, disabled: true }),
      note: new FormControl({ value: null, disabled: this.areControlsDisabled() }),
      scheduleId: new FormControl(null),
      schedule: this.fb.group({
        customerId: new FormControl({ value: null, disabled: this.areControlsDisabled() }, [Validators.required]),
        date: new FormControl({ value: (state ? new Date(state.date) : new Date()), disabled: this.areControlsDisabled() }),
        phoneNumber: new FormControl({ value: null, disabled: true }, [Validators.required]),
        bindToEmployee: new FormControl(true),
      }),
      organizationUnitId: new FormControl({ value: null, disabled: this.areControlsDisabled() }, [Validators.required]),
      documentDetails: this.fb.array([])
    });
    this.subs.push(this.customerService.customers.subscribe(async res => {
      this.customerPhoneNumbers = await res.map(x => {
        return {
          customerId: x.customerId,
          phoneNumber: x.phoneNumber
        };
      });
      this.customers = res.map(x => new SelectListModel(x.customerId, `${x.firstName} ${x.lastName}`));
    }));
    this.navigateBackUrl = this.prevUrl ? this.prevUrl : '/schedules';
  }
  ngAfterViewInit() {
    this.getLists();
    this.getData();
    this.subs.push(this.detailAction.sum.subscribe(res => {
      this.form.getControls('sum').setValue(res);
    }));
  }
  ngOnDestroy() {
    this.subs.forEach(x => x.unsubscribe);
  }

  ngOnInit() {
    this.scheduleId = this.getId();
    this.subs.push(this.form.getControls('schedule.customerId').valueChanges.subscribe(res => {
      const currentCustomer = this.customerPhoneNumbers.find(x => x.customerId === +res);
      if (!currentCustomer) {
        this.form.getControls('schedule.phoneNumber').setValue(null);
        return;
      }
      this.form.getControls('schedule.phoneNumber').setValue(currentCustomer.phoneNumber);
    }));
    this.subs.push(this.form.getControls('organizationUnitId').valueChanges.subscribe(res => {
      if (!res) {
        return;
      }
      this.detailAction.setOrganizationUnit(res);
    }));
    if (!LocalData.isUserAdmin()) {
      return;
    }
    this.subs.push(this.form.getControls('schedule.bindToEmployee').valueChanges.subscribe(res => {
      this.detailAction.bindToEmployeeToggle(res);
      if (res) {
        this.displayedColumns = ['employee', 'product', 'price', 'discount', 'priceWithDiscount', 'actions'];
        return;
      }
      this.displayedColumns.splice(this.displayedColumns.indexOf('employee'), 1);
    }));
  }

  getData() {
    if (!this.scheduleId) {
      return;
    }
    this.getById(productId => {
      return this.scheduleService.getScheduleById(this.scheduleId).then(res => {
        FormGroupHelper.mapObjectToFormGroup(res.data, this.form);
        const details = (this.form.getControls('documentDetails') as FormArray);
        // this.form.getControls('bindToEmployee').setValue(res.data.schedule.bindToEmployee);
        this.detailAction.data.next(details);
      }) as Promise<ResponseBase<Document>>;
    });
  }

  getLists() {
    this.execGetFunc(() => {
      return this.systemService.getOrganizationUnits().then(res => {
        this.organizationUnits = res.data.map(x => new SelectListModel(x.organizationUnitId, x.name));
        if (this.organizationUnits.length === 1 && this.action == actionEnum.Add) {
          this.form.getControls('organizationUnitId').setValue(this.organizationUnits.map(x => x.id).firstElement());
        }
      }) as Promise<ResponseBase<OrganizationUnit>>;
    });

    this.customerService.selectAll();
  }


  submit() {
    this.detailAction.matcher.submit();
    return this.execFunc(() => {
      const time = this.timeline.value().toString().split(':');
      const document = this.form.getRawValue() as Document;
      document.schedule.date = new Date(document.schedule.date);
      document.schedule.date.setHours(+time[0], +time[1]);
      document.documentDetails = this.detailAction.formArray.getRawValue();
      return this.scheduleService.saveSchedule(document) as Promise<ResponseBase<number>>;
    }, ActionType.Save, this.form);
  }

  addNewCustomer() {
    this.modal.openDialog(
      ModalBase.InstanceWithoutText(this.form.getControls('schedule.customerId').value, this.loaderEmitter, () => {
        this.form.getControls('schedule.customerId').updateValueAndValidity();
      }),
      CustomerActionModalComponent
    );
  }

  areControlsDisabled = () => this.action === actionEnum.View;

}
