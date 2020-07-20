import { Component, OnInit, Injector, ViewChild, EventEmitter, OnDestroy, AfterViewInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { FormBase } from 'src/app/common/base/formBase';
import { actionEnum } from 'src/app/common/enums';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ToasterComponent } from 'src/app/common/components/toaster/toaster.component';
import { LoaderComponent } from 'src/app/common/components/loader/loader.component';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ModalBaseComponent } from 'src/app/common/modals/modalBase/modalBase.component';
import { FormGroupHelper } from 'src/app/common/helpers/formGroupHelper';
import { ErrorStateMatcherAdapter } from 'src/app/common/adapters/errorStateMatcherAdapter';
import { Subscription } from 'rxjs';
import { SelectListModel } from 'src/app/common/models/selectListModel';
import { ProductPricelist } from 'src/app/models/product';
import { CustomerService } from 'src/app/services/customer.service';
import { SystemService } from 'src/app/services/system.service';
import { DocumentService } from 'src/app/services/document.service';
import { DetailActionComponent } from 'src/app/common/components/detailAction/detailAction.component';
import { ModalBase } from 'src/app/common/models/modalBase';
import { ConfirmationModalComponent } from 'src/app/common/modals/confirmationModal/confirmationModal.component';
import { Document } from 'src/app/models/document';
import { DocumentDetail } from 'src/app/models/documentDetail';

@Component({
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent extends FormBase implements OnInit, OnDestroy, AfterViewInit {
  action: actionEnum;
  @ViewChild('toaster', { static: false }) toaster: ToasterComponent;
  @ViewChild('loader', { static: false }) loader: LoaderComponent;
  @ViewChild('detailAction', { static: false }) detailAction: DetailActionComponent;
  modalBase = new ModalBaseComponent(this.dialog);
  form: FormGroup;
  displayedColumns;
  documentType;
  loaderEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  matcher = new ErrorStateMatcherAdapter();
  documentId: number;
  customerSub: Subscription;
  customers: Array<SelectListModel>;
  organizationUnits = new Array<SelectListModel>();
  pricelistTypes = new Array<SelectListModel>();
  documentStatuses = new Array<SelectListModel>();
  isPricelistDiscount = false;
  constructor(private inj: Injector, private activatedRoute: ActivatedRoute, private fb: FormBuilder,
    private dialog: MatDialog, private customerService: CustomerService, private changeDetector: ChangeDetectorRef,
    private systemService: SystemService, private documentService: DocumentService, private renderer: Renderer2) {
    super(inj);
    this.action = this.activatedRoute.snapshot.data.action as actionEnum;
    this.documentId = +this.activeRouter.snapshot.params.id;
    this.documentType = this.activatedRoute.snapshot.params.code;
    this.activatedRoute.snapshot.data.title = this.activatedRoute.snapshot.data.title + '_' + this.documentType;
    if (this.documentType === 'pricelists') {
      this.initPricelist();
    } else {
      this.initReceipt();
    }
    this.getControls(this.form, 'organizationUnitIds').valueChanges.subscribe(res => {
      if (!res && this.checkType('pricelists')) {
        return;
      }
      this.detailAction.setOrganizationUnit(res);
    });
  }
  ngAfterViewInit() {
    this.getLists();
    this.getData();
    this.detailAction.sum.subscribe(res => {
      this.getControls(this.form, 'sum').setValue(res);
    });
    // if (!this.areControlsDisabled()) {
    //   return;
    // }
    this.renderer.addClass(document.getElementById('orgUnitSelect'), 'readonly');
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (!this.customerSub) {
      return;
    }
    this.customerSub.unsubscribe();
  }

  navigateBack() {
    this.router.navigate(['/documents/' + this.documentType]);
  }

  submit() {
    this.matcher.submit();
    if (!FormGroupHelper.isValid(this.form)) {
      this.toaster.openWarning(this.getLocalization('form_not_valid'));
      return;
    }
    const document = this.form.getRawValue() as Document;
    document.documentType.codePath = this.documentType;
    document.documentDetails = this.detailAction.formArray.value as Array<DocumentDetail>;
    this.modalBase.openDialog(
      new ModalBase('confirm_document_save_title', 'confirm_document_save_text', null, this.loaderEmitter, () => {
        this.loaderEmitter.emit(true);
        this.documentService.save(document).then(() => {
          this.loaderEmitter.emit(false);
          this.toaster.openSuccess('document_save_success');
          this.modalBase.closeDialog();
          this.navigateBack();
        }).catch(err => {
          this.loaderEmitter.emit(false);
          this.toaster.handleErrors(err, 'document_save_error');
          this.modalBase.closeDialog();
        });
      }), ConfirmationModalComponent);
  }


  areControlsDisabled = () => this.action === actionEnum.View;
  checkType = (type: string) => this.documentType === type;

  getLists() {
    this.loader.show();
    this.systemService.getOrganizationUnits().then(res => {
      this.organizationUnits = res.data.map(x => new SelectListModel(x.organizationUnitId, x.name));
      this.loader.hide();
    }).catch(err => {
      this.loader.hide();
      this.toaster.handleErrors(err, 'organization_unit_get_error');
    });
    this.systemService.getDocumentStatuses().then(res => {
      this.documentStatuses = res.data.map(x => new SelectListModel(x.documentStatusId,
        this.getLocalization('label' + x.code.insertStringBetweenUpper('_'))
      ));
      this.loader.hide();
    }).catch(err => {
      this.loader.hide();
      this.toaster.handleErrors(err, 'document_status_get_error');
    });

    if (this.checkType('pricelists')) {
      this.systemService.getPricelistTypes().then(res => {
        this.pricelistTypes = res.data.map(x =>
          new SelectListModel(
            x.pricelistTypeId,
            this.getLocalization('label' + x.name.insertStringBetweenUpper('_')),
            x.code));
        this.loader.hide();
      }).catch(err => {
        this.loader.hide();
        this.toaster.handleErrors(err, 'pricelist_type_get_error');
      });
    } else {
      this.customerService.selectAll();
    }
  }

  getData() {
    if (!this.documentId) {
      return;
    }
    this.loader.show();
    this.documentService.selectById(this.documentId).then(res => {
      FormGroupHelper.mapObjectToFormGroup(res.data, this.form);
      const details = (this.getControls(this.form, 'documentDetails') as FormArray);
      this.detailAction.data.next(details);
      this.loader.hide();
    }).catch(err => {
      this.loader.hide();
      this.toaster.handleErrors(err, 'document_get_error');
    });
  }

  initPricelist() {
    this.form = this.fb.group({
      documentId: new FormControl({ value: null, disabled: true }),
      fullNumber: new FormControl({ value: null, disabled: true }),
      documentStatusId: new FormControl({ value: null, disabled: this.areControlsDisabled() }, [Validators.required]),
      date: new FormControl({ value: new Date(), disabled: this.areControlsDisabled() }, [Validators.required]),
      pricelistTypeId: new FormControl({ value: null, disabled: this.areControlsDisabled() }, [Validators.required]),
      issuingPlace: new FormControl({ value: null, disabled: this.areControlsDisabled() }),
      documentType: this.fb.group({
        codePath: new FormControl()
      }),
      dateFrom: new FormControl(
        { value: null, disabled: this.areControlsDisabled() },
        this.isPricelistDiscount ? [Validators.required] : []
      ),
      dateTo: new FormControl(
        { value: null, disabled: this.areControlsDisabled() },
        this.isPricelistDiscount ? [Validators.required] : []
      ),
      organizationUnitIds: new FormControl({ value: [], disabled: this.areControlsDisabled() }, [Validators.required]),
      sum: new FormControl({ value: null, disabled: true }),
      note: new FormControl({ value: null, disabled: this.areControlsDisabled() }),
      documentDetails: this.fb.array([])
    });
    this.displayedColumns = ['product', 'price', 'actions'];
    this.getControls(this.form, 'pricelistTypeId').valueChanges.subscribe(res => {
      if (!res) {
        return;
      }
      this.isPricelistDiscount = this.pricelistTypes.find(x => x.id === +res).code === 'D';
    });
  }

  initReceipt() {
    this.customerSub = this.customerService.customers.subscribe(async res => {
      this.customers = res.map(x => new SelectListModel(x.customerId, `${x.firstName} ${x.lastName}`));
    });
    this.form = this.fb.group({
      documentId: new FormControl({ value: null, disabled: true }),
      fullNumber: new FormControl({ value: null, disabled: true }),
      documentStatusId: new FormControl({ value: null, disabled: this.areControlsDisabled() }, [Validators.required]),
      date: new FormControl({ value: null, disabled: this.areControlsDisabled() }, [Validators.required]),
      customerId: new FormControl({ value: null, disabled: this.areControlsDisabled() }, [Validators.required]),
      documentType: this.fb.group({
        codePath: new FormControl()
      }),
      issuingPlace: new FormControl({ value: null, disabled: this.areControlsDisabled() }),
      organizationUnitIds: new FormControl({ value: [], disabled: this.areControlsDisabled() }, [Validators.required]),
      sum: new FormControl({ value: null, disabled: true }),
      note: new FormControl({ value: null, disabled: this.areControlsDisabled() }),
      documentDetails: this.fb.array([])
    });
    this.displayedColumns = ['product', 'quantity', 'price', 'discount', 'priceWithDiscount', 'actions'];
  }
}
