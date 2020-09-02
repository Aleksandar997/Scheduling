import { Component, OnInit, Injector, AfterViewInit, ViewChild, EventEmitter } from '@angular/core';
import { FormBase } from 'src/app/common/base/formBase';
import { Resource, ResourcePaging } from 'src/app/common/models/resource';
import { LoaderComponent } from 'src/app/common/components/loader/loader.component';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ModalBaseComponent } from 'src/app/common/modals/modalBase/modalBase.component';
import { LocalizationService } from 'src/app/common/services/localization.service';
import { ToasterService } from 'src/app/common/components/toaster/toaster.service';
import { DataGridComponent } from 'src/app/common/components/dataGrid/dataGrid.component';
import { ResponseBase } from 'src/app/common/models/responseBase';

@Component({
  templateUrl: './translates.component.html',
  styleUrls: ['./translates.component.css']
})
export class TranslatesComponent extends FormBase implements OnInit, AfterViewInit {
  @ViewChild(DataGridComponent) dataGrid: DataGridComponent<any>;
  displayedColumns = ['resource', 'translates', 'cultures', 'actions'];
  @ViewChild('loader') loader: LoaderComponent;
  dataSource = new MatTableDataSource<Resource>();
  filters: FormGroup = this.fb.group({
    resource: new FormControl(null)
  });
  loaderEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  confirmationModal = new ModalBaseComponent(this.dialog);
  constructor(private inj: Injector, private fb: FormBuilder,
              private localizationService: LocalizationService, private dialog: MatDialog) {
    super(inj);
  }
  paging = new ResourcePaging();
  // organizationUnits = new Array<SelectListModel>();
  // productTypes = new Array<SelectListModel>();
  datasourceLength;
  ngOnInit() {
    this.filters.valueChanges.subscribe(res => {
      this.paging.assign(res);
      this.awaitExecution(() => this.getData());
    });
  }

  ngAfterViewInit() {
    this.selectList();
    this.getData();
  }

  getData() {
    this.paging.onPageChange(this.dataGrid.getSize());
    this.execGetFunc(() => {
      return this.localizationService.selectAll(this.paging).then(res => {
        this.dataSource = new MatTableDataSource<Resource>(res.data);
        this.datasourceLength = res.count;
      }) as Promise<ResponseBase<Array<Resource>>>;
    });
  }

  selectList() {
    // this.loader.show();
    // this.systemService.getOrganizationUnits().then(res => {
    //   this.organizationUnits = res.data.map(x => new SelectListModel(x.organizationUnitId, x.name));
    // }).catch(err => {
    //   this.loader.hide();
    //   ToasterService.handleErrors(err, 'organization_unit_get_error');
    // });
    // this.systemService.getProductTypes().then(res => {
    //   this.productTypes = res.data.map(x => new SelectListModel(x.productTypeId, x.name));
    // }).catch(err => {
    //   this.loader.hide();
    //   ToasterService.handleErrors(err, 'product_type_get_error');
    // });
  }

  deleteProduct(productId: number) {
    // this.confirmationModal.openDialog(
    //   new ModalBase('confirm_product_delete_title', 'confirm_product_delete_text', null, this.loaderEmitter, () => {
    //     this.loaderEmitter.emit(true);
    //     this.productService.deleteProduct(productId).then(() => {
    //       this.loaderEmitter.emit(false);
    //       ToasterService.openSuccess('product_delete_success');
    //       this.confirmationModal.closeDialog();
    //     }).catch(err => {
    //       ToasterService.handleErrors(err, 'product_delete_error')
    //       this.loaderEmitter.emit(false);
    //       this.confirmationModal.closeDialog();
    //     });
    //   }), ConfirmationModalComponent);
  }

  onRowClickLink = (resource: Resource) => '/edit/' + resource.resourceId;

  onPageChange(size: any) {
    this.paging.onPageChange(size);
    this.getData();
  }
  onSortChange(sort) {
    this.paging.onSortChange(sort);
    this.getData();
  }
}
