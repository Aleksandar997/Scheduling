import { Component, OnInit, ViewChild, Injector, AfterViewInit, OnDestroy, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ToasterComponent } from 'src/app/common/components/toaster/toaster.component';
import { LoaderComponent } from 'src/app/common/components/loader/loader.component';
import { actionEnum } from 'src/app/common/enums';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, AbstractControl, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { FormBase } from 'src/app/common/base/formBase';
import { TimelineSliderComponent } from 'src/app/common/components/timelineSlider/timelineSlider.component';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { SelectListModel } from 'src/app/common/models/selectListModel';
import { SystemService } from 'src/app/services/system.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { FormGroupHelper } from 'src/app/common/helpers/formGroupHelper';
import { DocumentDetail } from 'src/app/models/documentDetail';
import { ModalBaseComponent } from 'src/app/common/modals/modalBase/modalBase.component';
import { ModalBase } from 'src/app/common/models/modalBase';
import { ProductPricelist } from 'src/app/models/product';
import { CustomerActionModalComponent } from 'src/app/modals/customer-action-modal/customerActionModal.component';
import { CustomerService } from 'src/app/services/customer.service';
import { ErrorStateMatcherAdapter } from 'src/app/common/adapters/errorStateMatcherAdapter';
import { Document } from '../../models/document';
import { ConfirmationModalComponent } from 'src/app/common/modals/confirmationModal/confirmationModal.component';
import { DetailActionComponent } from 'src/app/common/components/detailAction/detailAction.component';

@Component({
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent extends FormBase implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('toaster', { static: false }) toaster: ToasterComponent;
  @ViewChild('loader', { static: false }) loader: LoaderComponent;
  @ViewChild('timeline', { static: false }) timeline: TimelineSliderComponent;
  @ViewChild('detailAction', { static: false }) detailAction: DetailActionComponent;
  loaderEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  modalBase = new ModalBaseComponent(this.dialog);
  displayedColumns = ['product', 'employee', 'price', 'discount', 'priceWithDiscount', 'actions'];
  action: actionEnum;
  customerSub: Subscription;
  scheduleId: number;
  matcher = new ErrorStateMatcherAdapter();
  form: FormGroup;
  customers: Array<SelectListModel>;
  customerPhoneNumbers = [{ customerId: null, phoneNumber: null }];
  prevUrl: string;
  organizationUnits = new Array<SelectListModel>();
  constructor(private inj: Injector, private activatedRoute: ActivatedRoute,
              private fb: FormBuilder, private changeDetector: ChangeDetectorRef, private customerService: CustomerService,
              private systemService: SystemService, private scheduleService: ScheduleService, private dialog: MatDialog) {
    super(inj);
    this.action = this.activatedRoute.snapshot.data.action as actionEnum;
    this.scheduleId = +this.activeRouter.snapshot.params.id;
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
      }),
      organizationUnitId: new FormControl({ value: null, disabled: this.areControlsDisabled() }, [Validators.required]),
      documentDetails: this.fb.array([])
    });
    this.customerSub = this.customerService.customers.subscribe(async res => {
      this.customerPhoneNumbers = await res.map(x => {
        return {
          customerId: x.customerId,
          phoneNumber: x.phoneNumber
        };
      });
      this.customers = res.map(x => new SelectListModel(x.customerId, `${x.firstName} ${x.lastName}`));
    });
  }
  ngAfterViewInit() {
    this.loader.show();
    this.getLists();
    this.getData();
    this.detailAction.sum.subscribe(res => {
      this.getControls(this.form, 'sum').setValue(res);
    });
  }
  ngOnDestroy() {
    this.customerSub.unsubscribe();
  }

  ngOnInit() {
    this.getControls(this.form, 'schedule.customerId').valueChanges.subscribe(res => {
      const currentCustomer = this.customerPhoneNumbers.find(x => x.customerId === +res);
      if (!currentCustomer) {
        this.getControls(this.form, 'schedule.phoneNumber').setValue(null);
        return;
      }
      this.getControls(this.form, 'schedule.phoneNumber').setValue(currentCustomer.phoneNumber);
    });
    this.getControls(this.form, 'organizationUnitId').valueChanges.subscribe(res => {
      if (!res) {
        return;
      }
      this.detailAction.setOrganizationUnit(res);
    });
  }

  getData() {
    if (!this.scheduleId) {
      this.loader.hide();
      return;
    }
    this.scheduleService.getScheduleById(this.scheduleId).then(res => {
      FormGroupHelper.mapObjectToFormGroup(res.data, this.form);
      const details = (this.getControls(this.form, 'documentDetails') as FormArray);
      this.detailAction.data.next(details);
      this.loader.hide();
    }).catch(err => {
      this.loader.hide();
      this.toaster.handleErrors(err, 'schedule_get_error');
    });
  }

  getLists() {
    this.systemService.getOrganizationUnits().then(res => {
      this.organizationUnits = res.data.map(x => new SelectListModel(x.organizationUnitId, x.name));
    }).catch(err => {
      this.loader.hide();
      this.toaster.handleErrors(err, 'organization_unit_get_error');
    });

    this.customerService.selectAll();
  }


  submit() {
    this.detailAction.matcher.submit();
    if (!FormGroupHelper.isValid(this.form)) {
      this.toaster.openWarning(this.getLocalization('form_not_valid'));
      return;
    }
    const time = this.timeline.value().toString().split(':');
    const document = this.form.getRawValue() as Document;
    document.schedule.date = new Date(document.schedule.date);
    document.schedule.date.setHours(+time[0], +time[1]);
    document.documentDetails = this.detailAction.formArray.getRawValue();
    this.modalBase.openDialog(
      new ModalBase('confirm_schedule_save_title', 'confirm_schedule_save_text', null, this.loaderEmitter, () => {
        this.loaderEmitter.emit(true);
        this.scheduleService.saveSchedule(document).then(() => {
          this.loaderEmitter.emit(false);
          this.toaster.openSuccess('schedule_save_success');
          this.modalBase.closeDialog();
          this.navigateBack();
        }).catch(err => {
          this.loaderEmitter.emit(false);
          this.toaster.handleErrors(err, 'schedule_save_error');
          this.modalBase.closeDialog();
        });
      }), ConfirmationModalComponent);
  }

  navigateBack() {
    this.router.navigate([this.prevUrl ? this.prevUrl : '/schedules']);
  }
  addNewCustomer() {
    this.modalBase.openDialog(
      ModalBase.InstanceWithoutText(this.getControls(this.form, 'schedule.customerId').value, this.loaderEmitter, () => {
        this.getControls(this.form, 'schedule.customerId').updateValueAndValidity();
      }),
      CustomerActionModalComponent
    );
  }

  areControlsDisabled = () => this.action === actionEnum.View;

}
