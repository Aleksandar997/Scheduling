import { Component, OnInit, AfterViewInit, Injector } from '@angular/core';
import { MatTableDataSource, } from '@angular/material';
import { Product, ProductPaging } from '../models/product';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { SystemService } from '../services/system.service';
import { SelectListModel } from '../common/models/selectListModel';
import { FormBase, ActionType } from '../common/base/formBase';
import { ResponseBase } from '../common/models/responseBase';
import { OrganizationUnit } from '../models/organizationUnit';
import { ProductType } from '../models/productType';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent extends FormBase implements OnInit, AfterViewInit {
  displayedColumns = ['name', 'code', 'productTypeName', 'active', 'actions'];
  dataSource = new MatTableDataSource<Product>();
  filters: FormGroup = this.fb.group({
    name: new FormControl(),
    code: new FormControl(),
    productTypes: new FormControl(),
    organizationUnits: new FormControl([])
  });
  constructor(private inj: Injector, private fb: FormBuilder, private productService: ProductService,
              private systemService: SystemService) {
    super(inj);
    this.genericName = 'product';
  }
  paging = new ProductPaging();
  organizationUnits = new Array<SelectListModel>();
  productTypes = new Array<SelectListModel>();
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
    this.execGetFunc(() => {
      return this.productService.getProducts(this.paging).then(res => {
        this.dataSource.data = res.data;
        this.datasourceLength = res.count;
      }) as Promise<ResponseBase<Product>>;
    });
  }

  selectList() {
    this.execGetFunc(() => {
      return this.systemService.getOrganizationUnits().then(res => {
        this.organizationUnits = res.data.map(x => new SelectListModel(x.organizationUnitId, x.name));
      }) as Promise<ResponseBase<Array<OrganizationUnit>>>;
    });
    this.execGetFunc(() => {
      return this.systemService.getProductTypes().then(res => {
        this.productTypes = res.data.map(x => new SelectListModel(x.productTypeId, x.name));
      }) as Promise<ResponseBase<Array<ProductType>>>;
    });

  }

  deleteProduct(productId: number) {
    this.execFunc(() => {
      this.productService.deleteProduct(productId);
    }, ActionType.Delete);
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
