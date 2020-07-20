import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef, Injector, Renderer2, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { FormArray, FormBuilder, AbstractControl, FormControl, Validators, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { Subject, Subscription, merge, Observable } from 'rxjs';
import { ProductPricelist } from 'src/app/models/product';
import { ErrorStateMatcherAdapter } from '../../adapters/errorStateMatcherAdapter';
import { DocumentDetail } from 'src/app/models/documentDetail';
import { SelectListModel } from '../../models/selectListModel';
import { SystemService } from 'src/app/services/system.service';
import { FormBase } from '../../base/formBase';
import { ToasterComponent } from '../toaster/toaster.component';

@Component({
  selector: 'detail-action',
  templateUrl: './detailAction.component.html',
  styleUrls: ['./detailAction.component.css']
})
export class DetailActionComponent extends FormBase implements OnInit, OnDestroy {
  @ViewChildren('price') prices: QueryList<ElementRef>;
  dataSource = new MatTableDataSource<AbstractControl>();
  @Input() gridName;
  @Input() displayedColumns = [];
  formArray = new FormArray([]);
  @Input() areControlsDisabled = false;
  @Input() matcher = new ErrorStateMatcherAdapter();
  @Input() toasterRef: ToasterComponent;
  organizationUnitId: number;
  pricelist = new Array<ProductPricelist>();
  data = new Subject<FormArray>();
  sum = new Subject<number>();
  private subs = new Array<Subscription>();
  throwError = new Subject<string>();

  employees = new Array<SelectListModel>();
  products = new Array<SelectListModel>();

  constructor(private inj: Injector, private fb: FormBuilder, private changeDetector: ChangeDetectorRef,
              private systemService: SystemService, private renderer: Renderer2) {
    super(inj);
    this.getLists();
    this.subs.push(
      this.data.subscribe(res => {
        this.formArray = res;

        this.formArray.controls.forEach(x => {
          if (this.areControlsDisabled) {
            x.disable({ onlySelf: true });
          }
          x.get('priceWithDiscount').disable({ onlySelf: true });
          this.setOnValueChange(x as FormGroup);
        });
        this.dataSource.data = this.formArray.controls;
        this.changeDetector.detectChanges();
      })
    );
  }

  setOrganizationUnit(organizationUnitId: number) {
    this.organizationUnitId = organizationUnitId;
    this.formArray.controls.forEach(x => this.calculation(x as FormGroup, null, organizationUnitId));
  }


  calculation(formGroup: FormGroup, productId: number = null, organizationUnitId = null) {
    this.organizationUnitId = organizationUnitId ? organizationUnitId : this.organizationUnitId;
    const fbVal = formGroup.value as DocumentDetail;
    productId = productId ? productId : fbVal.productId;
    const price = this.pricelist.find(p =>
      (
        p.organizationUnitId === this.organizationUnitId
      ) &&
      p.productId === +productId
    );
    if (price) {
      this.toasterRef.openSuccess('price_taken_from_pricelist');
      const priceEl = this.prices.find((item, i) => i === this.formArray.controls.indexOf(formGroup));
      const orgUnitEl = document.getElementById('orgUnitSelect');
      this.renderer.removeClass(priceEl.nativeElement, 'priceFromPricelist');
      this.renderer.removeClass(orgUnitEl, 'priceFromPricelist');
      setTimeout(() => {
        this.renderer.addClass(priceEl.nativeElement, 'priceFromPricelist');
        this.renderer.addClass(orgUnitEl, 'priceFromPricelist');
      }, 1);
      fbVal.price = price.price;
    }
    formGroup.get('price').setValue(fbVal.price);
  }
  isNull = (val: any, elseValue: any) => val ? val : elseValue;

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subs.forEach(x => x.unsubscribe());
  }

  isControlRequired(controlName: string) {
    return this.displayedColumns.indexOf(controlName) > -1 ? [Validators.required] : [];
  }

  addDetail() {
    const formGroup = this.fb.group({
      documentDetailId: new FormControl(),
      productId: new FormControl({ value: null, disabled: this.areControlsDisabled }, this.isControlRequired('product')),
      employeeId: new FormControl({ value: null, disabled: this.areControlsDisabled }, this.isControlRequired('employee')),
      quantity: new FormControl({ value: null, disabled: this.areControlsDisabled }, this.isControlRequired('quantity')),
      price: new FormControl({ value: 0, disabled: this.areControlsDisabled },
        this.displayedColumns.indexOf('price') > -1 ? [Validators.required, Validators.min(1)] : []
      ),
      discount: new FormControl({ value: 0, disabled: this.areControlsDisabled }),
      priceWithDiscount: new FormControl({ value: 0, disabled: true })
    });
    this.setOnValueChange(formGroup);
    this.formArray.push(formGroup);
    this.dataSource.data = this.formArray.controls;
    this.dataSource._updateChangeSubscription();
  }

  deleteDetail(index: number) {
    this.formArray.removeAt(index);
    this.dataSource.data = this.formArray.controls;
    this.dataSource._updateChangeSubscription();
  }

  setOnValueChange(formGroup: FormGroup) {
    this.getControls(formGroup, 'productId').valueChanges.subscribe(res => {
      this.calculation(formGroup, res);
    });
    // let mergearr;
    // if (this.displayedColumns.indexOf('quantity') > -1) {
    //   mergearr = merge(
    //     this.getControls(formGroup, 'price').valueChanges,
    //     this.getControls(formGroup, 'quantity').valueChanges,
    //     this.getControls(formGroup, 'discount').valueChanges,
    //   );
    // } else {
    //   mergearr = merge(
    //     this.getControls(formGroup, 'price').valueChanges,
    //     this.getControls(formGroup, 'discount').valueChanges,
    //   );
    // }
    this.getControls(formGroup, 'discount').valueChanges.subscribe(res => {
      const fbVal = formGroup.value as DocumentDetail;
      formGroup.get('priceWithDiscount').setValue(fbVal.price * (1 - (res ? res : 0) / 100));
      this.calculateSum();
    });

    this.getControls(formGroup, 'price').valueChanges.subscribe(res => {
      const fbVal = formGroup.value as DocumentDetail;
      formGroup.get('priceWithDiscount').setValue(res * (1 - (fbVal.discount ? fbVal.discount : 0) / 100));
      this.calculateSum();
    });
  }

  calculateSum() {
    const arr = this.formArray.controls.map((x: FormGroup) => x.get('priceWithDiscount').value);
    if (arr && arr.length > 0) {
      this.sum.next(arr.reduce((a, b) => a + b));
    }
  }

  getLists() {
    this.systemService.getEmployees().then(res => {
      this.employees = res.data.map(x => new SelectListModel(x.employeeId, `${x.user.firstName} ${x.user.lastName}`));
    }).catch(err => {
      this.throwError.next('employee_get_error');
    });
    this.systemService.getProducts().then(res => {
      res.data.forEach(e => {
        this.pricelist = [...this.pricelist, ...e.productPricelist];
      });
      this.products = res.data.map(x => new SelectListModel(x.productId, x.name)).filter(this.onlyUnique);
    }).catch(err => {
      this.throwError.next('product_get_error');
    });
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
}
