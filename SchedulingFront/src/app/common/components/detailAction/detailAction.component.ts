import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectorRef,
  Injector,
  Renderer2,
  ViewChildren,
  ElementRef,
  QueryList,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { FormArray, FormBuilder, AbstractControl, FormControl, Validators, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatSelect } from '@angular/material';
import { Subject, Subscription } from 'rxjs';
import { ProductPricelist, EmployeeOrganizationUnitProduct } from 'src/app/models/product';
import { ErrorStateMatcherAdapter } from '../../adapters/errorStateMatcherAdapter';
import { DocumentDetail } from 'src/app/models/documentDetail';
import { SelectListModel } from '../../models/selectListModel';
import { SystemService } from 'src/app/services/system.service';
import { FormBase } from '../../base/formBase';
import { LocalData } from '../../data/localData';
import { ToasterService } from '../toaster/toaster.service';

@Component({
  selector: 'detail-action',
  templateUrl: './detailAction.component.html',
  styleUrls: ['./detailAction.component.css']
})
export class DetailActionComponent extends FormBase implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('price') prices: QueryList<ElementRef>;
  @ViewChild('product') product: MatSelect;
  dataSource = new MatTableDataSource<AbstractControl>();
  @Input() gridName;
  @Input() displayedColumns = [];
  formArray = new FormArray([]);
  @Input() areControlsDisabled = false;
  @Input() matcher = new ErrorStateMatcherAdapter();
  organizationUnitId: number;
  pricelist = new Array<ProductPricelist>();
  data = new Subject<FormArray>();
  sum = new Subject<number>();
  private subs = new Array<Subscription>();
  throwError = new Subject<string>();

  allEmployees = new Array<SelectListModel>();
  employees = new Array<SelectListModel>();

  isAdmin = LocalData.isUserAdmin();

  bindToEmployee = true;
  productSelectList = new Array<SelectListModel>();

  productsByOrgUnits = new Array<EmployeeOrganizationUnitProduct>();
  filteredProductsByOrgUnits = new Array<EmployeeOrganizationUnitProduct>();
  getProductSelectList(element: FormGroup) {
    if (this.bindToEmployee) {
      const products = element.getControls('availableProducts');
      if (!products) {
        return null;
      }
      return products.value;
    }
    return this.productSelectList;
  }


  constructor(private inj: Injector, private fb: FormBuilder, private changeDetector: ChangeDetectorRef,
              private systemService: SystemService, private renderer: Renderer2) {
    super(inj);
    this.getLists();
    this.subs.push(
      this.data.subscribe(res => {
        this.formArray = res;

        this.formArray.controls.forEach((x: FormGroup) => {
          x.addControl('availableProducts', new FormArray([]));
          if (this.bindToEmployee) {
            this.setAvailableProducts(x.getControls('employeeId').value, x);
          }
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

  setOrganizationUnit(organizationUnitId: number | Array<number>) {
    if (!Array.isArray(organizationUnitId)) {
      this.organizationUnitId = organizationUnitId;
      this.filteredProductsByOrgUnits = this.productsByOrgUnits.filter(x => x.organizationUnitId === organizationUnitId);
      if (this.bindToEmployee) {
        this.employees = this.allEmployees.filter(x => this.filteredProductsByOrgUnits.find(e => e.employeeId === x.id));
        this.formArray.controls.forEach((e: FormGroup) => {
          const employeeIdControl = e.getControls('employeeId');
          if (!this.employees.find(x => x.id === employeeIdControl.value)) {
            employeeIdControl.setValue(null);
          } else {
            employeeIdControl.updateValueAndValidity();
          }
          e.getControls('productId').updateValueAndValidity();
        });
      }
    } else {
      this.filteredProductsByOrgUnits = this.productsByOrgUnits.filter(x => organizationUnitId.includes(x.organizationUnitId));

      this.employees = this.allEmployees.filter(x => this.filteredProductsByOrgUnits.find(e => e.employeeId === x.id));
    }
    this.filteredProductsByOrgUnits.forEach(x => {
      if (!this.productSelectList.find(l => l.id === x.productId)) {
        this.productSelectList.push(new SelectListModel(x.productId, x.name));
      }
    });
  }

  bindToEmployeeToggle(bind: boolean) {
    this.bindToEmployee = bind;
    // if (!this.bindToEmployee) {
    // this.productSelectList = this.filteredProductsByOrgUnits.map(p => new SelectListModel(p.productId, p.name)).filter(this.onlyUnique);
    // }
  }


  calculation(formGroup: FormGroup, productId: number = null, organizationUnitId = null) {
    this.organizationUnitId = organizationUnitId ? organizationUnitId : this.organizationUnitId;
    if (!productId) {
      return;
    }
    const fbVal = formGroup.value as DocumentDetail;
    const price = this.pricelist.find(p =>
      (
        p.organizationUnitId === this.organizationUnitId
      ) &&
      p.productId === +productId
    );
    if (price) {
      ToasterService.openSuccess('price_taken_from_pricelist');
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

  ngAfterViewInit() {

  }

  isControlRequired(controlName: string) {
    return this.displayedColumns.indexOf(controlName) > -1 ? [Validators.required] : [];
  }

  isEmployeeRequired = () =>
      this.displayedColumns.indexOf('employee') > -1 && this.bindToEmployee ? [Validators.required] : []

  addDetail() {
    const formGroup = this.fb.group({
      documentDetailId: new FormControl(),
      productId: new FormControl({ value: null, disabled: this.areControlsDisabled }, this.isControlRequired('product')),
      availableProducts: new FormArray([]),
      employeeId: new FormControl({ value: null, disabled: this.areControlsDisabled }, this.isEmployeeRequired()),
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

  setOnValueChange(formGroup: FormGroup) {
    if (this.bindToEmployee) {
      formGroup.getControls('employeeId').valueChanges.subscribe(res => {
        this.setAvailableProducts(res, formGroup);
      });
    }
    if (!this.isAdmin) {
      formGroup.getControls('employeeId').setValue(LocalData.getUser().employeeId);
    }
    formGroup.getControls('productId').valueChanges.subscribe(res => {
      this.calculation(formGroup, res);
    });
    formGroup.getControls('discount').valueChanges.subscribe(res => {
      const fbVal = formGroup.value as DocumentDetail;
      formGroup.get('priceWithDiscount').setValue(fbVal.price * (1 - (res ? res : 0) / 100));
      this.calculateSum();
    });

    formGroup.getControls('price').valueChanges.subscribe(res => {
      const fbVal = formGroup.value as DocumentDetail;
      formGroup.get('priceWithDiscount').setValue(res * (1 - (fbVal.discount ? fbVal.discount : 0) / 100));
      this.calculateSum();
    });
  }

  setAvailableProducts(employeeId: number, formGroup: FormGroup) {
    const prodFA = formGroup.getControls('availableProducts') as FormArray;
    prodFA.clear();
    const available = this.filteredProductsByOrgUnits.filter(x => x.employeeId === employeeId);
    const productControl = formGroup.getControls('productId');
    if (!available.find(x => x.productId === productControl.value)) {
      productControl.setValue(null);
    }
    available.forEach(e => {
      prodFA.push(this.fb.group({
        id: e.productId,
        name: e.name
      }));
    });
  }

  deleteDetail(index: number) {
    this.formArray.removeAt(index);
    this.dataSource.data = this.formArray.controls;
    this.dataSource._updateChangeSubscription();
  }

  calculateSum() {
    const arr = this.formArray.controls.map((x: FormGroup) => x.get('priceWithDiscount').value);
    if (arr && arr.length > 0) {
      this.sum.next(arr.reduce((a, b) => a + b));
    }
  }

  getLists() {
    this.systemService.getProducts(null, true).then(res => {
      this.productsByOrgUnits = res.data.productsByOrgUnit;
      this.pricelist = res.data.productPricelist;
    }).catch(err => {
      this.throwError.next('product_get_error');
    });

    this.systemService.getEmployees().then(res => {
      this.allEmployees = res.data.map(x => new SelectListModel(x.employee.employeeId, `${x.firstName} ${x.lastName}`));

    }).catch(err => {
      this.throwError.next('employee_get_error');
    });
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
}
