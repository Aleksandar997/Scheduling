import { Component, OnInit, AfterViewInit, ViewChild, Injector, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';
import { DocumentPaging } from 'src/app/models/document';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ToasterComponent } from 'src/app/common/components/toaster/toaster.component';
import { LoaderComponent } from 'src/app/common/components/loader/loader.component';
import { Document } from '../../models/document';
import { DataGridComponent } from 'src/app/common/components/dataGrid/dataGrid.component';
import { SelectListModel } from 'src/app/common/models/selectListModel';
import { SystemService } from 'src/app/services/system.service';
import { CustomerService } from 'src/app/services/customer.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { FormBase } from 'src/app/common/base/formBase';
import { ModalBaseComponent } from 'src/app/common/modals/modalBase/modalBase.component';
import { ModalBase } from 'src/app/common/models/modalBase';
import { ConfirmationModalComponent } from 'src/app/common/modals/confirmationModal/confirmationModal.component';

@Component({
  selector: 'document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent extends FormBase implements OnInit, AfterViewInit {
  @ViewChild('toaster', { static: false }) toaster: ToasterComponent;
  @ViewChild('loader', { static: false }) loader: LoaderComponent;
  @ViewChild('documentGrid', { static: false }) documentGrid: DataGridComponent<Document>;

  filters: FormGroup;
  modalBase = new ModalBaseComponent(this.dialog);
  documentType: string;
  reuseSub: Subscription;
  paging: DocumentPaging;
  displayedColumns: string[];
  datasourceLength;
  dataSource = new MatTableDataSource<Document>();
  loaderEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  organizationUnits = new Array<SelectListModel>();
  customers = new Array<SelectListModel>();
  pricelistTypes = new Array<SelectListModel>();
  customersSub: Subscription;
  getDataInConstructor = false;
  documentStatuses = new Array<SelectListModel>();
  constructor(private inj: Injector, private _route: ActivatedRoute, private documentService: DocumentService, private dialog: MatDialog,
    private systemService: SystemService, private customerService: CustomerService, private fb: FormBuilder) {
    super(inj);
    this.reuseSub = this._route.params.subscribe(params => {
      if (this.documentType) {
        this.getDataInConstructor = true;
      }
      this.documentType = params.code;
      if (this.documentType === 'pricelists') {
        this.filters = this.fb.group({
          documentNumber: new FormControl(),
          documentStatusId: new FormControl(),
          date: new FormControl(),
          pricelistTypes: new FormControl([]),
          dateFrom: new FormControl(),
          dateTo: new FormControl(),
          organizationUnits: new FormControl([])
        });
        this.displayedColumns = [
          'fullNumber',
          'documentStatus',
          'date',
          'dateTo',
          'dateFrom',
          'pricelistType',
          'organizationUnit',
          'actions'
        ];
      } else {
        this.filters = this.fb.group({
          documentNumber: new FormControl(),
          documentStatusId: new FormControl(),
          date: new FormControl(),
          customers: new FormControl([]),
          organizationUnits: new FormControl([])
        });
        this.displayedColumns = [
          'fullNumber',
          'documentStatus',
          'date',
          'customer',
          'organizationUnit',
          'sum',
          'actions'
        ];
      }
      this.paging = new DocumentPaging(this.documentType);
      this._route.snapshot.data.title = this._route.snapshot.data.title + '_' + this.documentType;
      if (this.getDataInConstructor) {
        this.getData();
      }
    });
    this.customersSub = this.customerService.customers.subscribe(res => {
      this.customers = res.map(x => new SelectListModel(x.customerId, x.firstName + ' ' + x.lastName));
    });
  }

  ngAfterViewInit() {
    this.getData();
    this.selectList();
  }

  getData() {
    this.loader.show();
    this.documentService.selectAllByType(this.paging).then(res => {
      this.dataSource.data = res.data;
      this.datasourceLength = res.count;
      this.dataSource._updateChangeSubscription();
      this.loader.hide();
    }).catch(err => {
      this.loader.hide();
      this.toaster.handleErrors(err, 'document_get_error');
    });
  }

  selectList() {
    this.loader.show();
    this.customerService.selectAll();
    this.systemService.getOrganizationUnits().then(res => {
      this.organizationUnits = res.data.map(x => new SelectListModel(x.organizationUnitId, x.name));
      this.loader.hide();
    }).catch(err => {
      this.loader.hide();
      this.toaster.handleErrors(err, 'organization_unit_get_error');
    });
    this.systemService.getPricelistTypes().then(res => {
      this.pricelistTypes = res.data.map(x => new SelectListModel(x.pricelistTypeId,
        this.getLocalization('label' + x.name.insertStringBetweenUpper('_')))
      );
      this.loader.hide();
    }).catch(err => {
      this.loader.hide();
      this.toaster.handleErrors(err, 'pricelist_type_get_error');
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
  }

  ngOnInit() {
    this.filters.valueChanges.subscribe(res => {
      this.paging.assign(res);
      this.getData();
    });
  }

  onRowClickLink = (document: Document) => '/edit/' + document.documentId;

  onPageChange(size: any) {
    this.paging.onPageChange(size);
    this.getData();
  }
  onSortChange(sort) {
    this.paging.onSortChange(sort);
    this.getData();
  }

  checkType = (type: string) => this.documentType === type;

  viewSchedule(scheduleId: number, index: number) {
    this.documentGrid.setCacheActivePage(index);
    this.router.navigateByUrl('/schedules/view/' + scheduleId, { state: { prevUrl: 'documents/' + this.documentType } });
  }

  cancelDocument(id: number) {
    this.modalBase.openDialog(
      new ModalBase('confirm_document_delete_title', 'confirm_document_delete_text', null, this.loaderEmitter, () => {
        this.loaderEmitter.emit(true);
        this.documentService.cancel(id).then(() => {
          this.loaderEmitter.emit(false);
          this.modalBase.closeDialog();
          this.toaster.openSuccess('document_delete_success');
          this.getData();
        }).catch(err => {
          this.loaderEmitter.emit(false);
          this.modalBase.closeDialog();
          this.toaster.handleErrors(err, 'document_delete_error');
        });
      }), ConfirmationModalComponent);
  }
}
