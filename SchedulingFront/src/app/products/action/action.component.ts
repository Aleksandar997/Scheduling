import { Component, OnInit, Injector, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActionType } from 'src/app/common/base/formBase';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { MatTableDataSource } from '@angular/material';
import { FormGroupHelper } from 'src/app/common/helpers/formGroupHelper';
import { SelectListModel } from 'src/app/common/models/selectListModel';
import { SystemService } from 'src/app/services/system.service';
import { ProductPricelist, Product } from 'src/app/models/product';
import { ActionFormBase } from 'src/app/common/base/actionFormBase';
import { ResponseBase } from 'src/app/common/models/responseBase';
import { OrganizationUnit } from 'src/app/models/organizationUnit';
import { ProductType } from 'src/app/models/productType';

@Component({
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent extends ActionFormBase<Product> implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<any>();
  form: FormGroup;
  productTypes = new Array<SelectListModel>();
  organizationUnits = new Array<SelectListModel>();
  displayedColumns = ['organizationUnit', 'price'];
  pricelist = new Array<ProductPricelist>();

  constructor(private inj: Injector, private changeDetector: ChangeDetectorRef,
              private productService: ProductService, private systemService: SystemService) {
    super(inj);
    this.form = this.fb.group({
      productId: new FormControl(null),
      name: new FormControl({ value: null, disabled: this.areControlsDisabled() }, [Validators.required]),
      code: new FormControl({ value: null, disabled: this.areControlsDisabled() }, [Validators.required]),
      active: new FormControl({ value: null, disabled: this.areControlsDisabled() }, [Validators.required]),
      productTypeId: new FormControl({ value: null, disabled: this.areControlsDisabled() }, [Validators.required]),
      organizationUnits: new FormControl({ value: null, disabled: this.areControlsDisabled() }),
      productPricelist: new FormArray([])
    });
    this.navigateBackUrl = 'products';
    this.genericName = 'role';
  }

  ngOnInit() {
    this.portalService.clearFilters();
    this.form.getControls('organizationUnits').valueChanges.subscribe(res => {
      if (!res) {
        return;
      }
      let pricelist = [];
      if (this.getId() > 0) {
        pricelist = this.pricelist.filter(x => res.includes(x.organizationUnitId)).map(x => {
          return this.fb.group({
            organizationUnitId: new FormControl(x.organizationUnitId),
            organizationUnitName: new FormControl(x.organizationUnitName),
            price: new FormControl(+x.price),
            documentId: new FormControl(x.documentId),
            documentDetailId: new FormControl(x.documentDetailId)
          });
        });
      } else {
        pricelist = this.organizationUnits.filter(x => res.includes(x.id)).map(x => {
          return this.fb.group({
            organizationUnitId: new FormControl(x.id),
            organizationUnitName: new FormControl(x.name),
            price: new FormControl(null),
            documentId: new FormControl(null),
            documentDetailId: new FormControl(null)
          });
        })
      }
      (this.form.get('productPricelist') as FormArray).clear();
      pricelist.forEach(x => (this.form.get('productPricelist') as FormArray).push(x));
      this.dataSource.data = pricelist;
      // this.dataSource._updateChangeSubscription();
    });
  }

  productsById() {
    this.getById(productId => {
      return this.productService.getProductById(productId).then(res => {
        this.pricelist = res.data.productPricelist;
        res.data.productPricelist = new Array<ProductPricelist>();
        FormGroupHelper.mapObjectToFormGroup(res.data, this.form);
        const pricelistControls = (this.form.getControls('productPricelist') as FormArray).controls;
        if (this.areControlsDisabled()) {
          pricelistControls.forEach(x => x.disable({ onlySelf: true }));
        }
        this.dataSource.data = pricelistControls;
        this.changeDetector.detectChanges();
      }) as Promise<ResponseBase<Product>>;
    });
  }

  selectList() {
    this.execGetFunc(() => {
      return this.systemService.getOrganizationUnits().then(res => {
        this.organizationUnits = res.data.map(x => new SelectListModel(x.organizationUnitId, x.name));
      }) as Promise<ResponseBase<OrganizationUnit>>;
    });
    this.execGetFunc(() => {
      return this.systemService.getProductTypes().then(res => {
        this.productTypes = res.data.map(x => new SelectListModel(x.productTypeId, x.name));
      }) as Promise<ResponseBase<ProductType>>;
    });
  }

  ngAfterViewInit() {
    this.selectList();
    if (this.getId() > 0) {
      this.productsById();
    }
  }

  navigateBack() {
    this.router.navigate(['/products']);
  }

  submit() {
    return this.execFunc(() => {
      this.productService.saveProduct(this.form.getRawValue());
    }, ActionType.Save, this.form);
  }
}
