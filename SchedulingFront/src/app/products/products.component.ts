import { Component, OnInit, ViewChild, AfterViewInit, Injector, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { Product, ProductPaging } from '../models/product';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ToasterComponent } from '../common/components/toaster/toaster.component';
import { LoaderComponent } from '../common/components/loader/loader.component';
import { SystemService } from '../services/system.service';
import { SelectListModel } from '../common/models/selectListModel';
import { FormBase } from '../common/base/formBase';
import { ModalBaseComponent } from '../common/modals/modalBase/modalBase.component';
import { ModalBase } from '../common/models/modalBase';
import { ConfirmationModalComponent } from '../common/modals/confirmationModal/confirmationModal.component';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent extends FormBase implements OnInit, AfterViewInit {
  displayedColumns = ['name', 'code', 'productTypeName', 'active', 'actions'];
  @ViewChild('toaster', { static: false }) toaster: ToasterComponent;
  @ViewChild('loader', { static: false }) loader: LoaderComponent;
  dataSource = new MatTableDataSource<Product>();
  filters: FormGroup = this.fb.group({
    name: new FormControl(),
    code: new FormControl(),
    productTypes: new FormControl(),
    organizationUnits: new FormControl([])
  });
  loaderEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  confirmationModal = new ModalBaseComponent(this.dialog);
  constructor(private inj: Injector, private fb: FormBuilder, private productService: ProductService,
              private systemService: SystemService, private dialog: MatDialog) {
    super(inj);
  }
  paging = new ProductPaging();
  organizationUnits = new Array<SelectListModel>();
  productTypes = new Array<SelectListModel>();
  datasourceLength;
  ngOnInit() {
    this.filters.valueChanges.subscribe(res => {
      this.paging.assign(res);
      this.getData();
    });
  }

  ngAfterViewInit() {
    this.selectList();
    this.getData();
  }

  getData() {
    this.loader.show();
    this.productService.getProducts(this.paging).then(res => {
      this.dataSource.data = res.data;
      this.datasourceLength = res.count;
      this.loader.hide();
    }).catch(err => {
      this.loader.hide();
      this.toaster.handleErrors(err, 'products_get_error');
    });
  }

  selectList() {
    this.loader.show();
    this.systemService.getOrganizationUnits().then(res => {
      this.organizationUnits = res.data.map(x => new SelectListModel(x.organizationUnitId, x.name));
    }).catch(err => {
      this.loader.hide();
      this.toaster.handleErrors(err, 'organization_unit_get_error');
    });
    this.systemService.getProductTypes().then(res => {
      this.productTypes = res.data.map(x => new SelectListModel(x.productTypeId, x.name));
    }).catch(err => {
      this.loader.hide();
      this.toaster.handleErrors(err, 'product_type_get_error');
    });
  }

  deleteProduct(productId: number) {
    this.confirmationModal.openDialog(
      new ModalBase('confirm_product_delete_title', 'confirm_product_delete_text', null, this.loaderEmitter, () => {
        this.loaderEmitter.emit(true);
        this.productService.deleteProduct(productId).then(() => {
          this.loaderEmitter.emit(false);
          this.toaster.openSuccess('product_delete_success');
          this.confirmationModal.closeDialog();
        }).catch(err => {
          this.toaster.handleErrors(err, 'product_delete_error')
          this.loaderEmitter.emit(false);
          this.confirmationModal.closeDialog();
        });
      }), ConfirmationModalComponent);
  }

  onRowClickLink = (product: Product) => '/edit/' + product.productId;

  onPageChange(size: any) {
    this.paging.onPageChange(size);
    this.getData();
  }
  onSortChange(sort) {
    this.paging.onSortChange(sort);
    this.getData();
  }
}
