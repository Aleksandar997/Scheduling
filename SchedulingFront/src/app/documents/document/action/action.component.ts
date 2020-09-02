import { Component, OnInit, Injector, ViewChild, EventEmitter, OnDestroy, AfterViewInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { FormBase, ActionType } from 'src/app/common/base/formBase';
import { actionEnum } from 'src/app/common/enums';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
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
import { ToasterService } from 'src/app/common/components/toaster/toaster.service';
import { DocumentStatus } from 'src/app/models/documentStatus';
import { ResponseBase } from 'src/app/common/models/responseBase';
import { OrganizationUnit } from 'src/app/models/organizationUnit';
import { PriceListType } from 'src/app/models/priceListType';
import { ActionFormBase } from 'src/app/common/base/actionFormBase';

@Component({
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent extends ActionFormBase<Document> implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('detailAction') detailAction: DetailActionComponent;
  form: FormGroup;
  displayedColumns;
  documentType;
  matcher = new ErrorStateMatcherAdapter();
  customerSub: Subscription;
  customers: Array<SelectListModel>;
  organizationUnits = new Array<SelectListModel>();
  pricelistTypes = new Array<SelectListModel>();
  documentStatuses = new Array<SelectListModel>();
  isPricelistDiscount = false;
  constructor(private inj: Injector, private activatedRoute: ActivatedRoute,
              private customerService: CustomerService, private systemService: SystemService,
              private documentService: DocumentService, private renderer: Renderer2) {
    super(inj);
    this.documentType = this.activatedRoute.snapshot.params.code;
    this.activatedRoute.snapshot.data.title = this.activatedRoute.snapshot.data.title + '_' + this.documentType;
    if (this.documentType === 'pricelists') {
      this.initPricelist();
    } else {
      this.initReceipt();
    }
    this.form.getControls('organizationUnitIds').valueChanges.subscribe(res => {
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
      this.form.getControls('sum').setValue(res);
    });
    // if (!this.areControlsDisabled()) {
    //   return;
    // }
    this.renderer.addClass(document.getElementById('orgUnitSelect'), 'readonly');
  }

  ngOnInit() {
    this.portalService.clearFilters();
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
      ToasterService.openWarning(this.getLocalization('form_not_valid'));
      return;
    }
    const document = this.form.getRawValue() as Document;
    document.documentType.codePath = this.documentType;
    document.documentDetails = this.detailAction.formArray.value as Array<DocumentDetail>;
    this.execFunc(() => {
      this.documentService.save(document);
    }, ActionType.Save);
  }


  areControlsDisabled = () => this.action === actionEnum.View;
  checkType = (type: string) => this.documentType === type;

  getLists() {
    this.execGetFunc(() => {
      return this.systemService.getOrganizationUnits().then(res => {
        this.organizationUnits = res.data.map(x => new SelectListModel(x.organizationUnitId, x.name));
      }) as Promise<ResponseBase<OrganizationUnit>>;
    });
    this.execGetFunc(() => {
      return this.systemService.getDocumentStatuses().then(res => {
        this.documentStatuses = res.data.map(x => new SelectListModel(x.documentStatusId,
          this.getLocalization('label' + x.code.insertStringBetweenUpper('_'))
        ));
      }) as Promise<ResponseBase<DocumentStatus>>;
    });

    if (this.checkType('pricelists')) {
      this.execGetFunc(() => {
        return this.systemService.getPricelistTypes().then(res => {
          this.pricelistTypes = res.data.map(x =>
            new SelectListModel(
              x.pricelistTypeId,
              this.getLocalization('label' + x.name.insertStringBetweenUpper('_')),
              x.code));
        }) as Promise<ResponseBase<PriceListType>>;
      });
    } else {
      this.customerService.selectAll();
    }
  }

  getData() {
    if (!this.getId()) {
      this.detailAction.bindToEmployeeToggle(!this.checkType('pricelists'));
      return;
    }
    this.getById(documentId => {
      return this.documentService.selectById(documentId).then(res => {
        this.detailAction.bindToEmployeeToggle(res.data.schedule ? res.data.schedule.bindToEmployee : false);
        FormGroupHelper.mapObjectToFormGroup(res.data, this.form);
        const details = (this.form.getControls('documentDetails') as FormArray);
        this.detailAction.data.next(details);
      }) as Promise<any>;
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
    this.form.getControls('pricelistTypeId').valueChanges.subscribe(res => {
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
    this.displayedColumns = ['employee', 'product', 'price', 'discount', 'priceWithDiscount', 'actions'];
  }
}
