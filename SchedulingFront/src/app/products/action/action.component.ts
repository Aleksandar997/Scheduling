import { Component, OnInit, Injector, ViewChild, AfterViewInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBase } from 'src/app/common/base/formBase';
import { actionEnum } from 'src/app/common/enums';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { FormGroupHelper } from 'src/app/common/helpers/formGroupHelper';
import { SelectListModel } from 'src/app/common/models/selectListModel';
import { ToasterComponent } from 'src/app/common/components/toaster/toaster.component';
import { LoaderComponent } from 'src/app/common/components/loader/loader.component';
import { SystemService } from 'src/app/services/system.service';
import { Subscription } from 'rxjs';
import { ProductPricelist } from 'src/app/models/product';
import { ModalBaseComponent } from 'src/app/common/modals/modalBase/modalBase.component';
import { ModalBase } from 'src/app/common/models/modalBase';
import { ConfirmationModalComponent } from 'src/app/common/modals/confirmationModal/confirmationModal.component';

@Component({
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent extends FormBase implements OnInit, AfterViewInit {
  @ViewChild('toaster', { static: false }) toaster: ToasterComponent;
  @ViewChild('loader', { static: false }) loader: LoaderComponent;
  dataSource = new MatTableDataSource<any>();
  action: actionEnum;
  form: FormGroup;
  productTypes = new Array<SelectListModel>();
  organizationUnits = new Array<SelectListModel>();
  displayedColumns = ['organizationUnit', 'price'];
  productId: number;
  pricelist = new Array<ProductPricelist>();

  loaderEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  confirmationModal = new ModalBaseComponent(this.dialog);
  constructor(private inj: Injector, private activatedRoute: ActivatedRoute, private fb: FormBuilder, private changeDetector: ChangeDetectorRef,
    private productService: ProductService, private dialog: MatDialog, private systemService: SystemService) {
    super(inj);
    this.action = this.activatedRoute.snapshot.data.action as actionEnum;
    this.form = this.fb.group({
      productId: new FormControl(null),
      name: new FormControl({ value: null, disabled: this.areControlsDisabled() }, [Validators.required]),
      code: new FormControl({ value: null, disabled: this.areControlsDisabled() }, [Validators.required]),
      active: new FormControl({ value: null, disabled: this.areControlsDisabled() }, [Validators.required]),
      productTypeId: new FormControl({ value: null, disabled: this.areControlsDisabled() }, [Validators.required]),
      organizationUnits: new FormControl({ value: null, disabled: this.areControlsDisabled() }),
      productPricelist: new FormArray([])
    });
    this.productId = +this.activeRouter.snapshot.params.id;
  }

  ngOnInit() {
    this.getControls(this.form, 'organizationUnits').valueChanges.subscribe(res => {
      if (!res) {
        return;
      }
      const pricelit = this.pricelist.filter(x => res.includes(x.organizationUnitId)).map(x => {
        return this.fb.group({
          organizationUnitId: new FormControl(x.organizationUnitId),
          organizationUnitName: new FormControl(x.organizationUnitName),
          price: new FormControl(+x.price),
          documentId: new FormControl(x.documentId),
          documentDetailId: new FormControl(x.documentDetailId)
        });
      });
      (this.form.get('productPricelist') as FormArray).clear();
      pricelit.forEach(x => (this.form.get('productPricelist') as FormArray).push(x));
      this.dataSource._updateChangeSubscription();
    });
  }

  productsById() {
    this.productService.getProductById(this.productId > 0 ? this.productId : 0).then(res => {
      this.pricelist = res.data.productPricelist;
      res.data.productPricelist = new Array<ProductPricelist>();
      FormGroupHelper.mapObjectToFormGroup(res.data, this.form);
      const pricelistControls = (this.getControls(this.form, 'productPricelist') as FormArray).controls;
      if (this.areControlsDisabled()) {
        pricelistControls.forEach(x => x.disable({ onlySelf: true }));
      }
      this.dataSource.data = pricelistControls;
      this.changeDetector.detectChanges();
      this.loader.hide();
    }).catch(err => {
      this.loader.hide();
      this.toaster.handleErrors(err, 'product_get_error');
    });
  }

  selectList() {
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
      this.toaster.handleErrors(err, 'product_types_get_error');
    });
  }

  ngAfterViewInit() {
    this.loader.show();
    this.selectList();
    this.productsById();
  }

  navigateBack() {
    this.router.navigate(['/products']);
  }

  submit() {
    if (!FormGroupHelper.isValid(this.form)) {
      this.toaster.openWarning(this.getLocalization('form_not_valid'));
      return;
    }
    this.loader.show();
    try {
      this.confirmationModal.openDialog(
        new ModalBase('confirm_product_save_title', 'confirm_product_save_text', null, this.loaderEmitter, () => {
          this.productService.saveProduct(this.form.getRawValue()).then(() => {
            this.loader.hide();
            this.toaster.openSuccess('product_save_success');
            this.confirmationModal.closeDialog();
            this.navigateBack();
          }).catch(() => {
            this.loader.hide();
            this.toaster.openError('product_save_error');
            this.confirmationModal.closeDialog();
          });
        }), ConfirmationModalComponent);
    } catch (err) {
      this.loader.hide();
      this.toaster.handleErrors(err, 'customer_save_error');
    }
  }
  areControlsDisabled = () => this.action === actionEnum.View;

}
